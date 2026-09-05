"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import Sidebar from "../../components/learner/SideBar";

type View = "grid" | "list";

type Course = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  price: string;
  level: string;
  duration: string;
  isPublished: boolean;

  category: {
    id: string;
    name: string;
  } | null;

  enrollment: {
    id: string;
    status: string;
    enrolledAt: string;
    completedAt: string | null;
    lastAccessedAt: string | null;
  };

  progress: {
    completedLessons: number;
    totalLessons: number;
    percentage: number;
  };

  learningStatus:
    | "NOT_STARTED"
    | "IN_PROGRESS"
    | "COMPLETED";

  nextLesson: {
    id: string;
    title: string;
    order: number;
  } | null;
};

type Summary = {
  totalEnrolled: number;
  completed: number;
  inProgress: number;
  notStarted: number;
};
interface TopBarProps {
  totalCourses: number;
  search: string;
  onSearchChange: (value: string) => void;
}


export default function MyCoursesPage() {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [summary, setSummary] = useState<Summary>({
    totalEnrolled: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Title");
  const [view, setView] = useState<View>("grid");

  // =========================
  // FETCH MY COURSES
  // =========================

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          router.replace("/");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/enrollment/my-courses`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.replace("/");
            return;
          }

          throw new Error(
            data.message || "Unable to load your courses"
          );
        }

        setCourses(data.courses || []);

        setSummary(
          data.summary || {
            totalEnrolled: 0,
            completed: 0,
            inProgress: 0,
            notStarted: 0,
          }
        );
      } catch (error) {
        console.error("My courses error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load your courses"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [router]);

  // =========================
  // CATEGORIES
  // =========================

  const categories = useMemo(() => {
    const names = courses
      .map((course) => course.category?.name)
      .filter(Boolean) as string[];

    return ["All", ...Array.from(new Set(names))];
  }, [courses]);

  // =========================
  // FILTER + SORT
  // =========================

  const filteredCourses = useMemo(() => {
    const result = courses.filter((course) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        course.title.toLowerCase().includes(searchText) ||
        course.description
          .toLowerCase()
          .includes(searchText);

      const matchesCategory =
        category === "All" ||
        course.category?.name === category;

      return matchesSearch && matchesCategory;
    });

    return [...result].sort((a, b) => {
      if (sort === "Title") {
        return a.title.localeCompare(b.title);
      }

      if (sort === "Duration") {
        return a.duration.localeCompare(b.duration);
      }

      if (sort === "Price") {
        return Number(a.price) - Number(b.price);
      }

      return 0;
    });
  }, [courses, search, category, sort]);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div
        className="flex h-screen items-center justify-center bg-slate-50"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#6c3bff]" />

          <p className="mt-3 text-sm text-slate-500">
            Loading your courses...
          </p>
        </div>
      </div>
    );
  }

  function onSearchChange(value: string): void {
    throw new Error("Function not implemented.");
  }

  return (
<div
      className="flex h-screen overflow-hidden flex-col lg:flex-row"
      style={{
        background: '#f1f5f9',
        fontFamily: 'Inter, sans-serif',
      }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
       
        <header
      className="flex shrink-0 flex-col gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"
    >
      {/* Title */}
      <div>
        <h1
          className="text-xl font-bold text-[#0f1428]"
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          My Courses
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {summary.totalEnrolled === 0
            ? "You haven't enrolled in any courses yet."
            : `${summary.totalEnrolled} ${
                summary.totalEnrolled === 1 ? "course" : "courses"
              } enrolled`}
        </p>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-72">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        <input
          type="text"
          value={search}
          onChange={(e) =>
            onSearchChange(e.target.value)
          }
          placeholder="Search your courses..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#6c3bff] focus:bg-white focus:ring-2 focus:ring-purple-100"
        />
      </div>
    </header>

        <main className="flex-1 overflow-y-auto px-5 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">

            {/* Header */}
            <div className="mb-6">
              <h1
                className="text-3xl font-bold text-[#0f1428]"
                style={{
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                My Courses
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Courses you are enrolled in.
              </p>
            </div>

            {/* Summary */}
            <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-400">
                  Total Enrolled
                </p>
                <p className="mt-1 text-2xl font-bold text-[#0f1428]">
                  {summary.totalEnrolled}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-400">
                  Completed
                </p>
                <p className="mt-1 text-2xl font-bold text-green-600">
                  {summary.completed}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-400">
                  In Progress
                </p>
                <p className="mt-1 text-2xl font-bold text-[#6c3bff]">
                  {summary.inProgress}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-400">
                  Not Started
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-600">
                  {summary.notStarted}
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

              {/* Category */}
              <div className="flex flex-wrap gap-2">
                {categories.map((item) => (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className="rounded-xl px-3 py-2 text-xs font-medium transition"
                    style={{
                      background:
                        category === item
                          ? "#6c3bff"
                          : "white",
                      color:
                        category === item
                          ? "white"
                          : "#64748b",
                      border: `1px solid ${
                        category === item
                          ? "#6c3bff"
                          : "#e2e8f0"
                      }`,
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">

                {/* Sort */}
                <select
                  value={sort}
                  onChange={(e) =>
                    setSort(e.target.value)
                  }
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none"
                >
                  <option>Title</option>
                  <option>Duration</option>
                  <option>Price</option>
                </select>

                {/* View */}
                <div className="flex rounded-xl bg-slate-100 p-1">
                  <button
                    onClick={() => setView("grid")}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      view === "grid"
                        ? "bg-white text-[#6c3bff] shadow-sm"
                        : "text-slate-400"
                    }`}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="7"
                        height="7"
                        rx="1"
                      />
                      <rect
                        x="14"
                        y="3"
                        width="7"
                        height="7"
                        rx="1"
                      />
                      <rect
                        x="14"
                        y="14"
                        width="7"
                        height="7"
                        rx="1"
                      />
                      <rect
                        x="3"
                        y="14"
                        width="7"
                        height="7"
                        rx="1"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() => setView("list")}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      view === "list"
                        ? "bg-white text-[#6c3bff] shadow-sm"
                        : "text-slate-400"
                    }`}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line
                        x1="4"
                        y1="6"
                        x2="20"
                        y2="6"
                      />
                      <line
                        x1="4"
                        y1="12"
                        x2="20"
                        y2="12"
                      />
                      <line
                        x1="4"
                        y1="18"
                        x2="20"
                        y2="18"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Empty */}
            {courses.length === 0 && !error && (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#6c3bff"
                    strokeWidth="1.8"
                  >
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
                  </svg>
                </div>

                <h2
                  className="text-lg font-bold text-[#0f1428]"
                  style={{
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  No courses enrolled yet
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Once you enroll in a course, it will appear here.
                </p>

                <button
                  onClick={() =>
                    router.push("/Learner/Explore")
                  }
                  className="mt-6 rounded-xl bg-[#6c3bff] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5d32e8]"
                >
                  Explore Courses
                </button>
              </div>
            )}

            {/* No filter result */}
            {courses.length > 0 &&
              filteredCourses.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
                  <h2 className="text-base font-semibold text-[#0f1428]">
                    No courses found
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Try a different search or category.
                  </p>
                </div>
              )}

            {/* GRID */}
            {view === "grid" &&
              filteredCourses.length > 0 && (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredCourses.map((course) => (
                    <article
                      key={course.id}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      {/* Image */}
                      <div className="relative h-44 bg-slate-100">
                        {course.imageUrl ? (
                          <CldImage
                            src={course.imageUrl}
                            alt={course.title}
                            fill
                            sizes="(min-width: 640px) 80px, 100vw"
                            className="object-cover"
                            loading="eager"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-slate-400">
                            No image
                          </div>
                        )}

                        <span
                          className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold"
                          style={{
                            background:
                              course.learningStatus ===
                              "COMPLETED"
                                ? "#dcfce7"
                                : course.learningStatus ===
                                  "IN_PROGRESS"
                                ? "#ede9fe"
                                : "#f1f5f9",
                            color:
                              course.learningStatus ===
                              "COMPLETED"
                                ? "#16a34a"
                                : course.learningStatus ===
                                  "IN_PROGRESS"
                                ? "#6c3bff"
                                : "#64748b",
                          }}
                        >
                          {course.learningStatus ===
                          "COMPLETED"
                            ? "Completed"
                            : course.learningStatus ===
                              "IN_PROGRESS"
                            ? "In Progress"
                            : "Not Started"}
                        </span>
                      </div>

                      <div className="p-5">

                        <div className="mb-3 flex items-center justify-between gap-2">
                          {course.category && (
                            <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-[#6c3bff]">
                              {course.category.name}
                            </span>
                          )}

                          <span className="text-xs text-slate-400">
                            {course.level}
                          </span>
                        </div>

                        <h2
                          className="line-clamp-2 text-base font-bold text-[#0f1428]"
                          style={{
                            fontFamily: "Outfit, sans-serif",
                          }}
                        >
                          {course.title}
                        </h2>

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                          {course.description}
                        </p>

                        {/* Progress */}
                        <div className="mt-4">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-xs text-slate-400">
                              {course.progress.completedLessons}/
                              {course.progress.totalLessons} lessons
                            </span>

                            <span className="text-xs font-bold text-[#6c3bff]">
                              {course.progress.percentage}%
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-[#6c3bff] transition-all"
                              style={{
                                width: `${course.progress.percentage}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Next lesson */}
                        {course.nextLesson && (
                          <p className="mt-3 line-clamp-1 text-xs text-slate-400">
                            Next:{" "}
                            <span className="font-medium text-slate-600">
                              {course.nextLesson.title}
                            </span>
                          </p>
                        )}

                        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                          <div>
                            <p className="text-xs text-slate-400">
                              Duration
                            </p>

                            <p className="text-sm font-semibold text-slate-700">
                              {course.duration}
                            </p>
                          </div>

                          <button
                            onClick={() =>
                              router.push(
                                `/Learner/Courses/${course.id}/Learn`
                              )
                            }
                            className="rounded-xl bg-[#6c3bff] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#5d32e8]"
                          >
                            {course.learningStatus ===
                            "COMPLETED"
                              ? "Review"
                              : course.learningStatus ===
                                "IN_PROGRESS"
                              ? "Continue"
                              : "Start"}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

            {/* LIST */}
            {view === "list" &&
              filteredCourses.length > 0 && (
                <div className="space-y-3">
                  {filteredCourses.map((course) => (
                    <article
                      key={course.id}
                      className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:shadow-md sm:flex-row"
                    >
                      <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-24 sm:w-36">
                        {course.imageUrl ? (
                          <CldImage
                            src={course.imageUrl}
                            alt={course.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-slate-400">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className="rounded-full px-2.5 py-1 text-xs font-semibold"
                            style={{
                              background:
                                course.learningStatus ===
                                "COMPLETED"
                                  ? "#dcfce7"
                                  : course.learningStatus ===
                                    "IN_PROGRESS"
                                  ? "#ede9fe"
                                  : "#f1f5f9",
                              color:
                                course.learningStatus ===
                                "COMPLETED"
                                  ? "#16a34a"
                                  : course.learningStatus ===
                                    "IN_PROGRESS"
                                  ? "#6c3bff"
                                  : "#64748b",
                            }}
                          >
                            {course.learningStatus ===
                            "COMPLETED"
                              ? "Completed"
                              : course.learningStatus ===
                                "IN_PROGRESS"
                              ? "In Progress"
                              : "Not Started"}
                          </span>

                          {course.category && (
                            <span className="text-xs text-slate-400">
                              {course.category.name}
                            </span>
                          )}
                        </div>

                        <h2
                          className="mt-2 text-base font-bold text-[#0f1428]"
                          style={{
                            fontFamily: "Outfit, sans-serif",
                          }}
                        >
                          {course.title}
                        </h2>

                        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                          {course.description}
                        </p>

                        <div className="mt-3 flex items-center gap-4">
                          <div className="flex-1">
                            <div className="mb-1 flex items-center justify-between">
                              <span className="text-xs text-slate-400">
                                {course.progress.completedLessons}/
                                {course.progress.totalLessons} lessons
                              </span>

                              <span className="text-xs font-bold text-[#6c3bff]">
                                {course.progress.percentage}%
                              </span>
                            </div>

                            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-[#6c3bff]"
                                style={{
                                  width: `${course.progress.percentage}%`,
                                }}
                              />
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              router.push(
                                `/Learner/Courses/${course.id}/Learn`
                              )
                            }
                            className="shrink-0 rounded-xl bg-[#6c3bff] px-4 py-2 text-xs font-semibold text-white"
                          >
                            {course.learningStatus ===
                            "COMPLETED"
                              ? "Review"
                              : course.learningStatus ===
                                "IN_PROGRESS"
                              ? "Continue"
                              : "Start"}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
          </div>
        </main>
      </div>
    </div>
  );
}