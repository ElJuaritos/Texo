-- Texo demo — schema inicial (api-surface v1)
-- Migración idempotente donde es posible

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

DO $$ BEGIN CREATE TYPE public.user_role AS ENUM ('seller', 'buyer', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.vehicle_status AS ENUM (
  'draft', 'pending_documents', 'pending_inspection', 'inspection_failed',
  'published', 'offer_accepted', 'sold', 'withdrawn'
);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.document_type AS ENUM (
  'ine', 'invoice', 'circulation_card', 'other'
);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.inspection_category AS ENUM (
  'exterior', 'interior', 'mechanical', 'documentation', 'road_test'
);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.offer_status AS ENUM (
  'pending', 'accepted', 'rejected', 'countered', 'expired'
);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.test_drive_status AS ENUM (
  'scheduled', 'completed', 'cancelled', 'no_show'
);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.transaction_status AS ENUM (
  'initiated', 'confirmed', 'closing', 'closed'
);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------------
-- Tablas
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  role public.user_role NOT NULL DEFAULT 'buyer',
  full_name text,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL CHECK (year >= 1900 AND year <= 2100),
  trim text,
  mileage integer NOT NULL CHECK (mileage >= 0),
  estimated_price numeric(12, 2),
  listing_price numeric(12, 2),
  status public.vehicle_status NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vehicle_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL REFERENCES public.vehicles (id) ON DELETE CASCADE,
  document_type public.document_type NOT NULL,
  storage_path text NOT NULL,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.inspections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL UNIQUE REFERENCES public.vehicles (id) ON DELETE CASCADE,
  inspector_name text NOT NULL,
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  passed boolean NOT NULL DEFAULT false,
  certified_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.inspection_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id uuid NOT NULL REFERENCES public.inspections (id) ON DELETE CASCADE,
  category public.inspection_category NOT NULL,
  component text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description text NOT NULL,
  photo_path text
);

