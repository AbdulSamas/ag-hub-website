import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

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

  const handleForgotPassword = async () => {
  if (!email.trim()) {
    alert("Please enter your email address first.");
    return;
  }

  try {
    setResetLoading(true);

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    alert(
      "Password reset link sent! Please check your email."
    );

    // Open Gmail after the message
    window.open(
      "https://mail.google.com/mail/u/0/#inbox",
      "_blank"
    );

  } catch (error) {
    console.error(error);
    alert("Unable to send password reset email.");
  } finally {
    setResetLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-5">

      <div className="
        w-full
        max-w-md
        bg-white/[0.06]
        backdrop-blur-2xl
        border border-white/10
        rounded-3xl
        shadow-[0_20px_70px_rgba(0,0,0,0.45)]
        p-10
      ">

        <h1 className="clash text-4xl font-bold mb-2 text-white">
          Welcome Back 👋
        </h1>

        <p className="text-white/50 mb-8">
          Login to your AG HUB account
        </p>


        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-white/80">
              Email
            </label>

            <div className="
              flex items-center
              bg-white/5
              border border-white/10
              rounded-xl
              mt-2
              px-4 py-3
              focus-within:border-white/30
              transition
            ">

              <Mail
                size={18}
                className="text-white/40"
              />

              <input
                type="email"
                required
                placeholder="Enter your email"
                className="
                  ml-3
                  w-full
                  outline-none
                  bg-transparent
                  text-white
                  placeholder:text-white/30
                "
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

            </div>
          </div>


          {/* Password */}
          <div>
            <div className="flex items-center justify-between">

              <label className="text-sm font-medium text-white/80">
                Password
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={resetLoading}
                className="
                  text-xs
                  text-[#C9A45C]
                  hover:text-[#D8B875]
                  transition
                  disabled:opacity-50
                "
              >
                {resetLoading
                  ? "Sending..."
                  : "Forgot Password?"}
              </button>

            </div>


            <div className="
              flex items-center
              bg-white/5
              border border-white/10
              rounded-xl
              mt-2
              px-4 py-3
              focus-within:border-white/30
              transition
            ">

              <Lock
                size={18}
                className="text-white/40"
              />

              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter your password"
                className="
                  ml-3
                  w-full
                  outline-none
                  bg-transparent
                  text-white
                  placeholder:text-white/30
                "
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="text-white/40 hover:text-white transition"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>
          </div>


          {/* Login */}
          <button
            type="submit"
            className="
              w-full
              bg-white
              text-black
              rounded-xl
              py-3
              flex items-center
              justify-center
              gap-2
              font-medium
              hover:bg-white/90
              transition-all duration-300
            "
          >
            Login
            <ArrowRight size={18} />
          </button>

        </form>


        {/* Signup */}
        <div className="text-center mt-8">

          <p className="text-white/50">

            Don't have an account?{" "}

            <Link
              to="/signup"
              className="
                font-semibold
                text-white
                hover:underline
              "
            >
              Sign Up
            </Link>

          </p>

        </div>

      </div>
    </div>
  );
}