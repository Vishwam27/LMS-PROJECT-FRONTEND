"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Lesson = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  order: number;
  isPublished: boolean;
};

type CourseData = {
  id: string;
  title: string;
  lessons: Lesson[];
};

type CourseProgress = {
  courseId: string;

  enrollment: {
    id: string;
    status: string;
    enrolledAt: string;
    completedAt: string | null;
    lastAccessedAt: string | null;
  };

  summary: {
    completedLessons: number;
    totalLessons: number;
    percentage: number;
  };

  nextLesson: {
    lessonId: string;
    title: string;
    order: number;
    duration: number;
    completed: boolean;
    progressSeconds: number;
    completedAt: string | null;
    lastAccessedAt: string | null;
  } | null;
};

export default function LearnPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [course, setCourse] = useState<CourseData | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState(0);

  const [loading, setLoading] = useState(true);
  const [savingProgress, setSavingProgress] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH COURSE + RESUME PROGRESS
  // =========================================================

  useEffect(() => {
    if (!id) return;

    const fetchCourseData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          router.replace("/");
          return;
        }

        // Fetch lessons with JWT
        const lessonsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}/lessons`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // -----------------------------------------------
        // Handle lesson access errors
        // -----------------------------------------------

        if (lessonsResponse.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.replace("/");
          return;
        }

        if (lessonsResponse.status === 403) {
          setError(
            "You are not enrolled in this course."
          );
          return;
        }

        if (!lessonsResponse.ok) {
  const lessonsData = await lessonsResponse.json();

  if (lessonsResponse.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/");
    return;
  }

  if (lessonsResponse.status === 403) {
    setError(
      lessonsData.message ||
        "You are not enrolled in this course."
    );
    return;
  }

  throw new Error(
    lessonsData.message ||
      "Failed to load course lessons"
  );
}

        const courseData: CourseData =
          await lessonsResponse.json();

        const courseLessons =
          courseData.lessons || [];

        // -----------------------------------------------
        // Fetch learner progress
        // -----------------------------------------------

        const progressResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/enrollment/courses/${id}/progress`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (progressResponse.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.replace("/");
          return;
        }

        if (progressResponse.status === 403) {
          setError(
            "You are not enrolled in this course."
          );
          return;
        }

        if (!progressResponse.ok) {
          const progressData =
            await progressResponse.json();

          throw new Error(
            progressData.message ||
              "Unable to load course progress"
          );
        }

        const progressData: CourseProgress =
          await progressResponse.json();

        setCourse(courseData);
        setLessons(courseLessons);

        // -----------------------------------------------
        // RESUME LOGIC
        // -----------------------------------------------

        if (progressData.nextLesson) {
          const nextLessonIndex =
            courseLessons.findIndex(
              (lesson) =>
                lesson.id ===
                progressData.nextLesson?.lessonId
            );

          if (nextLessonIndex !== -1) {
            setCurrentLesson(nextLessonIndex);
          } else {
            setCurrentLesson(0);
          }
        } else {
          // Course already completed.
          // Open first lesson for review.
          setCurrentLesson(0);
        }
      } catch (error) {
        console.error(
          "Course loading error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load course."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id, router]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-purple-600" />

          <p className="mt-3 text-sm text-gray-500">
            Loading course...
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
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-red-500">{error}</p>

          <button
            onClick={() =>
              router.push("/learner/my-courses")
            }
            className="mt-4 rounded-lg bg-black px-5 py-2.5 text-sm text-white"
          >
            Back to My Courses
          </button>
        </div>
      </div>
    );
  }

  if (!course || lessons.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <p className="text-gray-500">
          No lessons available.
        </p>
      </div>
    );
  }

  const lesson = lessons[currentLesson];

  if (!lesson) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <p className="text-gray-500">
          Lesson not found.
        </p>
      </div>
    );
  }

  const isFirstLesson = currentLesson === 0;

  const isLastLesson =
    currentLesson === lessons.length - 1;

  // This is only the current lesson position.
  // Actual progress comes from My Courses / backend.
  const coursePosition = Math.round(
    ((currentLesson + 1) / lessons.length) * 100
  );

  // =========================================================
  // FORMAT DURATION
  // =========================================================

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (remainingSeconds === 0) {
      return `${minutes} min`;
    }

    return `${minutes} min ${remainingSeconds} sec`;
  };

  // =========================================================
  // COMPLETE CURRENT LESSON
  // =========================================================

  const completeCurrentLesson = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/");
      return false;
    }

    try {
      setSavingProgress(true);
      setError("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enrollment/lessons/${lesson.id}/progress`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            completed: true,
            progressSeconds: lesson.duration || 0,
          }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/");
        return false;
      }

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Progress update failed:",
          data.message
        );

        setError(
          data.message ||
            "Unable to save lesson progress."
        );

        return false;
      }

      return true;
    } catch (error) {
      console.error(
        "Lesson progress error:",
        error
      );

      setError(
        "Unable to save lesson progress."
      );

      return false;
    } finally {
      setSavingProgress(false);
    }
  };

  // =========================================================
  // NEXT LESSON / COMPLETE COURSE
  // =========================================================

  const goToNextLesson = async () => {
    const success =
      await completeCurrentLesson();

    if (!success) {
      return;
    }

    // Final lesson
    if (isLastLesson) {
      router.push("/learner/my-courses");
      return;
    }

    // Move to next lesson
    setCurrentLesson(
      (previous) => previous + 1
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // PREVIOUS LESSON
  // =========================================================

  const goToPreviousLesson = () => {
    if (isFirstLesson) return;

    setCurrentLesson(
      (previous) => previous - 1
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50">

      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}
      <aside className="fixed inset-y-0 left-0 hidden w-72 overflow-y-auto border-r border-gray-200 bg-white lg:block">

        <div className="border-b border-gray-200 px-6 py-6">
          <button
            onClick={() => router.back()}
            className="mb-5 text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            ← Back
          </button>

          <h1 className="text-lg font-bold leading-7 text-gray-900">
            {course.title}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {lessons.length} lessons
          </p>
        </div>

        {/* Lesson navigation */}
        <div className="p-4">
          {lessons.map((item, index) => {
            const isActive =
              index === currentLesson;

            return (
              <button
                key={item.id}
                onClick={() =>
                  setCurrentLesson(index)
                }
                className={`mb-2 w-full rounded-xl p-4 text-left transition ${
                  isActive
                    ? "bg-purple-50 text-purple-900"
                    : "text-gray-900 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-3">

                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                      isActive
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="wrap-break-word text-sm font-medium leading-5">
                      {item.title}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {formatDuration(
                        item.duration
                      )}
                    </p>
                  </div>

                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* =====================================================
          MAIN
      ====================================================== */}
      <main className="min-w-0 lg:ml-72">

        {/* TOP HEADER */}
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">

            {/* <button
              onClick={() => router.back()}
              className="mb-4 text-sm font-medium text-gray-500 transition hover:text-gray-900"
            >
              ← Back to course
            </button> */}

            <div className="flex items-start justify-between gap-4">

              <div className="min-w-0">
                <p className="text-sm text-gray-500">
                  Lesson {currentLesson + 1} of{" "}
                  {lessons.length}
                </p>

                <h2 className="mt-1 wrap-break-word text-xl font-bold leading-7 text-gray-900 sm:text-2xl">
                  {lesson.title}
                </h2>
              </div>

              <div className="hidden shrink-0 text-right sm:block">
                <p className="text-sm font-medium text-gray-600">
                  {coursePosition}% through course
                </p>

                <div className="mt-2 h-2 w-24 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-purple-600 transition-all duration-300"
                    style={{
                      width: `${coursePosition}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* MOBILE / TABLET NAVIGATION */}
        <div className="border-b border-gray-200 bg-white lg:hidden">
          <div className="px-4 py-3 sm:px-6">
            <div className="flex gap-2 overflow-x-auto pb-1">

              {lessons.map((item, index) => {
                const isActive =
                  index === currentLesson;

                return (
                  <button
                    key={item.id}
                    onClick={() =>
                      setCurrentLesson(index)
                    }
                    className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <span>{index + 1}.</span>

                    <span className="max-w-30 truncate">
                      {item.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* VIDEO */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-xl">

            {lesson.videoUrl ? (
              <video
                key={lesson.id}
                controls
                controlsList="nodownload"
                disablePictureInPicture
                className="h-full w-full object-contain"
              >
                <source
                  src={lesson.videoUrl}
                  type="video/mp4"
                />

                Your browser does not support video playback.
              </video>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                Streaming asset unavailable.
              </div>
            )}
          </div>

          {/* LESSON DESCRIPTION */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900">
              About this lesson
            </h3>

            <p className="mt-2 text-base leading-6 text-gray-600">
              {lesson.description ||
                "No description provided for this lesson."}
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* NAVIGATION */}
          <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">

            <button
              onClick={goToPreviousLesson}
              disabled={
                isFirstLesson ||
                savingProgress
              }
              className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ← Previous Lesson
            </button>

            <button
              onClick={goToNextLesson}
              disabled={savingProgress}
              className="w-full rounded-xl bg-purple-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {savingProgress
                ? "Saving..."
                : isLastLesson
                ? "Complete Course"
                : "Next Lesson →"}
            </button>

          </div>
        </div>
      </main>
    </div>
  );
}