import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setOrders(data || []);
    }
  }

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-8">
        Orders
      </h1>

      <table className="w-full bg-white rounded-xl overflow-hidden">

        <thead className="bg-gray-100">

          <tr>

            <th className="p-4 text-left">
              Order
            </th>

            <th className="p-4 text-left">
              Customer
            </th>

            <th className="p-4 text-left">
              Total
            </th>

            <th className="p-4 text-left">
              Status
            </th>

          </tr>

        </thead>

        <tbody>

          {orders.map((order) => (

            <tr key={order.id} className="border-t">

              <td className="p-4">
                {order.order_number}
              </td>

              <td className="p-4">
                {order.customer_name}
              </td>

              <td className="p-4">
                {order.total_amount} AED
              </td>

             <td className="p-4">
  <select
    value={order.status}
    onChange={async (e) => {
  const newStatus = e.target.value;

 const { data, error } = await supabase
  .from("orders")
  .update({ status: newStatus })
  .eq("id", order.id)
  .select();

console.log("Updated:", data);
console.log("Error:", error);

if (error) {
  alert(JSON.stringify(error, null, 2));
  return;
}

fetchOrders();
}}
    className="border rounded-lg px-3 py-2"
  >
    <option value="Pending">Pending</option>
<option value="Confirmed">Confirmed</option>
<option value="Packed">Packed</option>
<option value="Shipped">Shipped</option>
<option value="Delivered">Delivered</option>
<option value="Cancelled">Cancelled</option>
  </select>
</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}