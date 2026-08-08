/*
# Create reviews table for AG HUB product reviews

1. New Tables
- `reviews`
  - `id` (uuid, primary key)
  - `product_id` (uuid, FK to products)
  - `name` (text) — reviewer name
  - `role` (text) — reviewer role/title
  - `avatar_url` (text) — reviewer avatar
  - `rating` (integer) — 1-5 stars
  - `text` (text) — review content
  - `product_name` (text) — denormalized product name for display
  - `created_at` (timestamptz)

2. Indexes
  - `idx_reviews_product_id` on `product_id`

3. Security
  - Enable RLS on `reviews`.
  - Allow anon + authenticated to read reviews (public).
*/

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text,
  avatar_url text,
  rating integer DEFAULT 5,
  text text NOT NULL,
  product_name text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_reviews" ON reviews;
CREATE POLICY "anon_read_reviews" ON reviews FOR SELECT
  TO anon, authenticated USING (true);
