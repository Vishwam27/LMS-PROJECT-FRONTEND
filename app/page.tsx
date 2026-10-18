import Link from "next/link";
import { FileDown } from "lucide-react";
import CourseCards from "./components/home/CourseCards";
import CourseDataProvider from "./components/home/CourseDataProvider";
import CoursePreview from "./components/home/CoursePreview";
import CourseStats from "./components/home/CourseStats";
import { BookMiniIcon } from "./components/home/HomeIcons";
import GitHubLink from "./components/GitHubLink";

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

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-[#0f1428]">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:h-19 sm:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
            <LogoMark small />
            <span className="truncate text-lg font-extrabold tracking-tight sm:text-xl">
              Course<span className="text-[#6c3bff]">Master</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-500 lg:flex">
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
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <GitHubLink href="https://github.com/Vishwam27/LMS-PROJECT-FRONTEND.git" />
            <a
              href="/Vishwam_Patel_Resume.pdf"
              download="Vishwam_Patel_Resume.pdf"
              aria-label="Download Vishwam Patel's resume (PDF)"
              title="Download Vishwam Patel's resume (PDF)"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-violet-200 hover:bg-violet-50 hover:text-[#6c3bff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c3bff] focus-visible:ring-offset-2"
            >
              <FileDown size={22} aria-hidden="true" focusable="false" />
            </a>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
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
      <CourseDataProvider>
        <main className="pt-16 sm:pt-19">
          {/* Hero */}
          <section className="relative overflow-hidden border-b border-slate-200 bg-white">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-28 -top-20 h-125 w-125 rounded-full bg-violet-200/40 blur-3xl" />
              <div className="absolute -left-20 top-56 h-80 w-[320px] rounded-full bg-sky-100/60 blur-3xl" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(15,20,40,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(15,20,40,.035)_1px,transparent_1px)] bg-size-[72px_72px]" />
            </div>
            <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:gap-14 sm:px-8 sm:py-20 lg:grid-cols-[0.88fr_1.12fr] lg:py-24">
              <div className="max-w-2xl">
                <h1 className="text-4xl font-black leading-[1.02] sm:text-6xl lg:text-7xl tracking-[-0.045em]">
                  Build skills.
                  <span className="block bg-linear-to-r from-[#6c3bff] via-violet-400 to-sky-400 bg-clip-text text-transparent">
                    Shape what&apos;s next.
                  </span>
                </h1>
                <p className="mt-6 max-w-xl text-sm leading-7 sm:mt-7 sm:text-lg sm:leading-8 text-slate-500">
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
              <CoursePreview />
            </div>
          </section>
          {/* Stats */}
          <CourseStats />
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
                <CourseCards />
                <div className="hidden min-h-64 flex-col justify-between rounded-3xl border border-violet-200 bg-linear-to-br from-violet-50 via-white to-sky-50 p-7 sm:flex">
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
                  <div className="absolute inset-0 bg-linear-to-br from-violet-100 via-white to-sky-50" />
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
            <div className="relative mx-auto max-w-7xl overflow-hidden rounded-4xl border border-violet-200 bg-linear-to-br from-violet-50 via-white to-sky-50 px-6 py-16 text-center sm:px-12 sm:py-20">
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
      </CourseDataProvider>
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

function LogoMark({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`flex items-center justify-center rounded-xl bg-linear-to-br from-[#6c3bff] to-violet-400 shadow-lg shadow-violet-200 ${small ? "h-8 w-8" : "h-10 w-10"
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
