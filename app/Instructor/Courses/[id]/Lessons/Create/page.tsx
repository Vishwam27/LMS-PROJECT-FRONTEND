"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Course = {
  id: string;
  title: string;
};

type CourseResponse = {
  course: Course;
};

export default function CreateLessonPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const courseId =
    typeof params?.id === "string"
      ? params.id
      : "";

  const [course, setCourse] =
    useState<Course | null>(null);

  const [loadingCourse, setLoadingCourse] =
    useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] =
    useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD COURSE
  // =========================================================

  useEffect(() => {
    if (!courseId) {
      setError("Course ID is missing.");
      setLoadingCourse(false);
      return;
    }

    const fetchCourse = async () => {
      try {
        setLoadingCourse(true);
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

        const data: CourseResponse & {
          message?: string;
        } = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load course"
          );
        }

        setCourse(data.course);
      } catch (error) {
        console.error(
          "Create lesson course error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load course"
        );
      } finally {
        setLoadingCourse(false);
      }
    };

    fetchCourse();
  }, [courseId, router]);

  // =========================================================
  // CREATE LESSON
  // =========================================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Lesson title is required.");
      return;
    }

    if (!videoUrl.trim()) {
      setError("Video URL is required.");
      return;
    }

    if (
      duration !== "" &&
      (Number.isNaN(Number(duration)) ||
        Number(duration) < 0)
    ) {
      setError(
        "Duration must be a valid non-negative number."
      );
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/instructor/courses/${courseId}/lessons`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title.trim(),
            description:
              description.trim() || null,
            videoUrl: videoUrl.trim(),
            duration:
              duration === ""
                ? null
                : Number(duration),
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
        setError(
          "You do not have permission to create a lesson in this course."
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to create lesson"
        );
      }

      router.replace(
        `/Instructor/Courses/${courseId}`
      );
    } catch (error) {
      console.error(
        "Create lesson error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to create lesson"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loadingCourse) {
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

  if (error && !course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl">
            ⚠️
          </div>

          <h1 className="mt-5 text-xl font-bold text-[#0f1428]">
            Unable to Load Course
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error}
          </p>

          <button
            onClick={() =>
              router.replace(
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

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-5 py-5 lg:px-8">
          <button
            type="button"
            onClick={() =>
              router.push(
                `/Instructor/Courses/${courseId}`
              )
            }
            className="text-xs font-semibold text-[#6c3bff]"
          >
            ← Back to Course
          </button>

          <h1
            className="mt-3 text-2xl font-bold text-[#0f1428] sm:text-3xl"
            style={{
              fontFamily: "Outfit, sans-serif",
            }}
          >
            Add Lesson
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Add a new lesson to{" "}
            <span className="font-semibold text-slate-700">
              {course?.title}
            </span>
            .
          </p>
        </div>
      </header>

      {/* Form */}

      <main className="mx-auto max-w-4xl px-5 py-6 lg:px-8 lg:py-8">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          {/* Published status */}

          <div className="mb-6 flex items-center justify-between rounded-xl border border-green-100 bg-green-50 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-green-700">
                Lesson will be published
              </p>

              <p className="mt-1 text-xs text-green-600">
                New lessons are immediately available
                when the course is published.
              </p>
            </div>

            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Published
            </span>
          </div>

          {/* Title */}

          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Lesson Title
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="e.g. Introduction to React"
              disabled={saving}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0f1428] outline-none transition focus:border-[#6c3bff] focus:ring-4 focus:ring-purple-100"
            />
          </div>

          {/* Description */}

          <div className="mt-5">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Description
              <span className="ml-1 font-normal text-slate-400">
                (optional)
              </span>
            </label>

            <textarea
              id="description"
              rows={5}
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder="Describe what students will learn in this lesson..."
              disabled={saving}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0f1428] outline-none transition focus:border-[#6c3bff] focus:ring-4 focus:ring-purple-100"
            />
          </div>

          {/* Video URL */}

          <div className="mt-5">
            <label
              htmlFor="videoUrl"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Video URL
            </label>

            <input
              id="videoUrl"
              type="text"
              value={videoUrl}
              onChange={(event) =>
                setVideoUrl(event.target.value)
              }
              placeholder="Cloudinary video public ID or URL"
              disabled={saving}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0f1428] outline-none transition focus:border-[#6c3bff] focus:ring-4 focus:ring-purple-100"
            />

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Add the Cloudinary video reference used
              by your lesson player.
            </p>
          </div>

          {/* Duration */}

          <div className="mt-5">
            <label
              htmlFor="duration"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Duration
              <span className="ml-1 font-normal text-slate-400">
                (seconds)
              </span>
            </label>

            <input
              id="duration"
              type="number"
              min="0"
              step="1"
              value={duration}
              onChange={(event) =>
                setDuration(event.target.value)
              }
              placeholder="900"
              disabled={saving}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0f1428] outline-none transition focus:border-[#6c3bff] focus:ring-4 focus:ring-purple-100"
            />

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Example: 900 seconds = 15 minutes.
            </p>
          </div>

          {/* Error */}

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">
              {error}
            </div>
          )}

          {/* Actions */}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/Instructor/Courses/${courseId}`
                )
              }
              disabled={saving}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#6c3bff] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5d32e8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Publishing Lesson..."
                : "Create & Publish Lesson"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}