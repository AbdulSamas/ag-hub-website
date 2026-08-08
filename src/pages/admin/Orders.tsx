import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Link } from "react-router-dom";
export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchOrders();
}, []);

async function fetchOrders() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (!error) {
    setOrders(data || []);
  }
  setLoading(false);
}
if (loading) {
  return (
    <div className="flex justify-center items-center h-96">
      Loading...
    </div>
  );
}
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Orders
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Order ID</th>
             
              <th className="text-left p-4">Phone</th>
              <th className="text-left p-4">Total</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Action</th>
            </tr>
          </thead>

         <tbody>
  {orders.length === 0 ? (
    <tr>
      <td colSpan={7} className="p-8 text-center text-gray-500">
        No orders found
      </td>
    </tr>
  ) : (
    orders.map((order) => (
      <tr key={order.id} className="border-t">
        <td className="p-4">{order.order_number}</td>
    
        <td className="p-4">{order.phone}</td>
        <td className="p-4">AED {order.total_amount}</td>
        <td className="p-4">{order.status}</td>
        <td className="p-4">
          {new Date(order.created_at).toLocaleDateString()}
        </td>
        <td className="p-4">
          <Link
  to={`/orders/${order.id}`}
  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
>
  View Details
</Link>
        </td>
      </tr>
    ))
  )}
</tbody>
        </table>
      </div>
    </div>
  );
}