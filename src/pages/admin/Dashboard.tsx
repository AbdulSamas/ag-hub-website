import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [stats, setStats] = useState([
    { title: "Total Products", value: "0" },
    { title: "Orders", value: "0" },
    { title: "Users", value: "0" },
    { title: "Revenue", value: "AED 0" },
  ]);

  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    // Total Products
    const { count: productCount } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    // Total Orders
    const { count: orderCount } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    // Revenue
    const { data: orders } = await supabase
      .from("orders")
      .select("total_amount");

    const revenue =
      orders?.reduce(
        (sum, order) => sum + Number(order.total_amount),
        0
      ) || 0;

    // Recent Orders
    const { data: recent } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    setRecentOrders(recent || []);

    setStats([
      {
        title: "Total Products",
        value: String(productCount || 0),
      },
      {
        title: "Orders",
        value: String(orderCount || 0),
      },
      {
        title: "Users",
        value: "0",
      },
      {
        title: "Revenue",
        value: `AED ${revenue}`,
      },
    ]);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        AG HUB Admin Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <p className="text-gray-500">{item.title}</p>

            <h2 className="text-3xl font-bold mt-2">
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-md mt-10 p-6">
        <h2 className="text-xl font-bold mb-4">
          Recent Orders
        </h2>

        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="py-3">Order ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {recentOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-6 text-center text-gray-500"
                >
                  No Orders Found
                </td>
              </tr>
            ) : (
              recentOrders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="py-3">
                    {order.order_number}
                  </td>

                  <td>{order.customer_name}</td>

                  <td>{order.status}</td>

                  <td>AED {order.total_amount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}