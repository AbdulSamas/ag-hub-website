import { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin } from "lucide-react";

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

    alert("Profile Updated Successfully!");

    setEditing(false);

    await loadProfile();
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
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f6] pt-28 pb-20 px-5">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8">

          <div className="flex justify-end mb-6 gap-3">
            <button
              onClick={() => setEditing(!editing)}
              className="bg-black text-white px-5 py-2 rounded-xl"
            >
              {editing ? "Cancel" : "Edit Profile"}
            </button>

            {editing && (
              <button
                onClick={saveProfile}
                disabled={saving}
                className="bg-green-600 text-white px-5 py-2 rounded-xl"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            )}
          </div>

          <div className="flex flex-col items-center mb-10">

            {profile.profile_image ? (
              <img
                src={profile.profile_image}
                alt=""
                className="w-28 h-28 rounded-full object-cover"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-5xl font-bold">
                {profile.full_name
                  ? profile.full_name.charAt(0).toUpperCase()
                  : "U"}
              </div>
            )}

            {editing && (
              <label className="mt-4 cursor-pointer bg-black text-white px-4 py-2 rounded-lg">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={changePhoto}
                  className="hidden"
                />
              </label>
            )}

            <h1 className="text-3xl font-bold mt-5">
              {profile.full_name || "User"}
            </h1>

            <p className="text-gray-500">
              {profile.email}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="text-sm font-medium">
                Full Name
              </label>

              <div className="flex items-center border rounded-xl mt-2 px-4 py-3">
                <User size={18} className="text-gray-400" />

                <input
                  className="ml-3 flex-1 outline-none"
                  value={profile.full_name}
                  readOnly={!editing}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      full_name: e.target.value,
                    })
                  }
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
                  className="ml-3 flex-1 outline-none bg-gray-100"
                  value={profile.email}
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">
                Phone
              </label>

              <div className="flex items-center border rounded-xl mt-2 px-4 py-3">
                <Phone size={18} className="text-gray-400" />

                <input
                  className="ml-3 flex-1 outline-none"
                  value={profile.phone}
                  readOnly={!editing}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      phone: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">
                Address
              </label>

              <div className="flex items-center border rounded-xl mt-2 px-4 py-3">
                <MapPin size={18} className="text-gray-400" />

                <input
                  className="ml-3 flex-1 outline-none"
                  value={profile.address}
                  readOnly={!editing}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      address: e.target.value,
                    })
                  }
                />
              </div>
            </div>

          </div>

          <div className="mt-8 bg-gray-100 rounded-2xl p-5">

            <h3 className="font-semibold text-lg mb-2">
              Statistics
            </h3>

            <p>
              Total Orders :
              <span className="font-bold ml-2">
                {profile.total_orders}
              </span>
            </p>

          </div>

        </div>
      </div>
    </div>
  );
}