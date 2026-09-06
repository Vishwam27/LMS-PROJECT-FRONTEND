"use client";

import { useEffect, useMemo, useState } from "react";
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
};

type Course = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  price: string | number;
  level: string;
  duration: string;
  instructorId: string | null;
  categoryId: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;

  category: Category | null;
  instructor: Instructor | null;

  _count: {
    lessons: number;
    enrollments: number;
  };
};

type CoursesResponse = {
  courses: Course[];
  total: number;
};

type StatusFilter = "ALL" | "PUBLISHED" | "DRAFT";

export default function AdminCoursesPage() {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  const [courseToDelete, setCourseToDelete] =
    useState<Course | null>(null);

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

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

        if (currentUser.role !== "ADMIN") {
          setError(
            "You do not have permission to access this page."
          );
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/courses`,
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

        const data: CoursesResponse & {
          message?: string;
        } = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load courses"
          );
        }

        setCourses(data.courses);
      } catch (error) {
        console.error(
          "Admin courses loading error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load courses"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [router]);

  // =========================================================
  // FILTER COURSES
  // =========================================================

  const filteredCourses = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesSearch =
        !searchValue ||
        course.title
          .toLowerCase()
          .includes(searchValue) ||
        course.description
          .toLowerCase()
          .includes(searchValue) ||
        course.category?.name
          .toLowerCase()
          .includes(searchValue) ||
        course.instructor?.name
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "PUBLISHED" &&
          course.isPublished) ||
        (statusFilter === "DRAFT" &&
          !course.isPublished);

      return matchesSearch && matchesStatus;
    });
  }, [courses, search, statusFilter]);

  // =========================================================
  // COUNTS
  // =========================================================

  const publishedCount = courses.filter(
    (course) => course.isPublished
  ).length;

  const draftCount = courses.filter(
    (course) => !course.isPublished
  ).length;

  const totalLessons = courses.reduce(
    (total, course) =>
      total + course._count.lessons,
    0
  );

  const totalEnrollments = courses.reduce(
    (total, course) =>
      total + course._count.enrollments,
    0
  );

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
  // DELETE COURSE
  // =========================================================

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      setDeleting(true);
      setDeleteError("");

      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/courses/${courseToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/");
        return;
      }

      if (response.status === 403) {
        setDeleteError(
          "You do not have permission to delete this course."
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to delete course"
        );
      }

      setCourses((currentCourses) =>
        currentCourses.filter(
          (course) =>
            course.id !== courseToDelete.id
        )
      );

      setCourseToDelete(null);
    } catch (error) {
      console.error(
        "Delete course error:",
        error
      );

      setDeleteError(
        error instanceof Error
          ? error.message
          : "Unable to delete course"
      );
    } finally {
      setDeleting(false);
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
            Loading courses...
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
            style={{ fontFamily: "Outfit, sans-serif" }}
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

  return (
    <div
      className="min-h-screen bg-slate-50"
      style={{ fontFamily: "Inter, sans-serif" }}
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
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Courses
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View and manage all courses in CourseMaster.
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
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs text-slate-400">
              Total Courses
            </p>

            <p
              className="mt-2 text-2xl font-bold text-[#0f1428]"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              {courses.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs text-slate-400">
              Published
            </p>

            <p
              className="mt-2 text-2xl font-bold text-green-600"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              {publishedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs text-slate-400">
              Drafts
            </p>

            <p
              className="mt-2 text-2xl font-bold text-orange-500"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              {draftCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs text-slate-400">
              Total Enrollments
            </p>

            <p
              className="mt-2 text-2xl font-bold text-[#6c3bff]"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              {totalEnrollments}
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

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
                placeholder="Search courses..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-[#0f1428] outline-none transition focus:border-[#6c3bff] focus:bg-white"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as StatusFilter
                )
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none focus:border-[#6c3bff]"
            >
              <option value="ALL">All Courses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span>
              Showing {filteredCourses.length} of{" "}
              {courses.length} courses
            </span>

            <span>•</span>

            <span>{totalLessons} total lessons</span>

            <span>•</span>

            <span>{publishedCount} published</span>
          </div>
        </section>

        {/* Course table */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">
                    Course
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">
                    Instructor
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500">
                    Lessons
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500">
                    Enrollments
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCourses.map((course) => (
                  <tr
                    key={course.id}
                    onClick={() =>
                      router.push(
                        `/AdminMaster/Courses/${course.id}`
                      )
                    }
                    className="cursor-pointer border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                  >
                    {/* Course */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                          {course.imageUrl ? (
                            <CldImage
                              src={course.imageUrl}
                              alt={course.title}
                              width={160}
                              height={112}
                              crop="fill"
                              gravity="auto"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-slate-400">
                              No image
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-xs truncate text-sm font-semibold text-[#0f1428]">
                            {course.title}
                          </p>

                          <p className="mt-1 max-w-xs truncate text-xs text-slate-400">
                            {course.level} •{" "}
                            {course.duration}
                          </p>

                          <p className="mt-1 text-xs font-medium text-[#6c3bff]">
                            ${course.price}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-[#6c3bff]">
                        {course.category?.name ||
                          "Uncategorized"}
                      </span>
                    </td>

                    {/* Instructor */}
                    <td className="px-6 py-4">
                      {course.instructor ? (
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            {course.instructor.name}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {course.instructor.email}
                          </p>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">
                          Not assigned
                        </span>
                      )}
                    </td>

                    {/* Lessons */}
                    <td className="px-6 py-4 text-center text-sm font-medium text-slate-600">
                      {course._count.lessons}
                    </td>

                    {/* Enrollments */}
                    <td className="px-6 py-4 text-center text-sm font-medium text-slate-600">
                      {course._count.enrollments}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {course.isPublished ? (
                        <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                          Draft
                        </span>
                      )}

                      <p className="mt-2 text-xs text-slate-400">
                        {formatDate(course.createdAt)}
                      </p>
                    </td>

                    {/* Delete */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();

                          setDeleteError("");
                          setCourseToDelete(course);
                        }}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="divide-y divide-slate-100 md:hidden">
            {filteredCourses.map((course) => (
              <article
                key={course.id}
                onClick={() =>
                  router.push(
                    `/AdminMaster/Courses/${course.id}`
                  )
                }
                className="cursor-pointer p-4 transition hover:bg-slate-50"
              >
                <div className="flex gap-3">
                  <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    {course.imageUrl ? (
                      <CldImage
                        src={course.imageUrl}
                        alt={course.title}
                        width={240}
                        height={160}
                        crop="fill"
                        gravity="auto"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-slate-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="truncate text-sm font-semibold text-[#0f1428]">
                        {course.title}
                      </h3>

                      {course.isPublished ? (
                        <span className="shrink-0 rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-600">
                          Published
                        </span>
                      ) : (
                        <span className="shrink-0 rounded-full bg-orange-50 px-2 py-1 text-[10px] font-semibold text-orange-600">
                          Draft
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-[#6c3bff]">
                      {course.category?.name ||
                        "Uncategorized"}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      {course.level} •{" "}
                      {course.duration}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {course._count.lessons} lessons •{" "}
                      {course._count.enrollments} enrollments
                    </p>

                    <p className="mt-2 text-xs font-semibold text-slate-700">
                      {course.instructor
                        ? course.instructor.name
                        : "No instructor"}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs text-slate-400">
                    Created {formatDate(course.createdAt)}
                  </span>

                  <button
                    onClick={(event) => {
                      event.stopPropagation();

                      setDeleteError("");
                      setCourseToDelete(course);
                    }}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Empty */}
          {filteredCourses.length === 0 && (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                🔎
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-700">
                No courses found
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Try changing your search or status filter.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ====================================================== */}

      {courseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-course-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl">
              ⚠️
            </div>

            <h2
              id="delete-course-title"
              className="mt-5 text-lg font-bold text-[#0f1428]"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Delete Course
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-800">
                "{courseToDelete.title}"
              </span>
              ?
            </p>

            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
              <p className="text-xs leading-5 text-red-600">
                This will permanently remove the course,
                its lessons, enrollments, and progress records.
              </p>
            </div>

            {deleteError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
                {deleteError}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  if (deleting) return;

                  setDeleteError("");
                  setCourseToDelete(null);
                }}
                disabled={deleting}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteCourse}
                disabled={deleting}
                className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Course"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}