CREATE TABLE IF NOT EXISTS public.offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL REFERENCES public.vehicles (id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  amount numeric(12, 2) NOT NULL CHECK (amount > 0),
  status public.offer_status NOT NULL DEFAULT 'pending',
  expires_at timestamptz,
  message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.test_drive_appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id uuid NOT NULL REFERENCES public.offers (id) ON DELETE CASCADE,
  vehicle_id uuid NOT NULL REFERENCES public.vehicles (id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  scheduled_at timestamptz NOT NULL,
  location text NOT NULL,
  status public.test_drive_status NOT NULL DEFAULT 'scheduled',
  buyer_confirmed boolean NOT NULL DEFAULT false,
  seller_confirmed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL REFERENCES public.vehicles (id) ON DELETE CASCADE,
  offer_id uuid NOT NULL REFERENCES public.offers (id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  status public.transaction_status NOT NULL DEFAULT 'initiated',
  closed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Helpers RLS (después de tablas — referencian profiles/vehicles)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_vehicle_seller(p_vehicle_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.vehicles
    WHERE id = p_vehicle_id AND seller_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.is_vehicle_published(p_vehicle_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.vehicles
    WHERE id = p_vehicle_id AND status = 'published'
  );
$$;

-- ---------------------------------------------------------------------------
-- Índices
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_vehicles_status ON public.vehicles (status);
CREATE INDEX IF NOT EXISTS idx_vehicles_seller_id ON public.vehicles (seller_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_published_at ON public.vehicles (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_offers_buyer_id ON public.offers (buyer_id);
CREATE INDEX IF NOT EXISTS idx_offers_vehicle_id ON public.offers (vehicle_id);
CREATE INDEX IF NOT EXISTS idx_inspection_items_inspection_id ON public.inspection_items (inspection_id);
CREATE INDEX IF NOT EXISTS idx_test_drives_buyer_id ON public.test_drive_appointments (buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions (status);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_vehicles_updated_at ON public.vehicles;
CREATE TRIGGER trg_vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_offers_updated_at ON public.offers;
CREATE TRIGGER trg_offers_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Perfil automático al registrarse (rol desde user_metadata)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role public.user_role;
BEGIN
  v_role := COALESCE(
    (NEW.raw_user_meta_data->>'role')::public.user_role,
    'buyer'
  );
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_drive_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- profiles
DROP POLICY IF EXISTS profiles_select ON public.profiles;
CREATE POLICY profiles_select ON public.profiles FOR SELECT
  USING (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS profiles_update ON public.profiles;
CREATE POLICY profiles_update ON public.profiles FOR UPDATE
  USING (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS profiles_admin_all ON public.profiles;
CREATE POLICY profiles_admin_all ON public.profiles FOR ALL
  USING (public.is_admin());

-- vehicles
DROP POLICY IF EXISTS vehicles_select ON public.vehicles;
CREATE POLICY vehicles_select ON public.vehicles FOR SELECT
  USING (
    status = 'published'
    OR seller_id = auth.uid()
    OR public.is_admin()
  );

DROP POLICY IF EXISTS vehicles_insert ON public.vehicles;
CREATE POLICY vehicles_insert ON public.vehicles FOR INSERT
  WITH CHECK (seller_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS vehicles_update ON public.vehicles;
CREATE POLICY vehicles_update ON public.vehicles FOR UPDATE
  USING (seller_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS vehicles_delete ON public.vehicles;
CREATE POLICY vehicles_delete ON public.vehicles FOR DELETE
  USING (seller_id = auth.uid() OR public.is_admin());

-- vehicle_documents (privado — vendedor y admin)
DROP POLICY IF EXISTS vehicle_documents_select ON public.vehicle_documents;
CREATE POLICY vehicle_documents_select ON public.vehicle_documents FOR SELECT
  USING (public.is_vehicle_seller(vehicle_id) OR public.is_admin());

DROP POLICY IF EXISTS vehicle_documents_insert ON public.vehicle_documents;
CREATE POLICY vehicle_documents_insert ON public.vehicle_documents FOR INSERT
  WITH CHECK (public.is_vehicle_seller(vehicle_id) OR public.is_admin());

DROP POLICY IF EXISTS vehicle_documents_update ON public.vehicle_documents;
CREATE POLICY vehicle_documents_update ON public.vehicle_documents FOR UPDATE
  USING (public.is_vehicle_seller(vehicle_id) OR public.is_admin());

DROP POLICY IF EXISTS vehicle_documents_delete ON public.vehicle_documents;
CREATE POLICY vehicle_documents_delete ON public.vehicle_documents FOR DELETE
  USING (public.is_vehicle_seller(vehicle_id) OR public.is_admin());

-- inspections (lectura en vehículos publicados o propios)
DROP POLICY IF EXISTS inspections_select ON public.inspections;
CREATE POLICY inspections_select ON public.inspections FOR SELECT
  USING (
    public.is_vehicle_published(vehicle_id)
    OR public.is_vehicle_seller(vehicle_id)
    OR public.is_admin()
  );

DROP POLICY IF EXISTS inspections_insert ON public.inspections;
CREATE POLICY inspections_insert ON public.inspections FOR INSERT
  WITH CHECK (public.is_vehicle_seller(vehicle_id) OR public.is_admin());

DROP POLICY IF EXISTS inspections_update ON public.inspections;
CREATE POLICY inspections_update ON public.inspections FOR UPDATE
  USING (public.is_vehicle_seller(vehicle_id) OR public.is_admin());

DROP POLICY IF EXISTS inspections_delete ON public.inspections;
CREATE POLICY inspections_delete ON public.inspections FOR DELETE
  USING (public.is_admin());

-- inspection_items (misma visibilidad vía join)
DROP POLICY IF EXISTS inspection_items_select ON public.inspection_items;
CREATE POLICY inspection_items_select ON public.inspection_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.inspections i
      WHERE i.id = inspection_id
        AND (
          public.is_vehicle_published(i.vehicle_id)
          OR public.is_vehicle_seller(i.vehicle_id)
          OR public.is_admin()
        )
    )
  );

DROP POLICY IF EXISTS inspection_items_insert ON public.inspection_items;
CREATE POLICY inspection_items_insert ON public.inspection_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.inspections i
      WHERE i.id = inspection_id
        AND (public.is_vehicle_seller(i.vehicle_id) OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS inspection_items_admin ON public.inspection_items;
CREATE POLICY inspection_items_admin ON public.inspection_items FOR ALL
  USING (public.is_admin());

-- offers
DROP POLICY IF EXISTS offers_select ON public.offers;
CREATE POLICY offers_select ON public.offers FOR SELECT
  USING (
    buyer_id = auth.uid()
    OR public.is_vehicle_seller(vehicle_id)
    OR public.is_admin()
  );

DROP POLICY IF EXISTS offers_insert ON public.offers;
CREATE POLICY offers_insert ON public.offers FOR INSERT
  WITH CHECK (buyer_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS offers_update ON public.offers;
CREATE POLICY offers_update ON public.offers FOR UPDATE
  USING (
    buyer_id = auth.uid()
    OR public.is_vehicle_seller(vehicle_id)
    OR public.is_admin()
  );

DROP POLICY IF EXISTS offers_delete ON public.offers;
CREATE POLICY offers_delete ON public.offers FOR DELETE
  USING (buyer_id = auth.uid() OR public.is_admin());

-- test_drive_appointments
DROP POLICY IF EXISTS test_drives_select ON public.test_drive_appointments;
CREATE POLICY test_drives_select ON public.test_drive_appointments FOR SELECT
  USING (
    buyer_id = auth.uid()
    OR public.is_vehicle_seller(vehicle_id)
    OR public.is_admin()
  );

DROP POLICY IF EXISTS test_drives_insert ON public.test_drive_appointments;
CREATE POLICY test_drives_insert ON public.test_drive_appointments FOR INSERT
  WITH CHECK (buyer_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS test_drives_update ON public.test_drive_appointments;
CREATE POLICY test_drives_update ON public.test_drive_appointments FOR UPDATE
  USING (
    buyer_id = auth.uid()
    OR public.is_vehicle_seller(vehicle_id)
    OR public.is_admin()
  );

DROP POLICY IF EXISTS test_drives_delete ON public.test_drive_appointments;
CREATE POLICY test_drives_delete ON public.test_drive_appointments FOR DELETE
  USING (buyer_id = auth.uid() OR public.is_admin());

-- transactions
DROP POLICY IF EXISTS transactions_select ON public.transactions;
CREATE POLICY transactions_select ON public.transactions FOR SELECT
  USING (
    seller_id = auth.uid()
    OR buyer_id = auth.uid()
    OR public.is_admin()
  );

DROP POLICY IF EXISTS transactions_admin ON public.transactions;
CREATE POLICY transactions_admin ON public.transactions FOR ALL
  USING (public.is_admin());

DROP POLICY IF EXISTS transactions_insert ON public.transactions;
CREATE POLICY transactions_insert ON public.transactions FOR INSERT
  WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage buckets (demo)
-- ---------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('vehicle-photos', 'vehicle-photos', true),
  ('transaction-documents', 'transaction-documents', false),
  ('inspection-reports', 'inspection-reports', false)
ON CONFLICT (id) DO NOTHING;
