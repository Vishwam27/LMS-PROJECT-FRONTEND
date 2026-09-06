'use client'


type ExploreHeaderProps = {
  search: string
  courseCount: number
  loading: boolean
  onSearchChange: (value: string) => void
}

export default function ExploreHeader({
  search,
  courseCount,
  loading,
  onSearchChange,
}: ExploreHeaderProps) {
  return (
    <header
      className="flex items-center justify-between px-8 py-4 shrink-0"
      style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      {/* Title */}
      <div>
        <h1
          className="text-xl font-bold"
          style={{
            fontFamily: 'Outfit, sans-serif',
            color: '#0f1428',
          }}
        >
          Explore Courses
        </h1>

        <p
          className="text-sm"
          style={{ color: '#64748b' }}
        >
          {loading
            ? 'Loading courses...'
            : `${courseCount} courses available`}
        </p>
      </div>

      {/* Search */}
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
        style={{
          background: '#f8fafc',
          border: '1.5px solid #e2e8f0',
          width: 280,
        }}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) =>
            onSearchChange(e.target.value)
          }
          className="w-full bg-transparent outline-none text-sm"
          style={{
            color: '#0f1428',
          }}
        />

        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        )}
      </div>
    </header>
  )
}