-- Cover image URL for vehicle listings (public path or Supabase Storage URL).
ALTER TABLE public.vehicles
  ADD COLUMN IF NOT EXISTS cover_image_url text;

COMMENT ON COLUMN public.vehicles.cover_image_url IS 'Public URL or /vehicles/* path for listing hero image';
