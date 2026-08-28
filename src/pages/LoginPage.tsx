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
    <div className="min-h-screen flex items-center justify-center bg-transparent px-5">
      <div className="w-full max-w-md bg-white/[0.06] backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.45)] p-10">
        <h1 className="clash text-4xl font-bold mb-2 text-white">
          Welcome Back 👋
        </h1>

        <p className="text-white/50 mb-8">
          Login to your AG HUB account
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-white/80">
              Email
            </label>

            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl mt-2 px-4 py-3 focus-within:border-white/30 transition">
              <Mail
                size={18}
                className="text-white/40"
              />

              <input
                type="email"
                required
                placeholder="Enter your email"
                className="ml-3 w-full outline-none bg-transparent text-white placeholder:text-white/30"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-white/80">
              Password
            </label>

            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl mt-2 px-4 py-3 focus-within:border-white/30 transition">
              <Lock
  size={18}
  className="text-white/40"
/>

              <input
                type="password"
                required
                placeholder="Enter your password"
                className="ml-3 w-full outline-none bg-transparent text-white placeholder:text-white/30"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black rounded-xl py-3 flex items-center justify-center gap-2 font-medium hover:bg-white/90 transition-all duration-300"
          >
            Login
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-white/50">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-white hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}