import { supabase } from "@/lib/supabase";

export async function getCart(userId: string) {
  return await supabase
    .from("cart")
    .select(`
      *,
      product:products(*)
    `)
    .eq("user_id", userId);
}

export async function addCartItem(data: {
  user_id: string;
  product_id: string;
  quantity: number;
  size: string;
  color: string;
}) {
  const result = await supabase
    .from("cart")
    .upsert(data, {
      onConflict: "user_id,product_id,size,color",
    })
    .select();

  console.log("CART INSERT RESULT:", result);

  return result;
} 

export async function updateCartItem(id: string, quantity: number) {
  return await supabase
    .from("cart")
    .update({ quantity })
    .eq("id", id);
}

export async function deleteCartItem(id: string) {
  return await supabase
    .from("cart")
    .delete()
    .eq("id", id);
}

export async function clearCart(userId: string) {
  return await supabase
    .from("cart")
    .delete()
    .eq("user_id", userId);
}