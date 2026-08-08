import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setUsers(data || []);
    }

    setLoading(false);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Users
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Phone</th>
              <th className="text-left p-4">Orders</th>
              <th className="text-left p-4">Spent</th>
              <th className="text-left p-4">Joined</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-gray-500"
                >
                  No Users Found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="p-4">{user.full_name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.phone}</td>
                  <td className="p-4">{user.total_orders}</td>
                  <td className="p-4">
                    AED {user.total_spent}
                  </td>
                  <td className="p-4">
                    {new Date(
                      user.created_at
                    ).toLocaleDateString()}
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