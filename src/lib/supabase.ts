import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  name: string;
  slug: string;
  
  description: string | null;
  price: number;
  original_price: number | null;
  category: string;
  subcategory: string | null;
  image_url: string | null;
  images: string[];
  rating: number;
  reviews_count: number;
  sizes: string[];
  colors: string[];
  is_featured: boolean;
  is_new: boolean;
  is_best_seller: boolean;
  is_on_sale: boolean;
  discount_percent: number;
  stock: number;
  created_at: string;
};

export type Review = {
  id: string;
  product_id: string;
  name: string;
  role: string | null;
  avatar_url: string | null;
  rating: number;
  text: string;
  product_name: string | null;
  created_at: string;
};

export type CartItem = {
  product: Product;
  size: string;
  color: string;
  quantity: number;
};
