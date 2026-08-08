import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { signup } from "@/lib/auth";

export default function SignupPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

const { error } = await signup(
  name,
  email,
  password
);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created successfully 🎉");

    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f8f6] px-5">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10">
        <h1 className="text-4xl font-bold mb-2">
          Create Account 🚀
        </h1>

        <p className="text-gray-500 mb-8">
          Join AG HUB today
        </p>

        <form onSubmit={handleSignup} className="space-y-5">

          <div>
            <label className="text-sm font-medium">
              Full Name
            </label>

            <div className="flex items-center border rounded-xl mt-2 px-4 py-3">
              <User size={18} className="text-gray-400" />

              <input
                type="text"
                required
                placeholder="Enter your full name"
                className="ml-3 w-full outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">
              Email
            </label>

            <div className="flex items-center border rounded-xl mt-2 px-4 py-3">
              <Mail size={18} className="text-gray-400" />

              <input
                type="email"
                required
                placeholder="Enter your email"
                className="ml-3 w-full outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">
              Password
            </label>

            <div className="flex items-center border rounded-xl mt-2 px-4 py-3">
              <Lock size={18} className="text-gray-400" />

              <input
                type="password"
                required
                placeholder="Enter password"
                className="ml-3 w-full outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">
              Confirm Password
            </label>

            <div className="flex items-center border rounded-xl mt-2 px-4 py-3">
              <Lock size={18} className="text-gray-400" />

              <input
                type="password"
                required
                placeholder="Confirm password"
                className="ml-3 w-full outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-gray-800 transition"
          >
            Create Account
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-black hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}