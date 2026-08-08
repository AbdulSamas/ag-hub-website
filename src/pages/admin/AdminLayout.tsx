import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-6">
        <h1 className="text-2xl font-bold mb-8">AG HUB</h1>

        <nav className="space-y-4">
          <Link
            to="/admin/dashboard"
            className="block hover:text-yellow-400"
          >
            Dashboard
          </Link>

          <Link
            to="/admin/products"
            className="block hover:text-yellow-400"
          >
            Products
          </Link>

          <Link
            to="/admin/orders"
            className="block hover:text-yellow-400"
          >
            Orders
          </Link>

          <Link
            to="/admin/users"
            className="block hover:text-yellow-400"
          >
            Users
          </Link>

          <Link
            to="/admin/offers"
            className="block hover:text-yellow-400"
          >
            Offers
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-white shadow p-5 flex justify-between">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <span>Welcome Admin 👋</span>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}