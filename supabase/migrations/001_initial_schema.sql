-- ============================================================
-- BestDeal3z v2 — Initial Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── products ─────────────────────────────────────────────────
CREATE TABLE products (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              text        UNIQUE NOT NULL,
  title             text        NOT NULL,
  description       text        NOT NULL DEFAULT '',
  short_description text        NOT NULL DEFAULT '',
  category          text        NOT NULL,
  price             numeric(10,2) NOT NULL,
  sale_price        numeric(10,2),
  images            text[]      NOT NULL DEFAULT '{}',
  stock             int         NOT NULL DEFAULT 0,
  featured          boolean     NOT NULL DEFAULT false,
  best_seller       boolean     NOT NULL DEFAULT false,
  trending          boolean     NOT NULL DEFAULT false,
  variants          jsonb       NOT NULL DEFAULT '[]',
  tags              text[]      NOT NULL DEFAULT '{}',
  rating            numeric(3,2) NOT NULL DEFAULT 0,
  review_count      int         NOT NULL DEFAULT 0,
  meta_title        text,
  meta_desc         text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- ── categories ───────────────────────────────────────────────
CREATE TABLE categories (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text        UNIQUE NOT NULL,
  title       text        NOT NULL,
  description text        NOT NULL DEFAULT '',
  image       text        NOT NULL DEFAULT '',
  "order"     int         NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ── banners ──────────────────────────────────────────────────
CREATE TABLE banners (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       text        UNIQUE NOT NULL,
  title      text        NOT NULL,
  subtitle   text        NOT NULL DEFAULT '',
  image      text        NOT NULL,
  cta_label  text        NOT NULL DEFAULT '',
  cta_href   text        NOT NULL DEFAULT '',
  active     boolean     NOT NULL DEFAULT true,
  "order"    int         NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── orders ───────────────────────────────────────────────────
CREATE TABLE orders (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_ref           text        UNIQUE NOT NULL,
  user_id             uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name       text        NOT NULL,
  customer_phone      text        NOT NULL,
  customer_whatsapp   text        NOT NULL,
  address             text        NOT NULL,
  city                text        NOT NULL,
  state               text        NOT NULL,
  pincode             text        NOT NULL,
  notes               text        NOT NULL DEFAULT '',
  items               jsonb       NOT NULL,
  subtotal            numeric(10,2) NOT NULL,
  shipping            numeric(10,2) NOT NULL DEFAULT 0,
  total               numeric(10,2) NOT NULL,
  status              text        NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled')),
  whatsapp_sent       boolean     NOT NULL DEFAULT false,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- ── admin_users ──────────────────────────────────────────────
CREATE TABLE admin_users (
  user_id    uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── updated_at trigger ───────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── RLS — enable on all tables ───────────────────────────────
ALTER TABLE products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners     ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- ── Helper: is_admin() ───────────────────────────────────────
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ── Policies: products ───────────────────────────────────────
CREATE POLICY "Public read products"
  ON products FOR SELECT USING (true);

CREATE POLICY "Admins write products"
  ON products FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

-- ── Policies: categories ─────────────────────────────────────
CREATE POLICY "Public read categories"
  ON categories FOR SELECT USING (true);

CREATE POLICY "Admins write categories"
  ON categories FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

-- ── Policies: banners ────────────────────────────────────────
CREATE POLICY "Public read active banners"
  ON banners FOR SELECT USING (active = true);

CREATE POLICY "Admins read all banners"
  ON banners FOR SELECT USING (is_admin());

CREATE POLICY "Admins write banners"
  ON banners FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

-- ── Policies: orders ─────────────────────────────────────────
CREATE POLICY "Anyone can create order"
  ON orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Users read own orders"
  ON orders FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Admins read all orders"
  ON orders FOR SELECT USING (is_admin());

CREATE POLICY "Admins update orders"
  ON orders FOR UPDATE USING (is_admin());

-- admin_users has no client policies — only service role can manage it
