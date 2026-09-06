"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

type Lesson = {
  id: string;
  title: string;
  description: string | null;
  duration: number | null;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
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

  lessons: Lesson[];

  _count: {
    lessons: number;
    enrollments: number;
  };
};

type CourseResponse = {
  course: Course;
};

export default function AdminCourseDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const courseId = params?.id;

  const [course, setCourse] = useState<Course | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [lessonToDelete, setLessonToDelete] =
    useState<Lesson | null>(null);

  const [deletingLesson, setDeletingLesson] =
    useState(false);

  const [deleteError, setDeleteError] = useState("");

  // =========================================================
  // FETCH COURSE
  // =========================================================

  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
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

        // Frontend access check
        if (currentUser.role !== "ADMIN") {
          setError(
            "You do not have permission to access this page."
          );
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/courses/${courseId}`,
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

        const data: CourseResponse & {
          message?: string;
        } = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load course"
          );
        }

        setCourse(data.course);
      } catch (error) {
        console.error(
          "Admin course details error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load course"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, router]);

  // =========================================================
  // DELETE LESSON
  // =========================================================

  const handleDeleteLesson = async () => {
    if (!lessonToDelete || !course) return;

    try {
      setDeletingLesson(true);
      setDeleteError("");

      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/lessons/${lessonToDelete.id}`,
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
          "You do not have permission to delete this lesson."
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to delete lesson"
        );
      }

      // Remove lesson from current UI
      setCourse((currentCourse) => {
        if (!currentCourse) return currentCourse;

        return {
          ...currentCourse,
          lessons: currentCourse.lessons.filter(
            (lesson) =>
              lesson.id !== lessonToDelete.id
          ),
          _count: {
            ...currentCourse._count,
            lessons: Math.max(
              0,
              currentCourse._count.lessons - 1
            ),
          },
        };
      });

      // Close modal
      setLessonToDelete(null);
    } catch (error) {
      console.error(
        "Delete lesson error:",
        error
      );

      setDeleteError(
        error instanceof Error
          ? error.message
          : "Unable to delete lesson"
      );
    } finally {
      setDeletingLesson(false);
    }
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
  // FORMAT LESSON DURATION
  // =========================================================

  const formatLessonDuration = (
    seconds: number | null
  ) => {
    if (!seconds || seconds <= 0) {
      return "—";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes === 0) {
      return `${remainingSeconds}s`;
    }

    if (remainingSeconds === 0) {
      return `${minutes}m`;
    }

    return `${minutes}m ${remainingSeconds}s`;
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
            Loading course...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error || !course) {
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
            Unable to Load Course
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error || "Course not found."}
          </p>

          <button
            onClick={() => router.push("/AdminMaster/Courses")}
            className="mt-6 rounded-xl bg-[#6c3bff] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5d32e8]"
          >
            Back to Courses
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
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <div>
            <button
              onClick={() =>
                router.push("/AdminMaster/Courses")
              }
              className="mb-2 text-xs font-semibold text-[#6c3bff]"
            >
              ← Back to Courses
            </button>

            <h1
              className="text-2xl font-bold text-[#0f1428] sm:text-3xl"
              style={{
                fontFamily: "Outfit, sans-serif",
              }}
            >
              Course Details
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Review course information and content.
            </p>
          </div>

          <div className="rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-[#6c3bff]">
            ADMIN
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

        {/* =================================================
            COURSE INFORMATION
        ================================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid lg:grid-cols-[320px_1fr]">

            {/* Image */}
            <div className="relative min-h-60 bg-slate-100 lg:min-h-full">
              {course.imageUrl ? (
                <CldImage
                  src={course.imageUrl}
                  alt={course.title}
                  fill
                  crop="fill"
                  gravity="auto"
                  className="object-cover"
                  sizes="320px"
                />
              ) : (
                <div className="flex h-full min-h-60 items-center justify-center text-sm text-slate-400">
                  No image
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                {course.category && (
                  <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-[#6c3bff]">
                    {course.category.name}
                  </span>
                )}

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {course.level}
                </span>

                {course.isPublished ? (
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                    Published
                  </span>
                ) : (
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                    Draft
                  </span>
                )}
              </div>

              <h2
                className="mt-4 text-2xl font-bold text-[#0f1428] sm:text-3xl"
                style={{
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                {course.title}
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500">
                {course.description}
              </p>

              {/* Course metadata */}
              <div className="mt-7 grid grid-cols-2 gap-5 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-slate-400">
                    Duration
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {course.duration}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Price
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    ${course.price}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Lessons
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {course._count.lessons}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Enrollments
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {course._count.enrollments}
                  </p>
                </div>
              </div>

              {/* Instructor */}
              <div className="mt-7 border-t border-slate-100 pt-6">
                <p className="text-xs text-slate-400">
                  Instructor
                </p>

                {course.instructor ? (
                  <div className="mt-2">
                    <p className="text-sm font-semibold text-slate-700">
                      {course.instructor.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {course.instructor.email}
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-slate-400">
                    No instructor assigned
                  </p>
                )}
              </div>

              {/* Created */}
              <div className="mt-5">
                <p className="text-xs text-slate-400">
                  Created
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {formatDate(course.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            COURSE CONTENT
        ================================================== */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2
                  className="text-lg font-bold text-[#0f1428]"
                  style={{
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  Course Content
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {course.lessons.length}{" "}
                  {course.lessons.length === 1
                    ? "lesson"
                    : "lessons"}{" "}
                  in this course.
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                {course.lessons.length} Total
              </span>
            </div>
          </div>

          {course.lessons.length === 0 ? (
            <div className="px-6 py-14 text-center sm:px-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xl">
                📚
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-700">
                No lessons yet
              </p>

              <p className="mt-1 text-xs text-slate-400">
                This course doesn't contain any lessons.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {course.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="px-6 py-5 sm:px-8"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    {/* Lesson info */}
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-sm font-bold text-[#6c3bff]">
                        {lesson.order}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-[#0f1428]">
                            {lesson.title}
                          </h3>

                          {lesson.isPublished ? (
                            <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-600">
                              Published
                            </span>
                          ) : (
                            <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-semibold text-orange-600">
                              Draft
                            </span>
                          )}
                        </div>

                        {lesson.description && (
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">
                            {lesson.description}
                          </p>
                        )}

                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                          <span>
                            Duration:{" "}
                            {formatLessonDuration(
                              lesson.duration
                            )}
                          </span>

                          <span>•</span>

                          <span>
                            Added{" "}
                            {formatDate(
                              lesson.createdAt
                            )}
                          </span>
                        </div>

                        {/* Intentionally no video URL / preview */}
                        <p className="mt-2 text-[11px] text-slate-400">
                          Video content is hidden from the admin view.
                        </p>
                      </div>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => {
                        setDeleteError("");
                        setLessonToDelete(lesson);
                      }}
                      className="w-full shrink-0 rounded-xl border border-red-200 px-4 py-2.5 text-xs font-semibold text-red-500 transition hover:bg-red-50 sm:w-auto"
                    >
                      Delete Lesson
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* =====================================================
          DELETE LESSON MODAL
      ====================================================== */}

      {lessonToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-lesson-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl">
              ⚠️
            </div>

            <h2
              id="delete-lesson-title"
              className="mt-5 text-lg font-bold text-[#0f1428]"
              style={{
                fontFamily: "Outfit, sans-serif",
              }}
            >
              Delete Lesson
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-800">
                "{lessonToDelete.title}"
              </span>
              ?
            </p>

            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
              <p className="text-xs leading-5 text-red-600">
                This permanently removes the lesson
                and its related learner progress records.
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
                  if (deletingLesson) return;

                  setDeleteError("");
                  setLessonToDelete(null);
                }}
                disabled={deletingLesson}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteLesson}
                disabled={deletingLesson}
                className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingLesson
                  ? "Deleting..."
                  : "Delete Lesson"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}