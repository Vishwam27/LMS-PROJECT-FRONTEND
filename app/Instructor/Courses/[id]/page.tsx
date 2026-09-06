"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";

type Category = {
  id: string;
  name: string;
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
  instructorId: string;
  categoryId: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;

  category: Category | null;

  lessons: Lesson[];

  _count: {
    lessons: number;
    enrollments: number;
  };
};

type CourseResponse = {
  course: Course;
};

type CategoryResponse = {
  categories: Category[];
};

export default function InstructorCourseDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const courseId = params?.id;

  const [course, setCourse] = useState<Course | null>(
    null
  );

  const [categories, setCategories] = useState<
    Category[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [actionError, setActionError] =
    useState("");

  // =========================================================
  // COURSE EDIT
  // =========================================================

  const [editingCourse, setEditingCourse] =
    useState(false);

  const [savingCourse, setSavingCourse] =
    useState(false);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] =
    useState("");
  const [editImageUrl, setEditImageUrl] =
    useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editLevel, setEditLevel] = useState("");
  const [editDuration, setEditDuration] =
    useState("");
  const [editCategoryId, setEditCategoryId] =
    useState("");

  // =========================================================
  // COURSE DELETE
  // =========================================================

  const [
    showCourseDeleteModal,
    setShowCourseDeleteModal,
  ] = useState(false);

  const [deletingCourse, setDeletingCourse] =
    useState(false);

  // =========================================================
  // LESSON DELETE
  // =========================================================

  const [lessonToDelete, setLessonToDelete] =
    useState<Lesson | null>(null);

  const [
    showFinalLessonWarning,
    setShowFinalLessonWarning,
  ] = useState(false);

  const [deletingLesson, setDeletingLesson] =
    useState(false);

  // =========================================================
  // FETCH COURSE
  // =========================================================

  const fetchCourse = async () => {
    if (!courseId) return;

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

      let currentUser;

      try {
        currentUser = JSON.parse(storedUser);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/");
        return;
      }

      if (
        currentUser.role !== "INSTRUCTOR" ||
        currentUser.status !== "APPROVED"
      ) {
        setError(
          "Your instructor account is not approved."
        );
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/instructor/courses/${courseId}`,
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
          "You do not have permission to access this course."
        );
        return;
      }

      if (response.status === 404) {
        setError(
          "Course not found or you do not have access to this course."
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
        "Instructor course details error:",
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

  // =========================================================
  // FETCH CATEGORIES
  // =========================================================

  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories`
      );

      if (!response.ok) {
        throw new Error(
          "Unable to load categories"
        );
      }

      const data: CategoryResponse =
        await response.json();

      setCategories(data.categories);
    } catch (error) {
      console.error(
        "Category loading error:",
        error
      );

      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to load categories"
      );
    } finally {
      setCategoryLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

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
  // LESSON DURATION
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
  // START COURSE EDIT
  // =========================================================

  const startEditingCourse = () => {
    if (!course) return;

    setEditTitle(course.title);
    setEditDescription(course.description);
    setEditImageUrl(course.imageUrl || "");
    setEditPrice(String(course.price));
    setEditLevel(course.level);
    setEditDuration(course.duration);
    setEditCategoryId(course.categoryId);

    setActionError("");
    setEditingCourse(true);

    fetchCategories();
  };

  // =========================================================
  // SAVE COURSE
  // =========================================================

  const handleSaveCourse = async () => {
    if (!course) return;

    try {
      setSavingCourse(true);
      setActionError("");

      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/");
        return;
      }

      if (
        !editTitle.trim() ||
        !editDescription.trim() ||
        !editPrice ||
        !editLevel.trim() ||
        !editDuration.trim() ||
        !editCategoryId
      ) {
        setActionError(
          "Please fill in all required fields."
        );
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/instructor/courses/${course.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: editTitle.trim(),
            description: editDescription.trim(),
            imageUrl:
              editImageUrl.trim() || null,
            price: Number(editPrice),
            level: editLevel.trim(),
            duration: editDuration.trim(),
            categoryId: editCategoryId,
          }),
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
        setActionError(
          "You do not have permission to update this course."
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update course"
        );
      }

      setCourse((currentCourse) => {
        if (!currentCourse) {
          return currentCourse;
        }

        return {
          ...currentCourse,
          title: data.course.title,
          description:
            data.course.description,
          imageUrl: data.course.imageUrl,
          price: data.course.price,
          level: data.course.level,
          duration: data.course.duration,
          categoryId:
            data.course.categoryId,
          category:
            data.course.category ??
            currentCourse.category,
          updatedAt:
            data.course.updatedAt ??
            currentCourse.updatedAt,
        };
      });

      setEditingCourse(false);
    } catch (error) {
      console.error(
        "Update course error:",
        error
      );

      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to update course"
      );
    } finally {
      setSavingCourse(false);
    }
  };

  // =========================================================
  // DELETE COURSE
  // =========================================================

  const handleDeleteCourse = async () => {
    if (!course) return;

    try {
      setDeletingCourse(true);
      setActionError("");

      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/instructor/courses/${course.id}`,
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

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete course"
        );
      }

      router.replace("/Instructor/Courses");
    } catch (error) {
      console.error(
        "Delete course error:",
        error
      );

      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to delete course"
      );

      setDeletingCourse(false);
    }
  };

  // =========================================================
  // OPEN LESSON DELETE
  // =========================================================

  const handleDeleteLessonClick = (
    lesson: Lesson
  ) => {
    setActionError("");
    setLessonToDelete(lesson);
    setShowFinalLessonWarning(false);
  };

  // =========================================================
  // DELETE LESSON
  // =========================================================

  const handleDeleteLesson = async () => {
    if (!lessonToDelete || !course) {
      return;
    }

    try {
      setDeletingLesson(true);
      setActionError("");

      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/instructor/lessons/${lessonToDelete.id}`,
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
        setActionError(
          "You do not have permission to delete this lesson."
        );
        return;
      }

      if (response.status === 404) {
        setActionError(
          "Lesson not found or you do not have access to it."
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete lesson"
        );
      }

      setCourse((currentCourse) => {
        if (!currentCourse) {
          return currentCourse;
        }

        const remainingLessons =
          currentCourse.lessons.filter(
            (lesson) =>
              lesson.id !== lessonToDelete.id
          );

        return {
          ...currentCourse,
          lessons: remainingLessons,
          _count: {
            ...currentCourse._count,
            lessons: Math.max(
              0,
              currentCourse._count.lessons - 1
            ),
          },
        };
      });

      setLessonToDelete(null);
      setShowFinalLessonWarning(false);
    } catch (error) {
      console.error(
        "Delete lesson error:",
        error
      );

      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to delete lesson"
      );
    } finally {
      setDeletingLesson(false);
    }
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
            onClick={() =>
              router.push(
                "/Instructor/Courses"
              )
            }
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
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <div>
            <button
              onClick={() =>
                router.push(
                  "/Instructor/Courses"
                )
              }
              className="mb-2 text-xs font-semibold text-[#6c3bff]"
            >
              ← Back to My Courses
            </button>

            <h1
              className="text-2xl font-bold text-[#0f1428] sm:text-3xl"
              style={{
                fontFamily: "Outfit, sans-serif",
              }}
            >
              Course Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your course and lessons.
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
        {/* =================================================
            COURSE DETAILS
        ================================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid lg:grid-cols-[280px_1fr]">
            <div className="relative min-h-56 bg-slate-100 lg:min-h-full">
              {course.imageUrl ? (
                <CldImage
                  src={course.imageUrl}
                  alt={course.title}
                  fill
                  crop="fill"
                  loading="eager"
                  gravity="auto"
                  className="object-cover"
                  sizes="280px"
                />
              ) : (
                <div className="flex h-full min-h-56 items-center justify-center text-sm text-slate-400">
                  No course image
                </div>
              )}
            </div>

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

              <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[11px] text-slate-400">
                    Price
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#0f1428]">
                    ${course.price}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[11px] text-slate-400">
                    Duration
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#0f1428]">
                    {course.duration}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[11px] text-slate-400">
                    Lessons
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#0f1428]">
                    {course._count.lessons}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[11px] text-slate-400">
                    Students
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#0f1428]">
                    {course._count.enrollments}
                  </p>
                </div>
              </div>

              {/* Course actions — no publish/unpublish */}

              <div className="mt-7 flex flex-wrap gap-3 border-t border-slate-100 pt-6">
                <button
                  onClick={startEditingCourse}
                  className="rounded-xl bg-[#6c3bff] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#5d32e8]"
                >
                  Edit Course
                </button>

                <button
                  onClick={() => {
                    setActionError("");
                    setShowCourseDeleteModal(true);
                  }}
                  className="rounded-xl border border-red-200 px-4 py-2.5 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                >
                  Delete Course
                </button>
              </div>

              {actionError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-600">
                  {actionError}
                </div>
              )}

              <p className="mt-3 text-[11px] text-slate-400">
                Created {formatDate(course.createdAt)}
                {" • "}
                Updated {formatDate(course.updatedAt)}
              </p>
            </div>
          </div>
        </section>

        {/* =================================================
            COURSE CONTENT
        ================================================== */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
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
                  : "lessons"}
              </p>
            </div>

            <button
              onClick={() =>
                router.push(
                  `/Instructor/Courses/${course.id}/Lessons/Create`
                )
              }
              className="rounded-xl bg-[#6c3bff] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#5d32e8]"
            >
              + Add Lesson
            </button>
          </div>

          {course.lessons.length === 0 ? (
            <div className="px-6 py-14 text-center sm:px-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-xl">
                📚
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-700">
                No lessons yet
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Add your first lesson to build your
                course content.
              </p>

              <button
                onClick={() =>
                  router.push(
                    `/Instructor/Courses/${course.id}/Lessons/Create`
                  )
                }
                className="mt-5 rounded-xl bg-[#6c3bff] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#5d32e8]"
              >
                + Add First Lesson
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {course.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="px-6 py-5 sm:px-8"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-sm font-bold text-[#6c3bff]">
                        {lesson.order}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-[#0f1428]">
                            {lesson.title}
                          </h3>

                          <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-600">
                            Published
                          </span>
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
                      </div>
                    </div>

                    {/* Delete only */}

                    <div className="flex shrink-0 justify-end">
                      <button
                        onClick={() =>
                          handleDeleteLessonClick(
                            lesson
                          )
                        }
                        className="rounded-xl border border-red-200 px-3.5 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* =====================================================
          EDIT COURSE MODAL
      ====================================================== */}

      {editingCourse && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 px-4 py-8">
          <div className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  className="text-xl font-bold text-[#0f1428]"
                  style={{
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  Edit Course
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update your course information.
                </p>
              </div>

              <button
                onClick={() => {
                  if (!savingCourse) {
                    setEditingCourse(false);
                    setActionError("");
                  }
                }}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Course Title
                </label>

                <input
                  type="text"
                  value={editTitle}
                  onChange={(event) =>
                    setEditTitle(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0f1428] outline-none focus:border-[#6c3bff]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Description
                </label>

                <textarea
                  rows={4}
                  value={editDescription}
                  onChange={(event) =>
                    setEditDescription(
                      event.target.value
                    )
                  }
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0f1428] outline-none focus:border-[#6c3bff]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Cloudinary Image Public ID
                </label>

                <input
                  type="text"
                  value={editImageUrl}
                  onChange={(event) =>
                    setEditImageUrl(
                      event.target.value
                    )
                  }
                  placeholder="course-image-public-id"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0f1428] outline-none focus:border-[#6c3bff]"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editPrice}
                    onChange={(event) =>
                      setEditPrice(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0f1428] outline-none focus:border-[#6c3bff]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Level
                  </label>

                  <input
                    type="text"
                    value={editLevel}
                    onChange={(event) =>
                      setEditLevel(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0f1428] outline-none focus:border-[#6c3bff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Duration
                  </label>

                  <input
                    type="text"
                    value={editDuration}
                    onChange={(event) =>
                      setEditDuration(
                        event.target.value
                      )
                    }
                    placeholder="10h"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0f1428] outline-none focus:border-[#6c3bff]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Category
                  </label>

                  {categoryLoading ? (
                    <div className="flex h-11.5 items-center rounded-xl border border-slate-200 px-4 text-xs text-slate-400">
                      Loading categories...
                    </div>
                  ) : (
                    <select
                      value={editCategoryId}
                      onChange={(event) =>
                        setEditCategoryId(
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0f1428] outline-none focus:border-[#6c3bff]"
                    >
                      <option value="">
                        Select category
                      </option>

                      {categories.map(
                        (category) => (
                          <option
                            key={category.id}
                            value={category.id}
                          >
                            {category.name}
                          </option>
                        )
                      )}
                    </select>
                  )}
                </div>
              </div>
            </div>

            {actionError && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-600">
                {actionError}
              </div>
            )}

            <div className="mt-7 flex justify-end gap-3">
              <button
                onClick={() => {
                  if (savingCourse) return;

                  setEditingCourse(false);
                  setActionError("");
                }}
                disabled={savingCourse}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveCourse}
                disabled={savingCourse}
                className="rounded-xl bg-[#6c3bff] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5d32e8] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingCourse
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          DELETE COURSE MODAL
      ====================================================== */}

      {showCourseDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl">
              ⚠️
            </div>

            <h2
              className="mt-5 text-lg font-bold text-[#0f1428]"
              style={{
                fontFamily: "Outfit, sans-serif",
              }}
            >
              Delete Course
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-800">
                "{course.title}"
              </span>
              ?
            </p>

            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
              <p className="text-xs leading-5 text-red-600">
                This will permanently delete the
                course, its lessons, enrollments,
                and related progress records.
              </p>
            </div>

            {actionError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
                {actionError}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  if (deletingCourse) return;

                  setShowCourseDeleteModal(false);
                  setActionError("");
                }}
                disabled={deletingCourse}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteCourse}
                disabled={deletingCourse}
                className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingCourse
                  ? "Deleting..."
                  : "Delete Course"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          FIRST LESSON DELETE WARNING
      ====================================================== */}

      {lessonToDelete &&
        !showFinalLessonWarning && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-xl">
                ⚠️
              </div>

              <h2
                className="mt-5 text-lg font-bold text-[#0f1428]"
                style={{
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                Delete Lesson?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                You selected{" "}
                <span className="font-semibold text-slate-800">
                  "{lessonToDelete.title}"
                </span>
                .
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Are you sure you want to continue?
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    if (deletingLesson) return;

                    setLessonToDelete(null);
                    setShowFinalLessonWarning(false);
                  }}
                  disabled={deletingLesson}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={() =>
                    setShowFinalLessonWarning(true)
                  }
                  disabled={deletingLesson}
                  className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

      {/* =====================================================
          FINAL LESSON DELETE WARNING
      ====================================================== */}

      {lessonToDelete &&
        showFinalLessonWarning && (
          <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-6 shadow-2xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl">
                🛑
              </div>

              <h2
                className="mt-5 text-lg font-bold text-[#0f1428]"
                style={{
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                Final Warning
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                You are about to permanently delete:
              </p>

              <p className="mt-2 text-base font-bold text-red-600">
                "{lessonToDelete.title}"
              </p>

              <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                <p className="text-xs leading-5 text-red-600">
                  This action cannot be undone. The
                  lesson and all learner progress
                  associated with this lesson will be
                  permanently deleted.
                </p>
              </div>

              {actionError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-600">
                  {actionError}
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (deletingLesson) return;

                    setLessonToDelete(null);
                    setShowFinalLessonWarning(false);
                    setActionError("");
                  }}
                  disabled={deletingLesson}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDeleteLesson}
                  disabled={deletingLesson}
                  className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deletingLesson
                    ? "Deleting..."
                    : "Delete Permanently"}
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}