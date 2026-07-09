-- Texo demo — seguridad pública + reglas de negocio (RLS, triggers, storage)

-- ---------------------------------------------------------------------------
-- 1. Fix escalación de rol en signup (solo buyer | seller desde metadata)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_requested text;
  v_role public.user_role;
BEGIN
  v_requested := NEW.raw_user_meta_data->>'role';
  IF v_requested IN ('seller', 'buyer') THEN
    v_role := v_requested::public.user_role;
  ELSE
    v_role := 'buyer';
  END IF;

  INSERT INTO public.profiles (id, role, full_name, phone)
  VALUES (
    NEW.id,
    v_role,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- 2. Inmutabilidad de role en profiles (solo admin puede cambiar role)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.prevent_profile_role_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- Service role / postgres (auth.uid() null) — seed y mantenimiento
    IF auth.uid() IS NULL THEN
      RETURN NEW;
    END IF;
    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'Cannot change profile role';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_role_immutable ON public.profiles;
CREATE TRIGGER trg_profiles_role_immutable
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_role_change();

-- ---------------------------------------------------------------------------
-- 3. Reglas de negocio — offers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.enforce_offer_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_vehicle_published(NEW.vehicle_id) AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Cannot offer on unpublished vehicle';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_offers_insert_rules ON public.offers;
CREATE TRIGGER trg_offers_insert_rules
  BEFORE INSERT ON public.offers
  FOR EACH ROW EXECUTE FUNCTION public.enforce_offer_insert();

CREATE OR REPLACE FUNCTION public.enforce_offer_status_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can change offer status';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_offers_status_rules ON public.offers;
CREATE TRIGGER trg_offers_status_rules
  BEFORE UPDATE ON public.offers
  FOR EACH ROW EXECUTE FUNCTION public.enforce_offer_status_update();

-- ---------------------------------------------------------------------------
-- 4. Reglas de negocio — vehicles (solo admin publica)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.enforce_vehicle_status_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status = 'published' AND NOT public.is_admin() THEN
      RAISE EXCEPTION 'Only admin can publish vehicles';
    END IF;

    IF NOT public.is_admin() AND OLD.seller_id = auth.uid() THEN
      IF NEW.status NOT IN (
        'draft', 'pending_documents', 'pending_inspection', 'withdrawn'
      ) THEN
        RAISE EXCEPTION 'Invalid status transition for seller';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_vehicles_status_rules ON public.vehicles;
CREATE TRIGGER trg_vehicles_status_rules
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION public.enforce_vehicle_status_update();

-- ---------------------------------------------------------------------------
-- 5. Reglas de negocio — test drives (oferta aceptada)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.enforce_test_drive_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_offer_status public.offer_status;
BEGIN
  SELECT status INTO v_offer_status FROM public.offers WHERE id = NEW.offer_id;
  IF v_offer_status IS DISTINCT FROM 'accepted' AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Test drive requires accepted offer';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_test_drives_insert_rules ON public.test_drive_appointments;
CREATE TRIGGER trg_test_drives_insert_rules
  BEFORE INSERT ON public.test_drive_appointments
  FOR EACH ROW EXECUTE FUNCTION public.enforce_test_drive_insert();

-- ---------------------------------------------------------------------------
-- 6. Inspecciones — solo admin escribe
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS inspections_insert ON public.inspections;
CREATE POLICY inspections_insert ON public.inspections FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS inspections_update ON public.inspections;
CREATE POLICY inspections_update ON public.inspections FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS inspection_items_insert ON public.inspection_items;
CREATE POLICY inspection_items_insert ON public.inspection_items FOR INSERT
  WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------------------
-- 7. Storage — helper y políticas path-based ({vehicle_id}/...)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.storage_vehicle_id_from_path(path text)
RETURNS uuid
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT NULLIF((string_to_array(path, '/'))[1], '')::uuid;
$$;

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- vehicle-photos (público lectura)
DROP POLICY IF EXISTS vehicle_photos_public_read ON storage.objects;
CREATE POLICY vehicle_photos_public_read ON storage.objects FOR SELECT
  USING (bucket_id = 'vehicle-photos');

DROP POLICY IF EXISTS vehicle_photos_seller_insert ON storage.objects;
CREATE POLICY vehicle_photos_seller_insert ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'vehicle-photos'
    AND (
      public.is_vehicle_seller(public.storage_vehicle_id_from_path(name))
      OR public.is_admin()
    )
  );

DROP POLICY IF EXISTS vehicle_photos_seller_update ON storage.objects;
CREATE POLICY vehicle_photos_seller_update ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'vehicle-photos'
    AND (
      public.is_vehicle_seller(public.storage_vehicle_id_from_path(name))
      OR public.is_admin()
    )
  );

DROP POLICY IF EXISTS vehicle_photos_seller_delete ON storage.objects;
CREATE POLICY vehicle_photos_seller_delete ON storage.objects FOR DELETE
  USING (
    bucket_id = 'vehicle-photos'
    AND (
      public.is_vehicle_seller(public.storage_vehicle_id_from_path(name))
      OR public.is_admin()
    )
  );

-- transaction-documents (privado — INE, factura)
DROP POLICY IF EXISTS transaction_docs_select ON storage.objects;
CREATE POLICY transaction_docs_select ON storage.objects FOR SELECT
  USING (
    bucket_id = 'transaction-documents'
    AND (
      public.is_vehicle_seller(public.storage_vehicle_id_from_path(name))
      OR public.is_admin()
    )
  );

DROP POLICY IF EXISTS transaction_docs_insert ON storage.objects;
CREATE POLICY transaction_docs_insert ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'transaction-documents'
    AND (
      public.is_vehicle_seller(public.storage_vehicle_id_from_path(name))
      OR public.is_admin()
    )
  );

DROP POLICY IF EXISTS transaction_docs_update ON storage.objects;
CREATE POLICY transaction_docs_update ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'transaction-documents'
    AND (
      public.is_vehicle_seller(public.storage_vehicle_id_from_path(name))
      OR public.is_admin()
    )
  );

DROP POLICY IF EXISTS transaction_docs_delete ON storage.objects;
CREATE POLICY transaction_docs_delete ON storage.objects FOR DELETE
  USING (
    bucket_id = 'transaction-documents'
    AND (
      public.is_vehicle_seller(public.storage_vehicle_id_from_path(name))
      OR public.is_admin()
    )
  );

-- inspection-reports (privado — seller + admin)
DROP POLICY IF EXISTS inspection_reports_select ON storage.objects;
CREATE POLICY inspection_reports_select ON storage.objects FOR SELECT
  USING (
    bucket_id = 'inspection-reports'
    AND (
      public.is_vehicle_seller(public.storage_vehicle_id_from_path(name))
      OR public.is_admin()
    )
  );

DROP POLICY IF EXISTS inspection_reports_insert ON storage.objects;
CREATE POLICY inspection_reports_insert ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'inspection-reports'
    AND (
      public.is_vehicle_seller(public.storage_vehicle_id_from_path(name))
      OR public.is_admin()
    )
  );

DROP POLICY IF EXISTS inspection_reports_admin ON storage.objects;
CREATE POLICY inspection_reports_admin ON storage.objects FOR ALL
  USING (bucket_id = 'inspection-reports' AND public.is_admin());
