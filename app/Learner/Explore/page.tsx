




'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CldImage } from 'next-cloudinary'
import Sidebar from '../../components/learner/SideBar'


type Category = {
  id: string
  name: string
  description?: string | null
}
type Course = {
  id: string
  title: string
  description: string
  imageUrl?: string | null
  price: string | number
  level: string
  duration: string
  instructorId?: string | null
  categoryId?: string | null
  isPublished: boolean
  createdAt: string
  updatedAt: string
  category?: Category | null
}
export default function ExplorePage() {
  const router = useRouter()
  // =========================
  // Backend data
  // =========================
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // =========================
  // Filters
  // =========================
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [level, setLevel] = useState('All Levels')
  const [sort, setSort] = useState('default')
  const [focused, setFocused] = useState(false)
  // =========================
  // Fetch courses
  // =========================
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/courses`
        )
        if (!response.ok) {
          throw new Error('Failed to fetch courses')
        }
        const data: Course[] = await response.json()
        setCourses(data)
      } catch (error) {
        console.error('Course fetch error:', error)
        setError('Unable to load courses from the server.')
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])
  // =========================
  // Categories
  // =========================
  const categories = useMemo(() => {
    const names = courses
      .map((course) => course.category?.name)
      .filter((name): name is string => Boolean(name))
    return ['All', ...Array.from(new Set(names))]
  }, [courses])
  // =========================
  // Levels
  // =========================
  const levels = useMemo(() => {
    const values = courses
      .map((course) => course.level)
      .filter(Boolean)
    return ['All Levels', ...Array.from(new Set(values))]
  }, [courses])
  // =========================
  // Filter + Sort
  // =========================
  const filteredCourses = useMemo(() => {
    const searchValue = search.toLowerCase().trim()
    const result = courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchValue) ||
        course.description.toLowerCase().includes(searchValue) ||
        course.category?.name
          .toLowerCase()
          .includes(searchValue)
      const matchesCategory =
        category === 'All' ||
        course.category?.name === category
      const matchesLevel =
        level === 'All Levels' ||
        course.level === level
      return (
        matchesSearch &&
        matchesCategory &&
        matchesLevel
      )
    })
    return [...result].sort((a, b) => {
      if (sort === 'price-asc') {
        return Number(a.price) - Number(b.price)
      }
      if (sort === 'price-desc') {
        return Number(b.price) - Number(a.price)
      }
      if (sort === 'title') {
        return a.title.localeCompare(b.title)
      }
      return 0
    })
  }, [courses, search, category, level, sort])
  // =========================
  // Clear filters
  // =========================
  const clearFilters = () => {
    setSearch('')
    setCategory('All')
    setLevel('All Levels')
    setSort('default')
  }
  // =========================
  // UI
  // =========================
  return (
    <div
      className="flex h-screen overflow-hidden flex-col lg:flex-row"
      style={{
        background: '#f1f5f9',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Sidebar */}
      <Sidebar />
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* =========================
            TOPBAR
        ========================= */}
        <header
          className="flex items-center justify-between px-8 py-4 shrink-0"
          style={{
            background: 'white',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
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
                : `${courses.length} courses available`}
            </p>
          </div>
          {/* Search */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
            style={{
              background: '#f8fafc',
              border: `1.5px solid ${
                focused ? '#6c3bff' : '#e2e8f0'
              }`,
              boxShadow: focused
                ? '0 0 0 3px rgba(108,59,255,0.1)'
                : 'none',
              width: 280,
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke={
                focused ? '#6c3bff' : '#94a3b8'
              }
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
                setSearch(e.target.value)
              }
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: 14,
                color: '#0f1428',
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                }}
              >
                ✕
              </button>
            )}
          </div>
        </header>
        {/* =========================
            MAIN
        ========================= */}
        <main className="flex-1 overflow-y-auto">
          {/* =========================
              HERO
          ========================= */}
          <section
            className="px-8 py-10 relative overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, #080c1e 0%, #1a0e3a 100%)',
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(108,59,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(108,59,255,0.08) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }}
            />
            <div className="relative z-10 max-w-2xl">
              <span
                className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full mb-4"
                style={{
                  background:
                    'rgba(108,59,255,0.25)',
                  color: '#a880ff',
                  border:
                    '1px solid rgba(108,59,255,0.3)',
                }}
              >
                ✦ Learning Library
              </span>
              <h2
                className="text-3xl font-bold text-white mb-3"
                style={{
                  fontFamily: 'Outfit, sans-serif',
                }}
              >
                Everything you need to
                <br />
                <span style={{ color: '#a880ff' }}>
                  level up your career.
                </span>
              </h2>
              <p
                className="text-sm"
                style={{
                  color: 'rgba(255,255,255,0.6)',
                }}
              >
                Explore courses available in your LMS
                and start learning new skills.
              </p>
            </div>
          </section>
          <div className="px-8 py-6">
            {/* =========================
                FILTER BAR
            ========================= */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              {/* Categories */}
              <div className="flex items-center gap-2 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() =>
                      setCategory(cat)
                    }
                    className="px-4 py-1.5 rounded-full text-sm font-medium"
                    style={{
                      background:
                        category === cat
                          ? '#6c3bff'
                          : 'white',
                      color:
                        category === cat
                          ? 'white'
                          : '#64748b',
                      border: `1.5px solid ${
                        category === cat
                          ? '#6c3bff'
                          : '#e2e8f0'
                      }`,
                      cursor: 'pointer',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {/* Level + Sort */}
              <div className="flex items-center gap-2">
                <select
                  value={level}
                  onChange={(e) =>
                    setLevel(e.target.value)
                  }
                  style={{
                    padding: '7px 12px',
                    borderRadius: 10,
                    border:
                      '1px solid #e2e8f0',
                    background: 'white',
                    fontSize: 13,
                    color: '#374151',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  {levels.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>
                <select
                  value={sort}
                  onChange={(e) =>
                    setSort(e.target.value)
                  }
                  style={{
                    padding: '7px 12px',
                    borderRadius: 10,
                    border:
                      '1px solid #e2e8f0',
                    background: 'white',
                    fontSize: 13,
                    color: '#374151',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="default">
                    Sort: Default
                  </option>
                  <option value="title">
                    Name
                  </option>
                  <option value="price-asc">
                    Price: Low → High
                  </option>
                  <option value="price-desc">
                    Price: High → Low
                  </option>
                </select>
              </div>
            </div>
            {/* =========================
                LOADING
            ========================= */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-24">
                <div
                  className="w-10 h-10 rounded-full border-4 animate-spin"
                  style={{
                    borderColor: '#e2e8f0',
                    borderTopColor: '#6c3bff',
                  }}
                />
                <p
                  className="mt-4 text-sm"
                  style={{
                    color: '#64748b',
                  }}
                >
                  Loading courses...
                </p>
              </div>
            )}
            {/* =========================
                ERROR
            ========================= */}
            {!loading && error && (
              <div className="flex flex-col items-center justify-center py-24">
                <span className="text-5xl mb-4">
                  ⚠️
                </span>
                <p
                  className="text-base font-semibold"
                  style={{
                    color: '#0f1428',
                  }}
                >
                  Unable to load courses
                </p>
                <p
                  className="text-sm mt-1"
                  style={{
                    color: '#64748b',
                  }}
                >
                  {error}
                </p>
                <button
                  onClick={() =>
                    window.location.reload()
                  }
                  className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold text-white"
                  style={{
                    background: '#6c3bff',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Try Again
                </button>
              </div>
            )}
            {/* =========================
                EMPTY STATE
            ========================= */}
            {!loading &&
              !error &&
              filteredCourses.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24">
                  <span className="text-5xl mb-4">
                    🔍
                  </span>
                  <p
                    className="text-base font-semibold"
                    style={{
                      color: '#0f1428',
                    }}
                  >
                    No courses found
                  </p>
                  <p
                    className="text-sm mt-1"
                    style={{
                      color: '#64748b',
                    }}
                  >
                    Try a different search or filter.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold text-white"
                    style={{
                      background: '#6c3bff',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            {/* =========================
                COURSE GRID
            ========================= */}
            {!loading &&
              !error &&
              filteredCourses.length > 0 && (
                <div
                  className="grid gap-6"
                  style={{
                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(340px, 1fr))',
                  }}
                >
                  {filteredCourses.map((course) => (
                    <article
                      key={course.id}
                      className="rounded-2xl overflow-hidden transition-all"
                      style={{
                        background: 'white',
                        border:
                          '1.5px solid #e2e8f0',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor =
                          '#6c3bff'
                        e.currentTarget.style.boxShadow =
                          '0 8px 32px rgba(108,59,255,0.12)'
                        e.currentTarget.style.transform =
                          'translateY(-3px)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          '#e2e8f0'
                        e.currentTarget.style.boxShadow =
                          'none'
                        e.currentTarget.style.transform =
                          'translateY(0)'
                      }}
                    >
                      {/* =========================
                          COURSE IMAGE
                      ========================= */}
                      <div
                      onClick={() =>
                        router.push(
                          `/learner/courses/${course.id}`
                        )
                      }
                        className="relative overflow-hidden"
                        style={{
                          height: 200,
                          background:
                            'linear-gradient(135deg, #6c3bff, #1a0e3a)',
                        }}
                      >
                        {course.imageUrl ? (
                          <CldImage
                            src={course.imageUrl}
                            alt={course.title}
                            width={900}
                            height={500}
                            crop="fill"
                            loading="eager"
                            gravity="auto"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-6xl">
                              🎓
                            </span>
                          </div>
                         
                        )}
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              'linear-gradient(to top, rgba(0,0,0,0.45), transparent 55%)',
                          }}
                        />
                        {/* Category */}
                        <span
                          className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{
                            background:
                              'rgba(0,0,0,0.55)',
                            color: 'white',
                          }}
                        >
                          {course.category?.name ||
                            'Course'}
                        </span>
                        {/* Level */}
                        <span
                          className="absolute bottom-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{
                            background:
                              'rgba(255,255,255,0.2)',
                            color: 'white',
                            backdropFilter:
                              'blur(6px)',
                          }}
                        >
                          {course.level}
                        </span>
                      </div>
                      {/* =========================
                          COURSE BODY
                      ========================= */}
                      <div className="p-5"
                       onClick={() =>
                        router.push(
                          `/learner/courses/${course.id}`
                        )
                      }>
                        <h3
                          className="font-bold text-lg mb-2 leading-snug"
                          style={{
                            fontFamily:
                              'Outfit, sans-serif',
                            color: '#0f1428',
                          }}
                        >
                          {course.title}
                        </h3>
                        <p
                          className="text-sm mb-4 leading-relaxed"
                          style={{
                            color: '#64748b',
                          }}
                        >
                          {course.description}
                        </p>
                        {/* Course information */}
                        <div
                          className="flex flex-wrap gap-3 mb-5 text-xs"
                          style={{
                            color: '#64748b',
                          }}
                        >
                          <span>
                            🕒 {course.duration}
                          </span>
                          <span>•</span>
                          <span>
                            📚 {course.level}
                          </span>
                          <span>•</span>
                          <span>
                            {course.isPublished
                              ? '✓ Published'
                              : 'Draft'}
                          </span>
                        </div>
                        {/* Footer */}
                        <div
                          className="flex items-center justify-between pt-4"
                          style={{
                            borderTop:
                              '1px solid #f1f5f9',
                          }}
                        >
                          <div>
                            <p
                              className="text-xl font-bold"
                              style={{
                                fontFamily:
                                  'Outfit, sans-serif',
                                color: '#0f1428',
                              }}
                            >
                              $
                              {Number(
                                course.price
                              ).toFixed(2)}
                            </p>
                            <p
                              className="text-xs"
                              style={{
                                color: '#94a3b8',
                              }}
                            >
                              Full course
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              router.push(
                                `/learner/courses/${course.id}`
                              )
                            }
                            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                            style={{
                              background:
                                'linear-gradient(135deg, #6c3bff, #8a5fff)',
                              border: 'none',
                              cursor: 'pointer',
                              boxShadow:
                                '0 4px 14px rgba(108,59,255,0.25)',
                            }}
                          >
                            View Course
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
          </div>
        </main>
      </div>
    </div>
  )
}

