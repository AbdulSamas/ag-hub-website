/*
# Create products table for AG HUB luxury ecommerce

1. New Tables
- `products`
  - `id` (uuid, primary key)
  - `name` (text, not null) — product name
  - `slug` (text, unique, not null) — URL-friendly identifier
  - `description` (text) — product description
  - `price` (numeric, not null) — current price in AED
  - `original_price` (numeric) — original price for sale items
  - `category` (text, not null) — Men, Women, Cosmetics, Shoes, Accessories, Kids
  - `subcategory` (text) — finer grouping
  - `image_url` (text) — primary product image
  - `images` (jsonb) — array of additional image URLs
  - `rating` (numeric) — average rating 0-5
  - `reviews_count` (integer) — number of reviews
  - `sizes` (jsonb) — available sizes array
  - `colors` (jsonb) — available colors array
  - `is_featured` (boolean) — show in featured section
  - `is_new` (boolean) — show in new arrivals
  - `is_best_seller` (boolean) — show in best sellers
  - `is_on_sale` (boolean) — show in flash sale
  - `discount_percent` (integer) — discount percentage for sale items
  - `stock` (integer) — available inventory
  - `created_at` (timestamptz)

2. Indexes
  - `idx_products_category` on `category`
  - `idx_products_slug` on `slug` (unique)
  - `idx_products_featured` on `is_featured`
  - `idx_products_is_new` on `is_new`

3. Security
  - Enable RLS on `products`.
  - Allow anon + authenticated to read products (public catalog).
  - No writes from the frontend (admin-managed catalog).
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  price numeric(10, 2) NOT NULL,
  original_price numeric(10, 2),
  category text NOT NULL,
  subcategory text,
  image_url text,
  images jsonb DEFAULT '[]'::jsonb,
  rating numeric(2, 1) DEFAULT 0,
  reviews_count integer DEFAULT 0,
  sizes jsonb DEFAULT '[]'::jsonb,
  colors jsonb DEFAULT '[]'::jsonb,
  is_featured boolean DEFAULT false,
  is_new boolean DEFAULT false,
  is_best_seller boolean DEFAULT false,
  is_on_sale boolean DEFAULT false,
  discount_percent integer DEFAULT 0,
  stock integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_is_new ON products(is_new) WHERE is_new = true;

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_products" ON products;
CREATE POLICY "anon_read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);
