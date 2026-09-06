"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
};

type CategoryResponse = {
  categories: Category[];
};

export default function CreateCoursePage() {
  const router = useRouter();

  // =========================================================
  // FORM
  // =========================================================

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");
  const [level, setLevel] = useState("");
  const [duration, setDuration] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // =========================================================
  // CATEGORIES
  // =========================================================

  const [categories, setCategories] = useState<
    Category[]
  >([]);

  const [loadingCategories, setLoadingCategories] =
    useState(true);

  // =========================================================
  // PAGE STATE
  // =========================================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================================
  // LOAD CATEGORIES + VERIFY INSTRUCTOR
  // =========================================================

  useEffect(() => {
    const initializePage = async () => {
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

        // Load categories
        setLoadingCategories(true);

        const categoryResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories`
        );

        const categoryData: CategoryResponse & {
          message?: string;
        } = await categoryResponse.json();

        if (!categoryResponse.ok) {
          throw new Error(
            categoryData.message ||
              "Unable to load categories"
          );
        }

        setCategories(categoryData.categories);
      } catch (error) {
        console.error(
          "Create course initialization error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load page"
        );
      } finally {
        setLoadingCategories(false);
        setLoading(false);
      }
    };

    initializePage();
  }, [router]);

  // =========================================================
  // CREATE COURSE
  // =========================================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Basic validation
    if (!title.trim()) {
      setError("Course title is required.");
      return;
    }

    if (!description.trim()) {
      setError(
        "Course description is required."
      );
      return;
    }

    if (!price) {
      setError("Course price is required.");
      return;
    }

    const numericPrice = Number(price);

    if (
      Number.isNaN(numericPrice) ||
      numericPrice < 0
    ) {
      setError(
        "Price must be a valid non-negative number."
      );
      return;
    }

    if (!level) {
      setError("Please select a course level.");
      return;
    }

    if (!duration.trim()) {
      setError("Course duration is required.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/instructor/courses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            imageUrl:
              imageUrl.trim() || null,
            price: numericPrice,
            level,
            duration: duration.trim(),
            categoryId,
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
          "You do not have permission to create a course."
        );
        return;
      }

      if (response.status === 404) {
        setError(
          data.message ||
            "Selected category was not found."
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to create course"
        );
      }

      setSuccess(
        "Course created successfully."
      );

      // Redirect to instructor courses after creation
      setTimeout(() => {
        router.replace("/Instructor/Courses");
      }, 700);
    } catch (error) {
      console.error(
        "Create course error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to create course"
      );
    } finally {
      setSaving(false);
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
            Loading course creation...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

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
        <div className="mx-auto max-w-4xl px-5 py-5 lg:px-8">
          <button
            type="button"
            onClick={() =>
              router.push("/Instructor/Courses")
            }
            className="text-xs font-semibold text-[#6c3bff]"
          >
            ← Back to My Courses
          </button>

          <h1
            className="mt-3 text-2xl font-bold text-[#0f1428] sm:text-3xl"
            style={{
              fontFamily: "Outfit, sans-serif",
            }}
          >
            Create New Course
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Create a course and start adding lessons.
          </p>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto max-w-4xl px-5 py-6 lg:px-8 lg:py-8">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          {/* =================================================
              COURSE INFORMATION
          ================================================== */}

          <div>
            <h2
              className="text-lg font-bold text-[#0f1428]"
              style={{
                fontFamily: "Outfit, sans-serif",
              }}
            >
              Course Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add the basic information for your course.
            </p>
          </div>

          {/* Title */}

          <div className="mt-6">
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Course Title
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="e.g. Full Stack Web Development"
              disabled={saving}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0f1428] outline-none transition focus:border-[#6c3bff] focus:ring-4 focus:ring-purple-100 disabled:bg-slate-50"
            />
          </div>

          {/* Description */}

          <div className="mt-5">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Description
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
              placeholder="Describe what students will learn in this course..."
              disabled={saving}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0f1428] outline-none transition focus:border-[#6c3bff] focus:ring-4 focus:ring-purple-100 disabled:bg-slate-50"
            />
          </div>

          {/* Image */}

          <div className="mt-5">
            <label
              htmlFor="imageUrl"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Cloudinary Image Public ID
              <span className="ml-1 font-normal text-slate-400">
                (optional)
              </span>
            </label>

            <input
              id="imageUrl"
              type="text"
              value={imageUrl}
              onChange={(event) =>
                setImageUrl(
                  event.target.value
                )
              }
              placeholder="course-image-public-id"
              disabled={saving}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0f1428] outline-none transition focus:border-[#6c3bff] focus:ring-4 focus:ring-purple-100 disabled:bg-slate-50"
            />

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Enter the Cloudinary public ID for the
              course image.
            </p>
          </div>

          {/* =================================================
              COURSE DETAILS
          ================================================== */}

          <div className="mt-8 border-t border-slate-100 pt-7">
            <h2
              className="text-lg font-bold text-[#0f1428]"
              style={{
                fontFamily: "Outfit, sans-serif",
              }}
            >
              Course Details
            </h2>
          </div>

          {/* Price + Level */}

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Price
              </label>

              <input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(event) =>
                  setPrice(event.target.value)
                }
                placeholder="1499"
                disabled={saving}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0f1428] outline-none transition focus:border-[#6c3bff] focus:ring-4 focus:ring-purple-100 disabled:bg-slate-50"
              />
            </div>

            <div>
              <label
                htmlFor="level"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Level
              </label>

              <select
                id="level"
                value={level}
                onChange={(event) =>
                  setLevel(event.target.value)
                }
                disabled={saving}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0f1428] outline-none transition focus:border-[#6c3bff] focus:ring-4 focus:ring-purple-100 disabled:bg-slate-50"
              >
                <option value="">
                  Select level
                </option>

                <option value="Beginner">
                  Beginner
                </option>

                <option value="Intermediate">
                  Intermediate
                </option>

                <option value="Advanced">
                  Advanced
                </option>
              </select>
            </div>
          </div>

          {/* Duration + Category */}

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="duration"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Duration
              </label>

              <input
                id="duration"
                type="text"
                value={duration}
                onChange={(event) =>
                  setDuration(
                    event.target.value
                  )
                }
                placeholder="12h"
                disabled={saving}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0f1428] outline-none transition focus:border-[#6c3bff] focus:ring-4 focus:ring-purple-100 disabled:bg-slate-50"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Category
              </label>

              {loadingCategories ? (
                <div className="flex h-11.5 items-center rounded-xl border border-slate-200 px-4 text-sm text-slate-400">
                  Loading categories...
                </div>
              ) : (
                <select
                  id="category"
                  value={categoryId}
                  onChange={(event) =>
                    setCategoryId(
                      event.target.value
                    )
                  }
                  disabled={saving}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0f1428] outline-none transition focus:border-[#6c3bff] focus:ring-4 focus:ring-purple-100 disabled:bg-slate-50"
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

          {/* =================================================
              PUBLISH INFORMATION
          ================================================== */}

          <div className="mt-7 rounded-xl border border-green-100 bg-green-50 px-4 py-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm text-green-700">
                ✓
              </div>

              <div>
                <p className="text-sm font-semibold text-green-700">
                  Course will be published
                </p>

                <p className="mt-1 text-xs leading-5 text-green-600">
                  Your course will be created as published.
                  You can immediately add lessons from the
                  course management page.
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              ERROR
          ================================================== */}

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">
              {error}
            </div>
          )}

          {/* =================================================
              SUCCESS
          ================================================== */}

          {success && (
            <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-5 text-green-600">
              {success}
            </div>
          )}

          {/* =================================================
              ACTIONS
          ================================================== */}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() =>
                router.push(
                  "/Instructor/Courses"
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
                ? "Creating Course..."
                : "Create Course"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}