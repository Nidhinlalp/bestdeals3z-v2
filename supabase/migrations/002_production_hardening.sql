-- Cloud Scart production hardening for databases created before 2026-08-12.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'cod',
  ADD COLUMN IF NOT EXISTS policy_version text NOT NULL DEFAULT 'pre-2026-08-12',
  ADD COLUMN IF NOT EXISTS privacy_accepted_at timestamptz;

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS brand text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS manufacturer text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS importer text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS country_of_origin text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS net_quantity text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS warranty_info text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS safety_information text NOT NULL DEFAULT '';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'orders_payment_method_check'
      AND conrelid = 'public.orders'::regclass
  ) THEN
    ALTER TABLE public.orders
      ADD CONSTRAINT orders_payment_method_check
      CHECK (payment_method IN ('cod', 'prepaid'));
  END IF;
END $$;

DROP POLICY IF EXISTS "Anyone can create order" ON public.orders;
DROP POLICY IF EXISTS "Users read own orders" ON public.orders;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read store images" ON storage.objects;
DROP POLICY IF EXISTS "Admins upload store images" ON storage.objects;
DROP POLICY IF EXISTS "Admins update store images" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete store images" ON storage.objects;

CREATE POLICY "Public read store images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

CREATE POLICY "Admins upload store images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'images' AND public.is_admin());

CREATE POLICY "Admins update store images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'images' AND public.is_admin())
  WITH CHECK (bucket_id = 'images' AND public.is_admin());

CREATE POLICY "Admins delete store images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'images' AND public.is_admin());
