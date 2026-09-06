"use client";

interface TopBarProps {
  totalCourses: number;
  search: string;
  onSearchChange: (value: string) => void;
}

export function TopBar({
  totalCourses,
  search,
  onSearchChange,
}: TopBarProps) {
  return (
    <header
      className="flex shrink-0 flex-col gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"
    >
      {/* Title */}
      <div>
        <h1
          className="text-xl font-bold text-[#0f1428]"
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          My Courses
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {totalCourses === 0
            ? "You haven't enrolled in any courses yet."
            : `${totalCourses} ${
                totalCourses === 1 ? "course" : "courses"
              } enrolled`}
        </p>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-72">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        <input
          type="text"
          value={search}
          onChange={(e) =>
            onSearchChange(e.target.value)
          }
          placeholder="Search your courses..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#6c3bff] focus:bg-white focus:ring-2 focus:ring-purple-100"
        />
      </div>
    </header>
  );
}