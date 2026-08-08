import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // പിന്നീട് ഇവിടെ authentication ചേർക്കാം
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          AG HUB Admin
        </h1>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-lg p-3 mb-4"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-lg p-3 mb-6"
          />

          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}