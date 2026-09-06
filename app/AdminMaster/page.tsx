"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AdminStats = {
  totalUsers: number;
  totalStudents: number;
  totalInstructors: number;
  totalAdmins: number;
  totalCourses: number;
  publishedCourses: number;
  totalEnrollments: number;
};

type AdminDashboardResponse = {
  message: string;
  stats: AdminStats;
};

export default function AdminPage() {
  const router = useRouter();

  const [stats, setStats] =
    useState<AdminStats | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.replace("/");
  };

  // =========================================================
  // LOAD ADMIN DASHBOARD
  // =========================================================

  useEffect(() => {
    const loadAdminDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        const storedUser =
          localStorage.getItem("user");

        if (!token || !storedUser) {
          router.replace("/");
          return;
        }

        let user;

        try {
          user = JSON.parse(storedUser);
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.replace("/");
          return;
        }

        if (user.role !== "ADMIN") {
          setError(
            "You do not have permission to access the admin area."
          );
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard`,
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
            "You do not have permission to access the admin area."
          );
          return;
        }

        const data: AdminDashboardResponse =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load admin dashboard"
          );
        }

        setStats(data.stats);
      } catch (error) {
        console.error(
          "Admin dashboard error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load admin dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    loadAdminDashboard();
  }, [router]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#6c3bff]" />

          <p className="mt-3 text-sm text-slate-500">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ACCESS ERROR
  // =========================================================

  if (error || !stats) {
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
            {error ||
              "You do not have permission to access this area."}
          </p>

          <button
            onClick={() =>
              router.push("/learner/Dashboard")
            }
            className="mt-6 rounded-xl bg-[#6c3bff] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5d32e8]"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // STATS
  // =========================================================

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: "👥",
      bg: "bg-purple-50",
    },
    {
      label: "Students",
      value: stats.totalStudents,
      icon: "🎓",
      bg: "bg-sky-50",
    },
    {
      label: "Instructors",
      value: stats.totalInstructors,
      icon: "👨‍🏫",
      bg: "bg-orange-50",
    },
    {
      label: "Admins",
      value: stats.totalAdmins,
      icon: "🛡️",
      bg: "bg-red-50",
    },
    {
      label: "Courses",
      value: stats.totalCourses,
      icon: "📚",
      bg: "bg-green-50",
    },
    {
      label: "Enrollments",
      value: stats.totalEnrollments,
      icon: "📈",
      bg: "bg-indigo-50",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <div>
            <p className="text-sm font-medium text-[#6c3bff]">
              CourseMaster
            </p>

            <h1
              className="mt-1 text-2xl font-bold text-[#0f1428] sm:text-3xl"
              style={{
                fontFamily: "Outfit, sans-serif",
              }}
            >
              Admin Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage users, instructors and courses.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-[#6c3bff] sm:inline-block">
              ADMIN
            </span>

            {/* <button
              onClick={() =>
                router.push("/learner/Dashboard")
              }
              className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 sm:block"
            >
              Learner View
            </button> */}

            <button
              onClick={handleLogout}
              className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-5 py-7 lg:px-8 lg:py-8">

        {/* =================================================
            OVERVIEW
        ================================================== */}
        <section>
          <div className="mb-5">
            <h2
              className="text-lg font-bold text-[#0f1428]"
              style={{
                fontFamily: "Outfit, sans-serif",
              }}
            >
              Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Live statistics from your LMS.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {statCards.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.bg} text-lg`}
                  >
                    {stat.icon}
                  </div>

                  <span className="text-xs font-semibold text-green-600">
                    Live
                  </span>
                </div>

                <p
                  className="mt-5 text-3xl font-bold text-[#0f1428]"
                  style={{
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  {stat.value}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* =================================================
            MANAGEMENT
        ================================================== */}

        <section className="mt-9">
          <div className="mb-5">
            <h2
              className="text-lg font-bold text-[#0f1428]"
              style={{
                fontFamily: "Outfit, sans-serif",
              }}
            >
              Management
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Access the main admin tools.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

            {/* USERS */}

            <button
              onClick={() =>
                router.push("/AdminMaster/Users")
              }
              className="rounded-2xl border border-slate-200 bg-white p-6 text-left transition hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-lg">
                👥
              </div>

              <h3 className="mt-4 text-base font-bold text-[#0f1428]">
                Users
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Manage students, instructors and admin
                accounts.
              </p>

              <span className="mt-4 inline-block text-xs font-semibold text-[#6c3bff]">
                Manage users →
              </span>
            </button>

            {/* COURSES */}

            <button
              onClick={() =>
                router.push("/AdminMater/Courses")
              }
              className="rounded-2xl border border-slate-200 bg-white p-6 text-left transition hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-lg">
                📚
              </div>

              <h3 className="mt-4 text-base font-bold text-[#0f1428]">
                Courses
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                View and manage all courses on the
                platform.
              </p>

              <span className="mt-4 inline-block text-xs font-semibold text-[#6c3bff]">
                Manage courses →
              </span>
            </button>

            {/* INSTRUCTORS */}

            <button
              onClick={() =>
                router.push("/AdminMaster/Instructors")
              }
              className="rounded-2xl border border-slate-200 bg-white p-6 text-left transition hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-lg">
                👨‍🏫
              </div>

              <h3 className="mt-4 text-base font-bold text-[#0f1428]">
                Instructors
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Approve or reject instructor applications
                and manage instructor accounts.
              </p>

              <span className="mt-4 inline-block text-xs font-semibold text-[#6c3bff]">
                Manage instructors →
              </span>
            </button>
          </div>
        </section>

        {/* =================================================
            SYSTEM STATUS
        ================================================== */}

        <section className="mt-9 rounded-2xl border border-purple-100 bg-purple-50 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white">
              🔐
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#0f1428]">
                Admin access protected
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                This dashboard requires a valid admin
                JWT. Backend role protection prevents
                non-admin users from accessing admin data.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}