"use client";

import { CldImage } from "next-cloudinary";
import { categoryName, enrolledCount, useCourseData } from "./CourseDataProvider";
import { BookMiniIcon } from "./HomeIcons";

export default function CoursePreview() {
  const { courses, loading, error } = useCourseData();

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="absolute -inset-10 rounded-[48px] bg-violet-200/60 blur-3xl" />
      <div className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white p-3 shadow-[0_30px_80px_rgba(15,20,40,0.14)]">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-auto text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400">
            CourseMaster
          </span>
        </div>
        <div className="grid min-h-90 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 sm:min-h-107.5 sm:grid-cols-[150px_1fr]">
          <div className="hidden bg-[#0f1428] p-4 text-white sm:block">
            <div className="mb-8 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6c3bff]">
                <BookMiniIcon />
              </span>
              <span className="hidden text-[11px] font-bold sm:block">
                CourseMaster
              </span>
            </div>
            {["Overview", "My courses", "Explore", "Progress"].map(
              (item, index) => (
                <div
                  key={item}
                  className={`mb-2 flex h-9 items-center gap-2 rounded-lg px-2.5 text-[10px] font-medium ${index === 0
                    ? "bg-violet-500/15 text-violet-300"
                    : "text-slate-500"
                    }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  <span className="hidden sm:block">{item}</span>
                </div>
              ),
            )}
          </div>
          <div className="min-w-0 bg-slate-50 p-4 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xl font-extrabold tracking-tight text-[#0f1428]">
                  Explore CourseMaster
                </p>
                <p className="mt-1 text-[10px] text-slate-400">
                  Live course catalog from the backend.
                </p>
              </div>
              <span className="hidden rounded-full bg-violet-100 px-3 py-1 text-[9px] font-bold text-[#6c3bff] sm:block">
                LIVE DATA
              </span>
            </div>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[11px] font-bold text-[#0f1428]">
                  Featured courses
                </p>
                <a
                  href="#courses"
                  className="text-[9px] font-bold text-[#6c3bff]"
                >
                  View all
                </a>
              </div>
              <div className="space-y-2">
                {loading ? (
                  [1, 2].map((item) => (
                    <div
                      key={item}
                      className="flex animate-pulse gap-3 rounded-xl border border-slate-100 p-2"
                    >
                      <div className="h-12 w-14 rounded-lg bg-slate-100" />
                      <div className="flex-1 py-1">
                        <div className="h-2.5 w-2/3 rounded bg-slate-100" />
                        <div className="mt-2 h-2 w-1/2 rounded bg-slate-100" />
                      </div>
                    </div>
                  ))
                ) : courses.length ? (
                  courses.slice(0, 2).map((course) => {
                    const image = course.imageUrl;
                    return (
                      <div
                        key={course.id}
                        className="flex gap-3 rounded-xl border border-slate-100 p-2"
                      >
                        <div className="relative h-12 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          {image ? (
                            <CldImage
                              src={image}
                              alt={course.title}
                              width={560}
                              height={480}
                              crop="fill"
                              gravity="auto"
                              sizes="56px"
                              loading="eager"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[10px] text-slate-400">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[9px] font-bold text-[#0f1428]">
                            {course.title}
                          </p>
                          <p className="mt-1 truncate text-[8px] text-slate-400">
                            {categoryName(course)} ·{" "}
                            {course.level}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center">
                    <p className="text-[10px] font-semibold text-slate-500">
                      No courses available yet
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-[1fr_0.72fr] gap-3">
              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <p className="text-[9px] font-bold text-[#0f1428]">
                  Catalog
                </p>
                <div className="mt-3 flex h-14 items-end gap-1.5">
                  {(courses.length
                    ? courses
                      .slice(0, 7)
                      .map((course) =>
                        Math.max(
                          18,
                          Math.min(
                            100,
                            enrolledCount(course) || 18,
                          ),
                        ),
                      )
                    : [30, 46, 38, 62, 50, 76, 58]
                  ).map((height, index) => (
                    <span
                      key={index}
                      className="flex-1 rounded-t-md bg-violet-500/70"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="rounded-xl bg-[#0f1428] p-3 text-white">
                <p className="text-[8px] text-slate-500">
                  Live catalog
                </p>
                <p className="mt-1 text-2xl font-black">
                  {loading ? "…" : courses.length}
                </p>
                <p className="mt-2 text-[8px] font-medium text-violet-300">
                  courses available now
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-7 left-6 hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl sm:flex">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${error
            ? "bg-amber-50 text-amber-500"
            : loading
              ? "bg-slate-100 text-slate-400"
              : "bg-emerald-50 text-emerald-500"
            }`}
        >
          {error ? (
            <span className="text-sm font-black">!</span>
          ) : loading ? (
            <span className="h-3 w-3 animate-pulse rounded-full bg-current" />
          ) : (
            <CheckIcon />
          )}
        </span>
        <div>
          <p className="text-xs font-bold text-[#0f1428]">
            {error
              ? "Backend response failed"
              : loading
                ? "Connecting to backend"
                : "Backend connected"}
          </p>
          <p className="mt-1 text-[10px] text-slate-400">
            {error
              ? "Check the courses API response"
              : "Course data is loaded from your API"}
          </p>
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}
