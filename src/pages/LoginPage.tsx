import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await login(email, password);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Login Successful 🎉");

    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f8f6] px-5">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10">
        <h1 className="text-4xl font-bold mb-2">
          Welcome Back 👋
        </h1>

        <p className="text-gray-500 mb-8">
          Login to your AG HUB account
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm font-medium">
              Email
            </label>

            <div className="flex items-center border rounded-xl mt-2 px-4 py-3">
              <Mail
                size={18}
                className="text-gray-400"
              />

              <input
                type="email"
                required
                placeholder="Enter your email"
                className="ml-3 w-full outline-none"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">
              Password
            </label>

            <div className="flex items-center border rounded-xl mt-2 px-4 py-3">
              <Lock
                size={18}
                className="text-gray-400"
              />

              <input
                type="password"
                required
                placeholder="Enter your password"
                className="ml-3 w-full outline-none"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-gray-800 transition"
          >
            Login
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-black hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}