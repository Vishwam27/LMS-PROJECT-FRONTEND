"use client";

import { CldImage } from "next-cloudinary";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../../../../components/learner/SideBar";

interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  price: string | number;
  level: string;
  duration: string;
  instructorId: string | null;
  categoryId: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EnrolledCourse {
  id: string;
  enrollment: {
    status: string;
  };
}

interface MyCoursesResponse {
  courses: EnrolledCourse[];
}

export default function CourseDetails() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const id = params?.id;

  const [course, setCourse] = useState<Course | null>(null);

  const [loading, setLoading] = useState(true);
  const [enrollmentLoading, setEnrollmentLoading] =
    useState(true);
  const [enrolling, setEnrolling] = useState(false);

  const [isEnrolled, setIsEnrolled] = useState(false);

  const [error, setError] = useState("");
  const [enrollmentError, setEnrollmentError] =
    useState("");

  // =========================================================
  // FETCH COURSE
  // =========================================================

  useEffect(() => {
    if (!id) return;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}`
        );

        if (!response.ok) {
          throw new Error("Course not found");
        }

        const data = await response.json();

        setCourse(data);
      } catch (error) {
        console.error("Course error:", error);
        setError("Unable to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // =========================================================
  // CHECK WHETHER CURRENT USER IS ALREADY ENROLLED
  // =========================================================

  useEffect(() => {
    if (!id) return;

    const checkEnrollment = async () => {
      try {
        setEnrollmentLoading(true);

        const token = localStorage.getItem("token");

        // Not logged in
        if (!token) {
          setIsEnrolled(false);
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

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }

          return;
        }

        const data: MyCoursesResponse =
          await response.json();

        const enrolled = data.courses?.some(
          (item) => item.id === id
        );

        setIsEnrolled(Boolean(enrolled));
      } catch (error) {
        console.error(
          "Enrollment check error:",
          error
        );
      } finally {
        setEnrollmentLoading(false);
      }
    };

    checkEnrollment();
  }, [id]);

  // =========================================================
  // ENROLL
  // =========================================================

  const handleEnroll = async () => {
    if (!course) return;

    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/");
      return;
    }

    try {
      setEnrolling(true);
      setEnrollmentError("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enrollment/${course.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      // Already enrolled
      if (response.status === 409) {
        setIsEnrolled(true);
        router.push("/learner/my-courses");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to enroll in course"
        );
      }

      // Enrollment created successfully
      setIsEnrolled(true);

      // Send learner to My Courses
      router.push("/learner/my-courses");
    } catch (error) {
      console.error("Enrollment error:", error);

      setEnrollmentError(
        error instanceof Error
          ? error.message
          : "Unable to enroll in course"
      );
    } finally {
      setEnrolling(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          Loading course...
        </p>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error || !course) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-semibold">
          Course not found
        </h1>

        <button
          onClick={() => router.back()}
          className="rounded-lg bg-black px-5 py-2.5 text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen flex-col overflow-hidden lg:flex-row"
      style={{
        background: "#f1f5f9",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50">

          {/* =====================================================
              HERO
          ====================================================== */}
          <section className="bg-white">
            <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

              {/* Back */}
              <button
                onClick={() => router.back()}
                className="mb-8 text-sm font-medium text-gray-500 transition hover:text-gray-900"
              >
                ← Back to courses
              </button>

              <div className="grid gap-10 lg:grid-cols-3">

                {/* Course information */}
                <div className="lg:col-span-2">

                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
                      {course.level}
                    </span>

                    {course.isPublished && (
                      <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-600">
                        Published
                      </span>
                    )}
                  </div>

                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 lg:text-5xl">
                    {course.title}
                  </h1>

                  <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600">
                    {course.description}
                  </p>

                  <div className="mt-8 flex flex-wrap gap-8 text-sm text-gray-600">

                    <div>
                      <p className="font-semibold text-gray-900">
                        Level
                      </p>
                      <p>{course.level}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900">
                        Duration
                      </p>
                      <p>{course.duration}</p>
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900">
                        Course ID
                      </p>
                      <p className="max-w-55 truncate">
                        {course.id}
                      </p>
                    </div>

                  </div>
                </div>

                {/* =================================================
                    ENROLLMENT CARD
                ================================================== */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                  {/* Image */}
                  <div className="mb-6 aspect-video overflow-hidden rounded-xl bg-gray-100">

                    {course.imageUrl ? (
                      <CldImage
                        src={course.imageUrl}
                        alt={course.title}
                        height={640}
                        width={640}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}

                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-500">
                      Course price
                    </p>

                    <p className="mt-1 text-3xl font-bold text-gray-900">
                      ${course.price}
                    </p>
                  </div>

                  {/* Button */}
                  {enrollmentLoading ? (
                    <button
                      disabled
                      className="w-full cursor-not-allowed rounded-xl bg-gray-200 px-5 py-3 font-semibold text-gray-500"
                    >
                      Checking enrollment...
                    </button>
                  ) : isEnrolled ? (
                    <button
                      onClick={() =>
                        router.push(
                          `/learner/courses/${course.id}/learn`
                        )
                      }
                      className="w-full rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700"
                    >
                      Continue Learning
                    </button>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {enrolling
                        ? "Enrolling..."
                        : "Enroll Now"}
                    </button>
                  )}

                  {/* Description */}
                  <p className="mt-4 text-center text-xs text-gray-500">
                    {isEnrolled
                      ? "You are already enrolled in this course."
                      : "You can start learning after enrollment."}
                  </p>

                  {/* Enrollment error */}
                  {enrollmentError && (
                    <p className="mt-3 text-center text-sm text-red-500">
                      {enrollmentError}
                    </p>
                  )}

                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              COURSE DETAILS
          ====================================================== */}
          <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
            <div className="rounded-2xl bg-white p-8 shadow-sm">

              <h2 className="text-2xl font-bold text-gray-900">
                About this course
              </h2>

              <p className="mt-4 max-w-4xl leading-7 text-gray-600">
                {course.description}
              </p>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                {/* Level */}
                <div className="rounded-xl bg-gray-50 p-5">
                  <p className="text-sm text-gray-500">
                    Level
                  </p>

                  <p className="mt-2 font-semibold text-gray-900">
                    {course.level}
                  </p>
                </div>

                {/* Duration */}
                <div className="rounded-xl bg-gray-50 p-5">
                  <p className="text-sm text-gray-500">
                    Duration
                  </p>

                  <p className="mt-2 font-semibold text-gray-900">
                    {course.duration}
                  </p>
                </div>

                {/* Price */}
                <div className="rounded-xl bg-gray-50 p-5">
                  <p className="text-sm text-gray-500">
                    Price
                  </p>

                  <p className="mt-2 font-semibold text-gray-900">
                    ${course.price}
                  </p>
                </div>

                {/* Status */}
                <div className="rounded-xl bg-gray-50 p-5">
                  <p className="text-sm text-gray-500">
                    Status
                  </p>

                  <p className="mt-2 font-semibold text-gray-900">
                    {course.isPublished
                      ? "Published"
                      : "Draft"}
                  </p>
                </div>

              </div>
            </div>
          </section>

          {/* Bottom spacing */}
          <div className="h-10" />
        </div>
      </main>
    </div>
  );
}