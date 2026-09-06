"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";

type Category = {
  id: string;
  name: string;
};

type Instructor = {
  id: string;
  name: string;
  email: string;
  role: "INSTRUCTOR";
  status: "APPROVED";
  avatarUrl: string | null;
};

type Course = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  price: string | number;
  level: string;
  duration: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;

  category: Category | null;

  _count: {
    lessons: number;
    enrollments: number;
  };
};

type DashboardResponse = {
  instructor: Instructor;

  stats: {
    totalCourses: number;
    publishedCourses: number;
    totalStudents: number;
    totalLessons: number;
  };

  courses: Course[];
};

export default function InstructorDashboardPage() {
  const router = useRouter();

  const [dashboard, setDashboard] =
    useState<DashboardResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH DASHBOARD
  // =========================================================

  useEffect(() => {
    const fetchDashboard = async () => {
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

        // Frontend protection
        if (
          currentUser.role !== "INSTRUCTOR" ||
          currentUser.status !== "APPROVED"
        ) {
          setError(
            "Your instructor account is not approved."
          );
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/instructor/dashboard`,
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
            "Your instructor account is not approved."
          );
          return;
        }

        const data: DashboardResponse & {
          message?: string;
        } = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load instructor dashboard"
          );
        }

        setDashboard(data);
      } catch (error) {
        console.error(
          "Instructor dashboard error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load instructor dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.replace("/");
  };

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
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-[#6c3bff]" />

          <p className="mt-3 text-sm text-slate-500">
            Loading instructor dashboard...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error || !dashboard) {
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
            Instructor Access Unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error ||
              "Unable to load your instructor dashboard."}
          </p>

          <button
            onClick={() => router.replace("/")}
            className="mt-6 rounded-xl bg-[#6c3bff] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5d32e8]"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  const {
    instructor,
    stats,
    courses,
  } = dashboard;

  return (
    <div
      className="min-h-screen bg-slate-50"
      style={{
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-[#6c3bff] to-[#8a5fff] text-white shadow-sm">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 3 4 7l8 4 8-4-8-4Z" />
                <path d="m4 12 8 4 8-4" />
                <path d="m4 17 8 4 8-4" />
              </svg>
            </div>

            <div>
              <p
                className="text-lg font-bold text-[#0f1428]"
                style={{
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                CourseMaster
              </p>

              <p className="text-[11px] font-medium text-[#6c3bff]">
                Instructor Panel
              </p>
            </div>
          </div>

          {/* Instructor */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-[#0f1428]">
                {instructor.name}
              </p>

              <p className="text-xs text-slate-400">
                {instructor.email}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-purple-100">
              {instructor.avatarUrl ? (
                <img
                  src={instructor.avatarUrl}
                  alt={instructor.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-bold text-[#6c3bff]">
                  {instructor.name
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              )}
            </div>

               <div className="flex items-center gap-2">  
                {/* View Learner Side */}
 <button
  onClick={() => router.push("/Learner/Dashboard")}
  className="hidden rounded-xl border border-blue-200 px-4 py-2.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 sm:block"
>
  Learner View →
</button>

  {/* Logout */}
  <button
    onClick={handleLogout}
    className="rounded-xl border border-purple-200 px-4 py-2.5 text-xs font-semibold text-[#6c3bff] transition hover:bg-purple-50"
  >
    Logout
  </button>
                </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-5 py-6 lg:px-8 lg:py-8">

        {/* Welcome */}
        <section className="mb-6">
          <p className="text-sm font-semibold text-[#6c3bff]">
            Instructor Dashboard
          </p>

          <h1
            className="mt-1 text-2xl font-bold text-[#0f1428] sm:text-3xl"
            style={{
              fontFamily: "Outfit, sans-serif",
            }}
          >
            Welcome back, {instructor.name}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your courses, lessons, and students
            from one place.
          </p>
        </section>

        {/* =================================================
            STATS
        ================================================== */}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total Courses */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">
                  Total Courses
                </p>

                <p
                  className="mt-2 text-3xl font-bold text-[#0f1428]"
                  style={{
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  {stats.totalCourses}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  All courses created
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-[#6c3bff]">
                📚
              </div>
            </div>
          </div>

          {/* Published Courses */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">
                  Published Courses
                </p>

                <p
                  className="mt-2 text-3xl font-bold text-green-600"
                  style={{
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  {stats.publishedCourses}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Courses currently live
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                ✓
              </div>
            </div>
          </div>

          {/* Students */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">
                  Total Students
                </p>

                <p
                  className="mt-2 text-3xl font-bold text-blue-600"
                  style={{
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  {stats.totalStudents}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Across your courses
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                👥
              </div>
            </div>
          </div>

          {/* Lessons */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">
                  Total Lessons
                </p>

                <p
                  className="mt-2 text-3xl font-bold text-[#6c3bff]"
                  style={{
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  {stats.totalLessons}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Lessons created
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-[#6c3bff]">
                ▶
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            MY COURSES
        ================================================== */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">

          <div className="mb-5">
            <div>
              <h2
                className="text-lg font-bold text-[#0f1428]"
                style={{
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                My Courses
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your recently updated courses.
              </p>
            </div>
          </div>

          {courses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-xl">
                📚
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-700">
                No courses yet
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Create your first course to start
                teaching students.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {courses.slice(0, 4).map((course) => (
                <article
                  key={course.id}
                  onClick={() =>
                    router.push(
                      `/Instructor/Courses/${course.id}`
                    )
                  }
                  className="group flex cursor-pointer gap-3 rounded-xl border border-slate-200 bg-white p-3 transition hover:border-purple-200 hover:bg-purple-50/30"
                >
                  {/* Small image */}
                  <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {course.imageUrl ? (
                      <CldImage
                        src={course.imageUrl}
                        alt={course.title}
                        fill
                        crop="fill"
                        gravity="auto"
                        className="object-cover transition duration-300 group-hover:scale-105"
                        sizes="96px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-slate-400">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Information */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#0f1428]">
                          {course.title}
                        </p>

                        <p className="mt-1 truncate text-[11px] text-[#6c3bff]">
                          {course.category?.name ||
                            "Uncategorized"}
                        </p>
                      </div>

                      {course.isPublished ? (
                        <span className="shrink-0 rounded-full bg-green-50 px-2 py-1 text-[9px] font-semibold text-green-600">
                          Published
                        </span>
                      ) : (
                        <span className="shrink-0 rounded-full bg-orange-50 px-2 py-1 text-[9px] font-semibold text-orange-600">
                          Draft
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                      <span>
                        {course._count.lessons} lessons
                      </span>

                      <span>•</span>

                      <span>
                        {course._count.enrollments} students
                      </span>

                      <span>•</span>

                      <span>
                        {course.duration}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        Updated{" "}
                        {formatDate(
                          course.updatedAt
                        )}
                      </span>

                      <span className="text-xs font-bold text-[#0f1428]">
                        ${course.price}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Course count */}
          {courses.length > 6 && (
            <p className="mt-4 text-center text-xs text-slate-400">
              Showing 6 of {courses.length} courses
            </p>
          )}
        </section>

        {/* =================================================
            BOTTOM ACTIONS
        ================================================== */}

        <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">

          {/* Create Course */}
          <div className="rounded-2xl border border-purple-100 bg-linear-to-br from-purple-50 to-white p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-xl text-[#6c3bff]">
                  +
                </div>

                <h3
                  className="mt-4 text-lg font-bold text-[#0f1428]"
                  style={{
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  Create New Course
                </h3>

                <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
                  Create a course and start adding
                  lessons and content.
                </p>
              </div>

              <button
                onClick={() =>
                  router.push(
                    "/Instructor/Courses/Create"
                  )
                }
                className="shrink-0 rounded-xl bg-[#6c3bff] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#5d32e8]"
              >
                + Create Course
              </button>
            </div>
          </div>

          {/* Manage Courses */}
          <div className="rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50 to-white p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-xl text-blue-600">
                  📁
                </div>

                <h3
                  className="mt-4 text-lg font-bold text-[#0f1428]"
                  style={{
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  Manage Courses
                </h3>

                <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
                  View, edit, delete, and manage
                  lessons for your courses.
                </p>
              </div>

              <button
                onClick={() =>
                  router.push(
                    "/Instructor/Courses"
                  )
                }
                className="shrink-0 rounded-xl bg-blue-600 px-5 py-3 text-xs font-semibold text-white transition hover:bg-blue-700"
              >
                Manage Courses →
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}