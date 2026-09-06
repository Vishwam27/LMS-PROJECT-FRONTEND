"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type UserRole = "STUDENT" | "INSTRUCTOR" | "ADMIN";

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
};

type UsersResponse = {
  users: User[];
  total: number;
};

export default function AdminUsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] =
    useState<"ALL" | UserRole>("ALL");

  // =========================================================
  // FETCH USERS
  // =========================================================

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token || !storedUser) {
          router.replace("/");
          return;
        }

        let currentUser;

        try {
          currentUser = JSON.parse(storedUser);
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.replace("/");
          return;
        }

        // Frontend role check
        if (currentUser.role !== "ADMIN") {
          setError(
            "You do not have permission to access this page."
          );
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.replace("/");
          return;
        }

        if (response.status === 403) {
          setError(
            "You do not have permission to access this page."
          );
          return;
        }

        const data: UsersResponse & {
          message?: string;
        } = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load users"
          );
        }

        setUsers(data.users);
      } catch (error) {
        console.error("Users loading error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load users"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  // =========================================================
  // FILTER USERS
  // =========================================================

  const filteredUsers = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !searchValue ||
        user.name.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue);

      const matchesRole =
        roleFilter === "ALL" ||
        user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (value: string) => {
    return new Date(value).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  // =========================================================
  // ROLE STYLE
  // =========================================================

  const roleStyle = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-50 text-[#6c3bff]";

      case "INSTRUCTOR":
        return "bg-orange-50 text-orange-600";

      case "STUDENT":
      default:
        return "bg-sky-50 text-sky-600";
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#6c3bff]" />

          <p className="mt-3 text-sm text-slate-500">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ACCESS DENIED / ERROR
  // =========================================================

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl">
            🔒
          </div>

          <h1
            className="mt-5 text-xl font-bold text-[#0f1428]"
            style={{
              fontFamily: "Outfit, sans-serif",
            }}
          >
            Access Denied
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error}
          </p>

          <button
            onClick={() => router.push("/AdminMaster")}
            className="mt-6 rounded-xl bg-[#6c3bff] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5d32e8]"
          >
            Back to Admin
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div
      className="min-h-screen bg-slate-50"
      style={{
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <div>
            <button
              onClick={() => router.push("/AdminMaster")}
              className="mb-2 text-xs font-semibold text-[#6c3bff]"
            >
              ← Back to Admin
            </button>

            <h1
              className="text-2xl font-bold text-[#0f1428] sm:text-3xl"
              style={{
                fontFamily: "Outfit, sans-serif",
              }}
            >
              Users
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View all users in CourseMaster.
            </p>
          </div>

          <div className="rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-[#6c3bff]">
            ADMIN
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

        {/* Summary */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs text-slate-400">
              Total Users
            </p>

            <p
              className="mt-2 text-2xl font-bold text-[#0f1428]"
              style={{
                fontFamily: "Outfit, sans-serif",
              }}
            >
              {users.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs text-slate-400">
              Students
            </p>

            <p
              className="mt-2 text-2xl font-bold text-[#0f1428]"
              style={{
                fontFamily: "Outfit, sans-serif",
              }}
            >
              {
                users.filter(
                  (user) => user.role === "STUDENT"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs text-slate-400">
              Instructors
            </p>

            <p
              className="mt-2 text-2xl font-bold text-[#0f1428]"
              style={{
                fontFamily: "Outfit, sans-serif",
              }}
            >
              {
                users.filter(
                  (user) =>
                    user.role === "INSTRUCTOR"
                ).length
              }
            </p>
          </div>
        </div>

        {/* Filters */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

            {/* Search */}
            <div className="relative w-full md:max-w-md">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by name or email..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-[#0f1428] outline-none transition focus:border-[#6c3bff] focus:bg-white"
              />
            </div>

            {/* Role */}
            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(
                  event.target.value as
                    | "ALL"
                    | UserRole
                )
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none focus:border-[#6c3bff]"
            >
              <option value="ALL">
                All Roles
              </option>

              <option value="STUDENT">
                Students
              </option>

              <option value="INSTRUCTOR">
                Instructors
              </option>

              <option value="ADMIN">
                Admins
              </option>
            </select>
          </div>

          <div className="mt-4 text-xs text-slate-400">
            Showing {filteredUsers.length} of{" "}
            {users.length} users
          </div>
        </section>

        {/* Users table */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">

          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">
                    User
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">
                    Role
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">
                    Created
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                  >
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="h-10 w-10 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-sm font-bold text-[#6c3bff]">
                            {user.name
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#0f1428]">
                            {user.name}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {user.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {user.email}
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${roleStyle(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* Created */}
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-slate-100 md:hidden">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="p-4"
              >
                <div className="flex items-start gap-3">

                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="h-11 w-11 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-sm font-bold text-[#6c3bff]">
                      {user.name
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#0f1428]">
                          {user.name}
                        </p>

                        <p className="mt-1 break-all text-xs text-slate-500">
                          {user.email}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${roleStyle(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </div>

                    <p className="mt-3 text-xs text-slate-400">
                      Joined{" "}
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredUsers.length === 0 && (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                🔎
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-700">
                No users found
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Try changing your search or role filter.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}