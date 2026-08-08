import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  async function fetchOrder() {
    setLoading(true);

    const { data: orderData } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (orderData) {
      setOrder(orderData);
      setStatus(orderData.status);
    }

    const { data: itemData } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", id);

    setItems(itemData || []);
    setLoading(false);
  }

  async function updateStatus() {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (!error) {
      alert("Order status updated successfully.");
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!order) {
    return <div className="p-6">Order not found.</div>;
  }

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-3xl font-bold">
        Order Details
      </h1>

      {/* Customer Details */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">
          Customer Details
        </h2>

        <div className="space-y-2">
          <p><strong>Order No:</strong> {order.order_number}</p>
          <p><strong>Name:</strong> {order.customer_name}</p>
          <p><strong>Phone:</strong> {order.phone}</p>
          <p><strong>Email:</strong> {order.email}</p>
          <p><strong>Address:</strong> {order.address}</p>
          <p><strong>Payment:</strong> {order.payment_method}</p>
          <p><strong>Total:</strong> AED {order.total_amount}</p>
        </div>
      </div>

      {/* Ordered Products */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <h2 className="text-xl font-bold p-6">
          Ordered Products
        </h2>

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Product</th>
              <th className="text-left p-4">Qty</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Subtotal</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-4">{item.product_name}</td>
                <td className="p-4">{item.quantity}</td>
                <td className="p-4">AED {item.price}</td>
                <td className="p-4">AED {item.subtotal}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* Status */}
     <div className="bg-white rounded-xl shadow p-6">

  <h2 className="text-xl font-bold mb-4">
    Order Status
  </h2>

  <span
    className={`inline-block px-4 py-2 rounded-full font-medium ${
      order.status === "Delivered"
        ? "bg-green-100 text-green-700"
        : order.status === "Cancelled"
        ? "bg-red-100 text-red-700"
        : order.status === "Shipped"
        ? "bg-blue-100 text-blue-700"
        : "bg-yellow-100 text-yellow-700"
    }`}
  >
    {order.status}
  </span>

</div>

    </div>
  );
}