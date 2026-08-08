import { supabase } from "./supabase";

export async function getMyOrders(userId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function placeOrder(
  order: any,
  items: any[]
) {
  // Create Order
  const { data: orderData, error: orderError } =
    await supabase
      .from("orders")
      .insert(order)
      .select()
      .single();

  if (orderError) throw orderError;

  // Create Order Items
  const orderItems = items.map((item) => ({
    order_id: orderData.id,
    product_id: item.id,
    product_name: item.name,
    quantity: item.quantity,
    price: item.price,
    subtotal: item.price * item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return orderData;
}