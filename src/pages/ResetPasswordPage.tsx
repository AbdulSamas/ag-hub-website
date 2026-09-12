import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setReady(true);
      }
    };

    checkSession();
  }, []);

  const handleReset = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const { error } =
        await supabase.auth.updateUser({
          password,
        });

      if (error) {
        console.error(error);
        alert(error.message);
        return;
      }

      alert("Password updated successfully! 🎉");

      await supabase.auth.signOut();

      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p className="text-white/50">
          Checking reset link...
        </p>
      </div>
    );
  }

  return (
    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-transparent
      px-5
    ">

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

        <h1 className="
          clash
          text-3xl
          font-bold
          text-white
          mb-2
        ">
          Reset Password
        </h1>

        <p className="text-white/50 mb-8">
          Create a new password for your AG HUB account.
        </p>


        <form
          onSubmit={handleReset}
          className="space-y-5"
        >

          {/* New Password */}
          <div>

            <label className="text-sm text-white/80">
              New Password
            </label>

            <div className="
              flex items-center
              bg-white/5
              border border-white/10
              rounded-xl
              mt-2
              px-4 py-3
            ">

              <Lock
                size={18}
                className="text-white/40"
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                required
                minLength={6}
                placeholder="Enter new password"
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
                className="text-white/40 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

          </div>


          {/* Confirm Password */}
          <div>

            <label className="text-sm text-white/80">
              Confirm Password
            </label>

            <div className="
              flex items-center
              bg-white/5
              border border-white/10
              rounded-xl
              mt-2
              px-4 py-3
            ">

              <Lock
                size={18}
                className="text-white/40"
              />

              <input
                type={
                  showConfirm
                    ? "text"
                    : "password"
                }
                required
                minLength={6}
                placeholder="Confirm new password"
                className="
                  ml-3
                  w-full
                  outline-none
                  bg-transparent
                  text-white
                  placeholder:text-white/30
                "
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirm(!showConfirm)
                }
                className="text-white/40 hover:text-white"
              >
                {showConfirm ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

          </div>


          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-[#C9A45C]
              text-black
              rounded-xl
              py-3
              flex items-center
              justify-center
              gap-2
              font-semibold
              hover:bg-[#D8B875]
              transition
              disabled:opacity-50
            "
          >

            <Check size={18} />

            {loading
              ? "Updating..."
              : "Update Password"}

          </button>

        </form>


        <button
          onClick={() => navigate("/login")}
          className="
            w-full
            mt-5
            text-sm
            text-white/40
            hover:text-white
            transition
          "
        >
          Back to Login
        </button>

      </div>
    </div>
  );
}