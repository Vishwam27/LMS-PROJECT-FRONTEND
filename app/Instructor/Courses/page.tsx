"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";

type Category = {
  id: string;
  name: string;
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

type CoursesResponse = {
  courses: Course[];
  total: number;
};

export default function InstructorCoursesPage() {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH COURSES
  // =========================================================

  useEffect(() => {
    const fetchCourses = async () => {
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/instructor/courses`,
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

        const data: CoursesResponse & {
          message?: string;
        } = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load your courses"
          );
        }

        setCourses(data.courses);
      } catch (error) {
        console.error(
          "Instructor courses error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load your courses"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [router]);

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
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.replace("/");
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
            Loading your courses...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
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
            Instructor Access Unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error}
          </p>

          <button
            onClick={() =>
              router.replace("/Instructor/Dashboard")
            }
            className="mt-6 rounded-xl bg-[#6c3bff] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5d32e8]"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

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

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <div>
            <button
              onClick={() =>
                router.push("/Instructor/Dashboard")
              }
              className="mb-2 text-xs font-semibold text-[#6c3bff]"
            >
              ← Back to Dashboard
            </button>

            <h1
              className="text-2xl font-bold text-[#0f1428] sm:text-3xl"
              style={{
                fontFamily: "Outfit, sans-serif",
              }}
            >
              My Courses
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your courses and course content.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-purple-200 px-4 py-2.5 text-xs font-semibold text-[#6c3bff] transition hover:bg-purple-50"
          >
            Logout
          </button>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-5 py-6 lg:px-8 lg:py-8">

        {/* Course count */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2
              className="text-lg font-bold text-[#0f1428]"
              style={{
                fontFamily: "Outfit, sans-serif",
              }}
            >
              All Courses
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {courses.length}{" "}
              {courses.length === 1
                ? "course"
                : "courses"}
            </p>
          </div>
        </div>

        {/* =================================================
            EMPTY STATE
        ================================================== */}

        {courses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-xl">
              📚
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-700">
              No courses yet
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              You haven't created any courses yet.
            </p>

            <button
              onClick={() =>
                router.push(
                  "/Instructor/Courses/Create"
                )
              }
              className="mt-5 rounded-xl bg-[#6c3bff] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#5d32e8]"
            >
              + Create Course
            </button>
          </div>
        ) : (
          /* =================================================
             COURSE LIST
          ================================================== */

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <article
                key={course.id}
                onClick={() =>
                  router.push(
                    `/Instructor/Courses/${course.id}`
                  )
                }
                className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md"
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden bg-slate-100">
                  {course.imageUrl ? (
                    <CldImage
                      src={course.imageUrl}
                      alt={course.title}
                      fill
                      crop="fill"
                      gravity="auto"
                      className="object-cover transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                      No course image
                    </div>
                  )}

                  {/* Status */}
                  <div className="absolute right-3 top-3">
                    {course.isPublished ? (
                      <span className="rounded-full bg-green-50 px-3 py-1 text-[10px] font-semibold text-green-600 shadow-sm">
                        Published
                      </span>
                    ) : (
                      <span className="rounded-full bg-orange-50 px-3 py-1 text-[10px] font-semibold text-orange-600 shadow-sm">
                        Draft
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <p className="text-xs font-semibold text-[#6c3bff]">
                    {course.category?.name ||
                      "Uncategorized"}
                  </p>

                  <div className="mt-1 flex items-start justify-between gap-3">
                    <h3
                      className="line-clamp-2 text-base font-bold text-[#0f1428]"
                      style={{
                        fontFamily: "Outfit, sans-serif",
                      }}
                    >
                      {course.title}
                    </h3>

                    <span className="shrink-0 text-slate-400 transition group-hover:text-[#6c3bff]">
                      →
                    </span>
                  </div>

                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">
                    {course.description}
                  </p>

                  {/* Meta */}
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-slate-50 px-3 py-2">
                      <p className="text-[10px] text-slate-400">
                        Lessons
                      </p>

                      <p className="mt-0.5 font-semibold text-slate-700">
                        {course._count.lessons}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 px-3 py-2">
                      <p className="text-[10px] text-slate-400">
                        Students
                      </p>

                      <p className="mt-0.5 font-semibold text-slate-700">
                        {course._count.enrollments}
                      </p>
                    </div>
                  </div>

                  {/* Bottom */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-[11px] text-slate-400">
                      Updated{" "}
                      {formatDate(
                        course.updatedAt
                      )}
                    </span>

                    <span className="text-sm font-bold text-[#0f1428]">
                      ${course.price}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}