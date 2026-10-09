"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CldImage } from "next-cloudinary";
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

const FEATURES = [
  {
    number: "01",
    title: "Learn at your pace",
    description:
      "Structured lessons, hands-on practice, and progress tracking keep your learning moving forward.",
    icon: PlayIcon,
  },
  {
    number: "02",
    title: "Learn from real instructors",
    description:
      "Discover practical courses created and managed by instructors inside one focused LMS.",
    icon: SparkIcon,
  },
  {
    number: "03",
    title: "Track real progress",
    description:
      "Complete lessons, build momentum, and keep your learning journey visible from one place.",
    icon: ChartIcon,
  },
];

const STEPS = [
  {
    number: "01",
    title: "Choose your path",
    text: "Browse the live CourseMaster catalog and pick a course that matches your goals.",
  },
  {
    number: "02",
    title: "Learn by doing",
    text: "Work through focused lessons and build practical knowledge step by step.",
  },
  {
    number: "03",
    title: "Keep your momentum",
    text: "Track completed lessons and continue learning from where you stopped.",
  },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function categoryName(course: Course) {
  return course.category?.name ?? "Course";
}

function instructorName(course: Course) {
  return course.instructor?.name ?? "CourseMaster Instructor";
}

function enrolledCount(course: Course) {
  return Number(course._count?.enrollments ?? 0);
}

function priceLabel(price: Course["price"]) {
  const value = Number(price);
  if (!Number.isFinite(value) || value === 0) {
    return "Free";
  }
  return `$${value.toFixed(2)}`;
}

export default function HomePage() {
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
        // Your real Explore page consumes GET /api/courses as Course[].
        // Keep that as the primary response shape, while accepting common
        // wrapped shapes so the homepage is not brittle.
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
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-[#0f1428]">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:h-[76px] sm:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
            <LogoMark small />
            <span className="truncate text-lg font-extrabold tracking-tight sm:text-xl">
              Course<span className="text-[#6c3bff]">Master</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-500 md:flex">
            <a href="#features" className="transition hover:text-[#0f1428]">
              Features
            </a>
            <a href="#courses" className="transition hover:text-[#0f1428]">
              Courses
            </a>
            <a
              href="#how-it-works"
              className="transition hover:text-[#0f1428]"
            >
              How it works
            </a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/Login"
              className="rounded-xl px-2 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-[#0f1428] sm:px-4 sm:py-2.5 sm:text-sm"
            >
              Log in
            </Link>
            <Link
              href="/Register"
              className="rounded-xl bg-[#6c3bff] px-2.5 py-2 text-xs font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-[#5d32e8] sm:px-5 sm:py-2.5 sm:text-sm"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>
      <main className="pt-16 sm:pt-[76px]">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-28 -top-20 h-[500px] w-[500px] rounded-full bg-violet-200/40 blur-3xl" />
            <div className="absolute -left-20 top-56 h-[320px] w-[320px] rounded-full bg-sky-100/60 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(15,20,40,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(15,20,40,.035)_1px,transparent_1px)] [background-size:72px_72px]" />
          </div>
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:gap-14 sm:px-8 sm:py-20 lg:grid-cols-[0.88fr_1.12fr] lg:py-24">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-black leading-[1.02] sm:text-6xl lg:text-7xl tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                Build skills.
                <span className="block bg-gradient-to-r from-[#6c3bff] via-violet-400 to-sky-400 bg-clip-text text-transparent">
                  Shape what&apos;s next.
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-7 sm:mt-7 sm:text-lg sm:leading-8 text-slate-500 sm:text-lg">
                CourseMaster brings learners and instructors together in one
                focused platform for practical learning, progress, and growth.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row">
                <Link
                  href="/Register"
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#6c3bff] px-7 py-4 text-sm font-bold text-white shadow-xl shadow-violet-200 transition hover:-translate-y-1 hover:bg-[#5d32e8]"
                >
                  Start learning for free
                  <ArrowIcon className="transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="#courses"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-4 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-[#6c3bff]"
                >
                  <PlayMiniIcon />
                  Explore courses
                </a>
              </div>
            </div>
            {/* Product preview */}
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
                <div className="grid min-h-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 sm:min-h-[430px] sm:grid-cols-[150px_1fr]">
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
          </div>
        </section>
        {/* Stats */}
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
        {/* Features */}
        <section id="features" className="px-4 py-16 sm:px-8 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#6c3bff]">
                One platform. Every ambition.
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:mt-5 sm:text-5xl">
                Everything you need to turn learning into progress.
              </h2>
              <p className="mt-5 leading-7 text-slate-500">
                A clear learning experience built around discovery,
                practice, completion, and progress.
              </p>
            </div>
            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {FEATURES.map(({ number, title, description, icon: Icon }) => (
                <article
                  key={title}
                  className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/60"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-[#6c3bff]">
                      <Icon />
                    </span>
                    <span className="text-sm text-slate-600">
                      {number}
                    </span>
                  </div>
                  <h3 className="mt-8 text-xl font-bold text-[#0f1428]">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
        {/* Courses */}
        <section
          id="courses"
          className="border-y border-slate-200 bg-white px-4 py-10 sm:px-8 sm:py-24 lg:py-32"
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-3 sm:gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#6c3bff]">
                  Explore the catalog
                </p>
                <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
                  Skills for where the world is going.
                </h2>
              </div>
              <p className="hidden max-w-md text-sm leading-7 text-slate-500 sm:block">
                This section is populated directly from your CourseMaster
                backend, including course images, categories, instructors,
                prices, and enrollment counts.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
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
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-violet-100 via-white to-sky-100">
                            <BookMiniIcon />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1428]/60 via-transparent to-transparent" />
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
              <div className="hidden min-h-64 flex-col justify-between rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-sky-50 p-7 sm:flex">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6c3bff]/10 text-[#6c3bff]">
                  <ArrowUpIcon />
                </span>
                <div>
                  <p className="text-2xl font-black text-[#0f1428]">
                    Your next skill starts here.
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Create your account and start building your learning path.
                  </p>
                  <Link
                    href="/Register"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#6c3bff]"
                  >
                    Create your account <ArrowIcon />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* How it works */}
        <section
          id="how-it-works"
          className="px-4 py-16 sm:px-8 sm:py-24 lg:py-32"
        >
          <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#6c3bff]">
                Built around progress
              </p>
              <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
                From curiosity to capability.
              </h2>
              <p className="mt-5 leading-7 text-slate-500">
                A simple experience that keeps the focus where it belongs:
                learning, practicing, and improving.
              </p>
              <div className="relative mt-9 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-white to-sky-50" />
                <div className="relative flex h-72 flex-col justify-end p-7">
                  <div className="mb-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6c3bff] text-white shadow-lg shadow-violet-200">
                    <BookMiniIcon />
                  </div>
                  <p className="max-w-xs text-xl font-bold text-[#0f1428]">
                    Learn anywhere. Keep your momentum everywhere.
                  </p>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    Discover courses, learn lessons, and continue from where
                    you left off.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {STEPS.map((step) => (
                <article
                  key={step.number}
                  className="grid grid-cols-[64px_1fr] gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-[88px_1fr] sm:p-8"
                >
                  <span className="text-2xl font-black text-[#6c3bff]">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-[#0f1428]">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-500">
                      {step.text}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        {/* CTA */}
        <section className="px-4 pb-16 sm:px-8 sm:pb-24 lg:pb-32">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-sky-50 px-6 py-16 text-center sm:px-12 sm:py-20">
            <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-200/50 blur-3xl" />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#6c3bff]">
                Start today
              </p>
              <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-black tracking-tight text-[#0f1428] sm:text-5xl">
                The best investment you can make is in what you know.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500">
                Join CourseMaster and make your next chapter the one where you
                move forward.
              </p>
              <Link
                href="/Register"
                className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[#6c3bff] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-1 hover:bg-[#5d32e8]"
              >
                Create your free account <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-slate-200 bg-white px-4 py-8 sm:px-8 sm:py-9">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3">
            <LogoMark small />
            <span className="font-bold text-[#0f1428]">CourseMaster</span>
          </div>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} CourseMaster. Learn what&apos;s next.
          </p>
          <div className="flex gap-6 text-xs text-slate-400">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Support</span>
          </div>
        </div>
      </footer>
    </div>
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

function LogoMark({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-[#6c3bff] to-violet-400 shadow-lg shadow-violet-200 ${small ? "h-8 w-8" : "h-10 w-10"
        }`}
    >
      <svg
        width={small ? 15 : 18}
        height={small ? 15 : 18}
        viewBox="0 0 18 18"
        fill="none"
      >
        <path
          d="M9 2 15.5 5.5v7L9 16l-6.5-3.5v-7L9 2Z"
          stroke="white"
          strokeWidth="1.5"
        />
        <path
          d="m9 8 3-1.5v3L9 11 6 9.5v-3L9 8Z"
          fill="white"
        />
      </svg>
    </span>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function PlayMiniIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m10 8 6 4-6 4V8Z" />
    </svg>
  );
}

function BookMiniIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
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

function PlayIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m10 8 6 4-6 4V8Z" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3ZM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 19V9m6 10V5m6 14v-7m4 7H2" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  );
}