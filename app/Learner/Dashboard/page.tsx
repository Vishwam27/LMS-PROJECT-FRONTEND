"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
};

type DashboardStats = {
  coursesEnrolled: number;
  completedCourses: number;
  inProgressCourses: number;
  overallProgress: number;
};

type ContinueCourse = {
  id: string;
  title: string;
  imageUrl: string | null;
  category: string | null;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  learningStatus: "IN_PROGRESS";
  nextLesson: {
    id: string;
    title: string;
  } | null;
  lastAccessedAt: string | null;
};

type RecommendedCourse = {
  id: string;
  title: string;
  imageUrl: string | null;
  price: string;
  level: string;
  duration: string;
  category: {
    id: string;
    name: string;
  } | null;
};

type WeeklyActivity = {
  date: string;
  day: string;
  active: boolean;
  isToday: boolean;
};

type DashboardData = {
  user: User;
  stats: DashboardStats;
  continueLearning: ContinueCourse[];
  recommendedCourses: RecommendedCourse[];
  weeklyActivity: WeeklyActivity[];
};

export default function LearnerDashboard() {
  const router = useRouter();

  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

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

        if (!token) {
          router.replace("/");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`,
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

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load dashboard"
          );
        }

        setDashboard(data);
      } catch (error) {
        console.error(
          "Dashboard loading error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#6c3bff]" />

          <p className="mt-3 text-sm text-slate-500">
            Loading dashboard...
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
      <div className="flex h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <p className="text-sm text-red-500">
            {error || "Unable to load dashboard"}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-xl bg-[#6c3bff] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // DATA
  // =========================================================

  const {
    user,
    stats,
    continueLearning,
    recommendedCourses,
    weeklyActivity,
  } = dashboard;

  const activeDays = weeklyActivity.filter(
    (day) => day.active
  ).length;

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      className="flex h-screen flex-col overflow-hidden lg:flex-row"
      style={{
        background: "#f1f5f9",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-6">

            {/* =================================================
                WELCOME
            ================================================== */}
            <section>
              <p className="text-sm font-medium text-[#6c3bff]">
                Welcome back
              </p>

              <h1
                className="mt-1 text-2xl font-bold text-[#0f1428] sm:text-3xl"
                style={{
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                Good morning, {user.name} learner  👋
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Keep learning and make progress today.
              </p>
            </section>

            {/* =================================================
                STATS
            ================================================== */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

              {/* Enrolled */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-lg">
                    📚
                  </div>

                  <span className="text-[11px] font-semibold text-[#6c3bff]">
                    Courses
                  </span>
                </div>

                <p
                  className="mt-4 text-2xl font-bold text-[#0f1428]"
                  style={{
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  {stats.coursesEnrolled}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Courses Enrolled
                </p>
              </div>

              {/* Completed */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-lg">
                    ✅
                  </div>

                  <span className="text-[11px] font-semibold text-green-600">
                    Done
                  </span>
                </div>

                <p
                  className="mt-4 text-2xl font-bold text-[#0f1428]"
                  style={{
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  {stats.completedCourses}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Completed Courses
                </p>
              </div>

              {/* In Progress */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-lg">
                    ▶
                  </div>

                  <span className="text-[11px] font-semibold text-sky-600">
                    Active
                  </span>
                </div>

                <p
                  className="mt-4 text-2xl font-bold text-[#0f1428]"
                  style={{
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  {stats.inProgressCourses}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  In Progress
                </p>
              </div>

              {/* Overall Progress */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-lg">
                    📈
                  </div>

                  <span className="text-[11px] font-semibold text-orange-500">
                    Overall
                  </span>
                </div>

                <p
                  className="mt-4 text-2xl font-bold text-[#0f1428]"
                  style={{
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  {stats.overallProgress}%
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Overall Progress
                </p>
              </div>
            </section>

            {/* =================================================
                CONTINUE + WEEKLY ACTIVITY
            ================================================== */}
            <section className="grid gap-6 xl:grid-cols-[1fr_320px]">

              {/* Continue Learning */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2
                      className="text-base font-bold text-[#0f1428]"
                      style={{
                        fontFamily: "Outfit, sans-serif",
                      }}
                    >
                      Continue Learning
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                      Pick up where you left off.
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      router.push(
                        "/Learner/My-Courses"
                      )
                    }
                    className="text-xs font-semibold text-[#6c3bff]"
                  >
                    View all →
                  </button>
                </div>

                {continueLearning.length === 0 ? (
                  <div className="rounded-xl border border-slate-100 bg-slate-50 px-5 py-10 text-center">
                    <p className="text-sm font-medium text-slate-700">
                      No course in progress
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Start a course to see it here.
                    </p>

                    <button
                      onClick={() =>
                        router.push(
                          "/Learner/Explore"
                        )
                      }
                      className="mt-4 rounded-xl bg-[#6c3bff] px-4 py-2 text-xs font-semibold text-white"
                    >
                      Explore Courses
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {continueLearning.map(
                      (course) => (
                        <article
                          key={course.id}
                          className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-[#6c3bff] hover:shadow-sm sm:flex-row sm:items-center"
                        >
                          {/* Image */}
                          <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:h-16 sm:w-20">
                            {course.imageUrl ? (
                              <CldImage
                                src={course.imageUrl}
                                alt={course.title}
                                fill
                                className="object-cover"
                                sizes="(min-width: 640px) 80px, 100vw"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-slate-400">
                                No image
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <h3 className="truncate text-sm font-semibold text-[#0f1428]">
                                  {course.title}
                                </h3>

                                {course.category && (
                                  <p className="mt-1 text-xs text-[#6c3bff]">
                                    {course.category}
                                  </p>
                                )}
                              </div>

                              <span className="shrink-0 text-xs font-bold text-[#6c3bff]">
                                {course.progress}%
                              </span>
                            </div>

                            <p className="mt-2 truncate text-xs text-slate-400">
                              {course.nextLesson
                                ? `Next: ${course.nextLesson.title}`
                                : "Course completed"}
                            </p>

                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-[#6c3bff] transition-all"
                                style={{
                                  width: `${course.progress}%`,
                                }}
                              />
                            </div>

                            <p className="mt-1 text-xs text-slate-400">
                              {
                                course.completedLessons
                              }
                              /
                              {
                                course.totalLessons
                              }{" "}
                              lessons
                            </p>
                          </div>

                          {/* Continue button */}
                          <button
                            onClick={() =>
                              router.push(
                                `/Learner/Courses/${course.id}/learn`
                              )
                            }
                            className="flex h-9 w-full shrink-0 items-center justify-center rounded-xl bg-[#6c3bff] text-white transition hover:bg-[#5d32e8] sm:w-9"
                            aria-label={`Continue ${course.title}`}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="white"
                            >
                              <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                          </button>
                        </article>
                      )
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* =================================================
                RECOMMENDED COURSES
            ================================================== */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2
                    className="text-base font-bold text-[#0f1428]"
                    style={{
                      fontFamily: "Outfit, sans-serif",
                    }}
                  >
                    Recommended for You
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Courses you have not enrolled in yet.
                  </p>
                </div>

                <button
                  onClick={() =>
                    router.push(
                      "/Learner/Explore"
                    )
                  }
                  className="text-xs font-semibold text-[#6c3bff]"
                >
                  Explore all →
                </button>
              </div>

              {recommendedCourses.length ===
              0 ? (
                <div className="rounded-xl border border-slate-100 bg-slate-50 px-5 py-10 text-center">
                  <p className="text-sm font-medium text-slate-700">
                    No recommended courses
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    You may already be enrolled in all
                    available courses.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {recommendedCourses.map(
                    (course) => (
                      <article
                        key={course.id}
                        onClick={() =>
                          router.push(
                            `/Learner/Courses/${course.id}`
                          )
                        }
                        className="cursor-pointer overflow-hidden rounded-xl border border-slate-200 transition hover:-translate-y-0.5 hover:border-[#6c3bff] hover:shadow-lg"
                      >
                        {/* Image */}
                        <div className="relative h-36 bg-slate-100">
                          {course.imageUrl ? (
                            <CldImage
                              src={
                                course.imageUrl
                              }
                              alt={
                                course.title
                              }
                              fill
                              sizes="(min-width: 640px) 80px, 100vw"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-slate-400">
                              No image
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          {course.category && (
                            <span className="text-xs font-semibold text-[#6c3bff]">
                              {
                                course.category
                                  .name
                              }
                            </span>
                          )}

                          <h3
                            className="mt-1 line-clamp-2 text-sm font-bold text-[#0f1428]"
                            style={{
                              fontFamily:
                                "Outfit, sans-serif",
                            }}
                          >
                            {course.title}
                          </h3>

                          <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                            <span>
                              {course.level}
                            </span>

                            <span>•</span>

                            <span>
                              {course.duration}
                            </span>
                          </div>

                          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                            <span className="text-sm font-bold text-[#0f1428]">
                              $
                              {
                                course.price
                              }
                            </span>

                            <span className="text-xs font-semibold text-[#6c3bff]">
                              View Course →
                            </span>
                          </div>
                        </div>
                      </article>
                    )
                  )}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}