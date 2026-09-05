"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/learner/SideBar";


type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  bio: string | null;
};

export default function SettingsPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================
  // Get logged-in user
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.replace("/");
          return;
        }

        const data = await response.json();

        setUser(data.user);
        setName(data.user.name || "");
        setBio(data.user.bio || "");
      } catch (error) {
        console.error("Failed to load user:", error);
        setError("Unable to load your profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  // =========================
  // Update profile
  // =========================
  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token || !user) {
      router.replace("/");
      return;
    }

    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            bio: bio.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to update profile.");
        return;
      }

      // Update UI with database response
      setUser(data.user);
      setName(data.user.name || "");
      setBio(data.user.bio || "");

      // Keep localStorage user data updated
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Logout
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.replace("/");
  };

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">
          Loading settings...
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <div
      className="flex h-screen flex-col overflow-hidden bg-slate-50 lg:flex-row"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="shrink-0 border-b border-slate-200 bg-white px-6 py-5 lg:px-8">
          <h1
            className="text-xl font-bold text-[#0f1428]"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            Settings
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your account information.
          </p>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-6 lg:grid-cols-[210px_1fr]">

              {/* Settings navigation */}
              <aside>
                <div className="rounded-2xl border border-slate-200 bg-white p-2">
                  <div className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        👤
                      </span>

                      <span className="text-sm font-semibold text-[#6c3bff]">
                        Profile
                      </span>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Profile */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">

                <h2
                  className="text-base font-bold text-[#0f1428]"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  Profile
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update your personal information.
                </p>

                {/* Profile header */}
                <div className="mt-6 flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">

                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="h-20 w-20 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#6c3bff] to-[#9b6cff] text-2xl font-bold text-white">
                      {initials}
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold text-[#0f1428]">
                      {user.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {user.email}
                    </p>

                    <span className="mt-2 inline-block rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-[#6c3bff]">
                      {user.role}
                    </span>
                  </div>
                </div>

                {/* Form */}
                <div className="mt-6 space-y-5">

                  {/* Name */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Name
                    </label>

                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#6c3bff] focus:ring-2 focus:ring-purple-100"
                      placeholder="Enter your name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Email address
                    </label>

                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
                    />

                    <p className="mt-1.5 text-xs text-slate-400">
                      Email address cannot be changed here.
                    </p>
                  </div>

                  {/* Role */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Role
                    </label>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                      {user.role}
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Bio
                    </label>

                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      maxLength={160}
                      placeholder="Tell us a little about yourself..."
                      className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-[#6c3bff] focus:ring-2 focus:ring-purple-100"
                    />

                    <div className="mt-1 text-right text-xs text-slate-400">
                      {bio.length}/160
                    </div>
                  </div>

                  {/* User ID */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      User ID
                    </label>

                    <div className="break-all rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-xs text-slate-500">
                      {user.id}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                {error && (
                  <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                    {message}
                  </div>
                )}

                {/* Save */}
                <div className="mt-6 flex justify-end border-t border-slate-100 pt-6">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-xl bg-linear-to-r from-[#6c3bff] to-[#8a5fff] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-purple-200 transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>

                {/* Account */}
                <div className="mt-8 border-t border-slate-100 pt-6">
                  <h3 className="text-sm font-semibold text-[#0f1428]">
                    Account
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Sign out of your CourseMaster account.
                  </p>

                  <button
                    onClick={handleLogout}
                    className="mt-4 rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}