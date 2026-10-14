"use client";

import { instructorName, useCourseData } from "./CourseDataProvider";

export default function CourseStats() {
  const { courses, loading } = useCourseData();

  return (
    <section className="border-b border-slate-200 bg-white px-4 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 text-center md:grid-cols-4">
        <Stat
          value={loading ? "…" : courses.length.toLocaleString()}
          label="Available courses"
        />
        <Stat
          value={
            loading
              ? "…"
              : String(new Set(courses.map(instructorName)).size)
          }
          label="Instructors"
        />
        <Stat
          value="100%"
          label="Live catalog data"
        />
      </div>
    </section>
  );
}

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div>
      <p className="text-3xl font-black text-[#6c3bff]">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{label}</p>
    </div>
  );
}
