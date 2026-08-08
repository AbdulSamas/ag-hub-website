import { supabase } from "./supabase";

export async function getWishlist(userId: string) {
  const { data, error } = await supabase
    .from("wishlist")
    .select(`
      product_id,
      products(*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}
export async function addWishlist(
  userId: string,
  productId: string
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not logged in");
  }

  // Already exists?
  const { data: existing } = await supabase
    .from("wishlist")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    return;
  }

  const { error } = await supabase
    .from("wishlist")
    .insert({
      user_id: userId,
      user_email: user.email ?? "",
      product_id: productId,
    });

  if (error) throw error;
}
export async function removeWishlist(
  userId: string,
  productId: string
) {
  const { error } = await supabase
    .from("wishlist")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) throw error;
}