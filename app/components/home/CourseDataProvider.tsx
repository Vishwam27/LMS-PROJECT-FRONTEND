"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Category = {
  id: string;
  name: string;
};

type Instructor = {
  id: string;
  name: string;
};

type Course = {
  id: string;
  title: string;
  imageUrl: string | null;
  price: string | number;
  level: string;
  duration: string;
  category: Category | null;
  instructor: Instructor | null;
  rating?: string | number | null;
  _count?: {
    enrollments?: number;
  };
};

type CourseData = {
  courses: Course[];
  loading: boolean;
  error: string;
};

const CourseDataContext = createContext<CourseData | null>(null);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function categoryName(course: Course) {
  return course.category?.name ?? "Course";
}

export function instructorName(course: Course) {
  return course.instructor?.name ?? "CourseMaster Instructor";
}

export function enrolledCount(course: Course) {
  return Number(course._count?.enrollments ?? 0);
}

export function priceLabel(price: Course["price"]) {
  const value = Number(price);
  if (!Number.isFinite(value) || value === 0) {
    return "Free";
  }
  return `$${value.toFixed(2)}`;
}

export function useCourseData() {
  const context = useContext(CourseDataContext);
  if (!context) {
    throw new Error("useCourseData must be used within CourseDataProvider");
  }
  return context;
}

export default function CourseDataProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`, {
          method: "GET",
        });
        const payload: unknown = await response.json();
        if (!response.ok) {
          const message =
            isRecord(payload) && typeof payload.message === "string"
              ? payload.message
              : `Unable to load courses (${response.status})`;
          throw new Error(message);
        }
        const liveCourses: Course[] = Array.isArray(payload)
          ? (payload as Course[])
          : isRecord(payload) && Array.isArray(payload.courses)
            ? (payload.courses as Course[])
            : isRecord(payload) && Array.isArray(payload.data)
              ? (payload.data as Course[])
              : isRecord(payload) &&
                isRecord(payload.data) &&
                Array.isArray(payload.data.courses)
                ? (payload.data.courses as Course[])
                : [];
        setCourses(liveCourses);
      } catch (err) {
        console.error("Homepage course loading error:", err);
        setCourses([]);
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load the course catalog.",
        );
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);
  return (
    <CourseDataContext.Provider value={{ courses, loading, error }}>
      {children}
    </CourseDataContext.Provider>
  );
}
