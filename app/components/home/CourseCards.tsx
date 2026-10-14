"use client";

import Link from "next/link";
import { CldImage } from "next-cloudinary";
import { categoryName, instructorName, priceLabel, useCourseData } from "./CourseDataProvider";
import { BookMiniIcon } from "./HomeIcons";

export default function CourseCards() {
  const { courses, loading } = useCourseData();

  return (
    <>
      {loading ? (
        [1, 2, 3, 4].map((item) => (
          <CourseSkeleton key={item} />
        ))
      ) : courses.length ? (
        courses.slice(0, 5).map((course, index) => {
          const image = course.imageUrl;
          return (
            <Link
              key={course.id}
              href="/Register"
              className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/70 sm:rounded-3xl ${index >= 4 ? "hidden sm:block" : ""}`}
            >
              <div className="relative h-24 overflow-hidden bg-slate-100 sm:h-48">
                {image ? (
                  <CldImage
                    src={image}
                    alt={course.title}
                    width={900}
                    height={500}
                    crop="fill"
                    gravity="auto"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="eager"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-linear-to-br from-violet-100 via-white to-sky-100">
                    <BookMiniIcon />
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-[#0f1428]/60 via-transparent to-transparent" />
                <span className="absolute left-2 top-2 rounded-full border border-white/20 bg-[#0f1428]/75 px-2 py-0.5 text-[8px] font-semibold text-white backdrop-blur sm:left-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-[10px]">
                  {categoryName(course)}
                </span>
                {course.rating !== null &&
                  course.rating !== undefined &&
                  String(course.rating) !== "" && (
                    <span className="absolute bottom-2 right-2 rounded-full bg-white px-2 py-0.5 text-[8px] font-bold text-[#0f1428] sm:bottom-4 sm:right-4 sm:px-3 sm:py-1.5 sm:text-[10px]">
                      ★ {course.rating}
                    </span>
                  )}
              </div>
              <div className="p-3 sm:p-6">
                <div className="flex items-center gap-1 text-[8px] font-medium text-slate-400 sm:gap-2 sm:text-[10px]">
                  <span>{course.level}</span>
                  <span>•</span>
                  <span>{course.duration}</span>
                </div>
                <h3 className="mt-1 line-clamp-2 text-xs font-bold leading-4 text-[#0f1428] sm:mt-3 sm:text-lg sm:leading-normal">
                  {course.title}
                </h3>
                <p className="mt-1 truncate text-[9px] text-slate-500 sm:mt-2 sm:text-xs">
                  with {instructorName(course)}
                </p>
                <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 sm:mt-5 sm:pt-4">
                  <span className="text-sm font-black text-[#6c3bff] sm:text-lg">
                    {priceLabel(course.price)}
                  </span>
                </div>
              </div>
            </Link>
          );
        })
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center md:col-span-2 lg:col-span-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-[#6c3bff]">
            <BookMiniIcon />
          </div>
          <h3 className="mt-5 text-xl font-bold text-[#0f1428]">
            Your live catalog will appear here
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Make sure your Express backend is running and that
            GET /api/courses returns the course catalog.
          </p>
        </div>
      )}
    </>
  );
}

function CourseSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white">
      <div className="h-48 bg-slate-100" />
      <div className="space-y-4 p-6">
        <div className="h-2.5 w-24 rounded bg-slate-100" />
        <div className="h-5 w-3/4 rounded bg-slate-100" />
        <div className="h-3 w-1/2 rounded bg-slate-100" />
        <div className="h-px bg-slate-100" />
        <div className="h-4 w-1/3 rounded bg-slate-100" />
      </div>
    </div>
  );
}
