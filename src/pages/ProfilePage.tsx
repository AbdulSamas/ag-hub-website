import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Pencil,
  Check,
  X,
  ShoppingBag,
  ShieldCheck,
} from "lucide-react";

import {
  getCurrentUser,
  getProfile,
  updateProfile,
  uploadProfileImage,
} from "@/lib/profile";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState("");

  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    profile_image: "",
    total_orders: 0,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const user = await getCurrentUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setUserId(user.id);

      const data = await getProfile(user.id);

      if (data) {
        setProfile({
          full_name: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          country: data.country || "",
          profile_image: data.profile_image || "",
          total_orders: data.total_orders || 0,
        });
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  async function saveProfile() {
    try {
      setSaving(true);

      const { error } = await updateProfile(userId, {
        full_name: profile.full_name,
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        country: profile.country,
      });

      if (error) {
        console.error(error);
        alert(error.message);
        return;
      }

      setEditing(false);
      await loadProfile();

      alert("Profile Updated Successfully!");
    } catch (err) {
      console.error(err);
      alert("Unable to update profile.");
    } finally {
      setSaving(false);
    }
  }

  async function changePhoto(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const url = await uploadProfileImage(userId, file);

      setProfile((prev) => ({
        ...prev,
        profile_image: url,
      }));

      alert("Profile Photo Updated.");
    } catch (err) {
      console.error(err);
      alert("Upload Failed.");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border border-[#C9A45C]/30 border-t-[#C9A45C] rounded-full animate-spin mx-auto mb-4" />

          <p className="text-white/40 text-xs tracking-[0.25em] uppercase">
            Loading Account
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white pt-28 pb-20 px-4 sm:px-6">

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">

          <p className="text-[#C9A45C] text-[10px] sm:text-xs tracking-[0.35em] uppercase font-medium mb-3">
            AG HUB / Account
          </p>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">

            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-[-0.03em]">
                My Account
              </h1>

              <p className="mt-2 text-sm text-white/40">
                Manage your personal information and account details.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2">

              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="
                    group
                    h-11
                    px-5
                    rounded-full
                    border border-white/10
                    bg-white/[0.03]
                    hover:bg-[#C9A45C]
                    hover:text-black
                    hover:border-[#C9A45C]
                    transition-all duration-300
                    flex items-center gap-2
                    text-sm font-medium
                  "
                >
                  <Pencil
                    size={15}
                    className="group-hover:scale-110 transition-transform"
                  />

                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditing(false);
                      loadProfile();
                    }}
                    className="
                      h-11
                      px-5
                      rounded-full
                      border border-white/10
                      text-white/60
                      hover:text-white
                      hover:bg-white/[0.05]
                      transition
                      flex items-center gap-2
                      text-sm
                    "
                  >
                    <X size={15} />
                    Cancel
                  </button>

                  <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="
                      h-11
                      px-5
                      rounded-full
                      bg-[#C9A45C]
                      text-black
                      hover:bg-[#D8B875]
                      transition
                      flex items-center gap-2
                      text-sm font-semibold
                      disabled:opacity-50
                    "
                  >
                    <Check size={15} />

                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              )}

            </div>
          </div>
        </div>


        {/* Profile Section */}
        <div className="
          border-y border-white/[0.08]
        ">

          {/* Profile Header */}
          <div className="
            px-2 sm:px-6
            py-8 sm:py-10
            border-b border-white/[0.07]
          ">

            <div className="
              flex
              flex-col
              sm:flex-row
              items-center
              sm:items-center
              gap-6
            ">

              {/* Avatar */}
              <div className="relative shrink-0">

                <div className="
                  w-28 h-28
                  sm:w-32 sm:h-32
                  rounded-full
                  p-[2px]
                  bg-gradient-to-br
                  from-[#C9A45C]
                  via-[#8c6d35]
                  to-transparent
                ">

                  <div className="
                    w-full h-full
                    rounded-full
                    overflow-hidden
                    bg-black
                    flex items-center justify-center
                  ">

                    {profile.profile_image ? (
                      <img
                        src={profile.profile_image}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-light text-[#C9A45C]">
                        {profile.full_name
                          ? profile.full_name.charAt(0).toUpperCase()
                          : "U"}
                      </span>
                    )}

                  </div>
                </div>

                {/* Camera */}
                {editing && (
                  <label
                    className="
                      absolute
                      bottom-0
                      right-0
                      w-10 h-10
                      rounded-full
                      bg-[#C9A45C]
                      text-black
                      flex items-center justify-center
                      cursor-pointer
                      border-4 border-black
                      hover:bg-[#D8B875]
                      transition
                    "
                  >
                    <Camera size={16} />

                    <input
                      type="file"
                      accept="image/*"
                      onChange={changePhoto}
                      className="hidden"
                    />
                  </label>
                )}

              </div>


              {/* User Info */}
              <div className="text-center sm:text-left flex-1">

                <p className="
                  text-[10px]
                  tracking-[0.3em]
                  uppercase
                  text-[#C9A45C]
                  mb-2
                ">
                  Member
                </p>

                <h2 className="
                  text-2xl
                  sm:text-3xl
                  font-light
                  tracking-tight
                ">
                  {profile.full_name || "AG HUB Member"}
                </h2>

                <p className="text-sm text-white/40 mt-1">
                  {profile.email}
                </p>

              </div>


              {/* Orders */}
              <div className="
                min-w-[130px]
                px-5 py-4
                text-center
                border border-white/[0.07]
                rounded-2xl
                bg-white/[0.02]
              ">

                <div className="flex justify-center mb-2">
                  <ShoppingBag
                    size={18}
                    className="text-[#C9A45C]"
                    strokeWidth={1.5}
                  />
                </div>

                <p className="text-2xl font-light">
                  {profile.total_orders}
                </p>

                <p className="
                  text-[9px]
                  uppercase
                  tracking-[0.2em]
                  text-white/35
                  mt-1
                ">
                  Total Orders
                </p>

              </div>

            </div>
          </div>


          {/* Personal Information */}
          <div className="px-2 sm:px-6 py-8 sm:py-10">

            <div className="flex items-center gap-3 mb-7">

              <div className="w-7 h-px bg-[#C9A45C]/50" />

              <h3 className="
                text-xs
                uppercase
                tracking-[0.25em]
                text-white/60
              ">
                Personal Information
              </h3>

            </div>


            <div className="grid md:grid-cols-2 gap-5">

              <ProfileField
                icon={<User size={17} />}
                label="Full Name"
                value={profile.full_name}
                editing={editing}
                onChange={(value) =>
                  setProfile({
                    ...profile,
                    full_name: value,
                  })
                }
              />


              <ProfileField
                icon={<Mail size={17} />}
                label="Email Address"
                value={profile.email}
                editing={false}
                disabled
              />


              <ProfileField
                icon={<Phone size={17} />}
                label="Phone Number"
                value={profile.phone}
                editing={editing}
                onChange={(value) =>
                  setProfile({
                    ...profile,
                    phone: value,
                  })
                }
              />


              <ProfileField
                icon={<MapPin size={17} />}
                label="Address"
                value={profile.address}
                editing={editing}
                onChange={(value) =>
                  setProfile({
                    ...profile,
                    address: value,
                  })
                }
              />


              <ProfileField
                label="City"
                value={profile.city}
                editing={editing}
                onChange={(value) =>
                  setProfile({
                    ...profile,
                    city: value,
                  })
                }
              />


              <ProfileField
                label="Country"
                value={profile.country}
                editing={editing}
                onChange={(value) =>
                  setProfile({
                    ...profile,
                    country: value,
                  })
                }
              />

            </div>


            {/* Account Status */}
            <div className="
              mt-8
              pt-7
              border-t border-white/[0.07]
              flex items-center justify-between
              gap-4
            ">

              <div className="flex items-center gap-3">

                <div className="
                  w-10 h-10
                  rounded-xl
                  bg-[#C9A45C]/[0.08]
                  flex items-center justify-center
                ">
                  <ShieldCheck
                    size={18}
                    className="text-[#C9A45C]"
                    strokeWidth={1.5}
                  />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Account Secured
                  </p>

                  <p className="text-[11px] text-white/35 mt-0.5">
                    Your account information is protected.
                  </p>
                </div>

              </div>


              <span className="
                hidden sm:inline-flex
                px-3 py-1.5
                rounded-full
                bg-emerald-500/10
                text-emerald-400
                text-[10px]
                uppercase
                tracking-[0.15em]
              ">
                Active
              </span>

            </div>

          </div>

        </div>


        {/* Footer */}
        <div className="text-center mt-8">

          <p className="
            text-[9px]
            tracking-[0.35em]
            uppercase
            text-white/20
          ">
            AG HUB • Premium Fashion
          </p>

        </div>

      </div>
    </div>
  );
}


/* ─────────────────────────────────────────────
   Reusable Profile Field
───────────────────────────────────────────── */

function ProfileField({
  icon,
  label,
  value,
  editing,
  onChange,
  disabled = false,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  editing: boolean;
  onChange?: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div>

      <label className="
        block
        text-[10px]
        uppercase
        tracking-[0.2em]
        text-white/35
        mb-2
      ">
        {label}
      </label>

      <div
        className={`
          min-h-[52px]
          flex items-center
          gap-3
          px-4
          rounded-2xl
          border
          transition-all duration-300

          ${
            disabled
              ? "bg-white/[0.02] border-white/[0.05]"
              : editing
              ? "bg-white/[0.035] border-[#C9A45C]/30 focus-within:border-[#C9A45C]/60"
              : "bg-white/[0.02] border-white/[0.07]"
          }
        `}
      >

        {icon && (
          <span
            className={`
              shrink-0
              ${
                editing && !disabled
                  ? "text-[#C9A45C]"
                  : "text-white/30"
              }
            `}
          >
            {icon}
          </span>
        )}

        <input
          type="text"
          value={value}
          readOnly={!editing || disabled}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={`Enter ${label.toLowerCase()}`}
          className={`
            w-full
            bg-transparent
            outline-none
            text-sm

            ${
              disabled
                ? "text-white/35 cursor-not-allowed"
                : "text-white/85"
            }
          `}
        />

      </div>

    </div>
  );
}