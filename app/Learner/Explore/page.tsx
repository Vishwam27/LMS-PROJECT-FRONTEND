'use client'
import { useEffect, useMemo, useState } from 'react'
import Sidebar from '../../components/learner/SideBar'
import ExploreHeader from './exploreHeader'
import { BannerHeader } from './bannerHeader'
import CourseGrid, { Course } from './courseGrid'

export default function ExplorePage() {
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
          ?.toLowerCase()
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
  }, [
    courses,
    search,
    category,
    level,
    sort,
  ])

  // =========================
  // Clear filters
  // =========================

  const clearFilters = () => {
    setSearch('')
    setCategory('All')
    setLevel('All Levels')
    setSort('default')
  }

  return (
    <div
      className="
        flex
        min-h-screen
        w-full
        bg-[#f1f5f9]
        lg:h-screen
        lg:overflow-hidden
        lg:flex-row
      "
      style={{
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <Sidebar />

      {/* =====================================================
          MAIN AREA

          IMPORTANT:
          pt-[72px] reserves space for the fixed mobile
          topbar from Sidebar.
          Desktop removes that padding.
          ===================================================== */}

      <div
        className="
          flex
          min-w-0
          flex-1
          flex-col
          pt-18
          lg:min-h-0
          lg:pt-0
        "
      >
        {/* ===================================================
            DESKTOP / PAGE HEADER
            =================================================== */}

        <ExploreHeader
          search={search}
          courseCount={courses.length}
          loading={loading}
          onSearchChange={setSearch}
        />

        {/* ===================================================
            SCROLLABLE CONTENT
            =================================================== */}

        <main
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overflow-x-hidden
          "
        >
          {/* =================================================
              BANNER
              ================================================= */}

          <BannerHeader />

          {/* =================================================
              COURSES SECTION
              ================================================= */}

          <section
            className="
              px-4
              py-5
              sm:px-6
              sm:py-6
              lg:px-8
            "
          >
            {/* ===============================================
                FILTER BAR
                =============================================== */}

            <div
              className="
                mb-6
                flex
                flex-col
                gap-4
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >
              {/* Categories */}

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >
                {categories.map((item) => {
                  const active = category === item

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCategory(item)}
                      className={`
                        rounded-full
                        border
                        px-4
                        py-1.5
                        text-sm
                        font-medium
                        transition-all
                        duration-200

                        ${
                          active
                            ? `
                              border-[#6c3bff]
                              bg-[#6c3bff]
                              text-white
                            `
                            : `
                              border-slate-200
                              bg-white
                              text-slate-500
                              hover:border-[#6c3bff]
                              hover:text-[#6c3bff]
                            `
                        }
                      `}
                    >
                      {item}
                    </button>
                  )
                })}
              </div>

              {/* Level + Sort */}

              <div
                className="
                  grid
                  grid-cols-2
                  gap-2
                  sm:flex
                "
              >
                {/* Level */}

                <select
                  value={level}
                  onChange={(e) =>
                    setLevel(e.target.value)
                  }
                  className="
                    min-w-0
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-3
                    py-2.5
                    text-sm
                    text-slate-700
                    outline-none
                    transition-colors
                    focus:border-[#6c3bff]
                    sm:min-w-35
                  "
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

                {/* Sort */}

                <select
                  value={sort}
                  onChange={(e) =>
                    setSort(e.target.value)
                  }
                  className="
                    min-w-0
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-3
                    py-2.5
                    text-sm
                    text-slate-700
                    outline-none
                    transition-colors
                    focus:border-[#6c3bff]
                    sm:min-w-37.5
                  "
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

            {/* ===============================================
                LOADING
                =============================================== */}

            {loading && (
              <div
                className="
                  flex
                  min-h-75
                  flex-col
                  items-center
                  justify-center
                  py-16
                "
              >
                <div
                  className="
                    h-10
                    w-10
                    animate-spin
                    rounded-full
                    border-4
                    border-slate-200
                    border-t-[#6c3bff]
                  "
                />

                <p className="mt-4 text-sm text-slate-500">
                  Loading courses...
                </p>
              </div>
            )}

            {/* ===============================================
                ERROR
                =============================================== */}

            {!loading && error && (
              <div
                className="
                  flex
                  min-h-75
                  flex-col
                  items-center
                  justify-center
                  py-16
                "
              >
                <span className="mb-4 text-5xl">
                  ⚠️
                </span>

                <p
                  className="
                    text-base
                    font-semibold
                    text-[#0f1428]
                  "
                >
                  Unable to load courses
                </p>

                <p className="mt-1 text-center text-sm text-slate-500">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    window.location.reload()
                  }
                  className="
                    mt-4
                    rounded-xl
                    bg-[#6c3bff]
                    px-5
                    py-2
                    text-sm
                    font-semibold
                    text-white
                    transition-transform
                    hover:scale-105
                  "
                >
                  Try Again
                </button>
              </div>
            )}

            {/* ===============================================
                EMPTY STATE
                =============================================== */}

            {!loading &&
              !error &&
              filteredCourses.length === 0 && (
                <div
                  className="
                    flex
                    min-h-75
                    flex-col
                    items-center
                    justify-center
                    py-16
                  "
                >
                  <span className="mb-4 text-5xl">
                    🔍
                  </span>

                  <p
                    className="
                      text-base
                      font-semibold
                      text-[#0f1428]
                    "
                  >
                    No courses found
                  </p>

                  <p className="mt-1 text-center text-sm text-slate-500">
                    Try a different search or filter.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="
                      mt-4
                      rounded-xl
                      bg-[#6c3bff]
                      px-5
                      py-2
                      text-sm
                      font-semibold
                      text-white
                      transition-transform
                      hover:scale-105
                    "
                  >
                    Clear Filters
                  </button>
                </div>
              )}

            {/* ===============================================
                COURSE GRID
                =============================================== */}

            {!loading &&
              !error &&
              filteredCourses.length > 0 && (
                <CourseGrid
                  courses={filteredCourses}
                />
              )}
          </section>
        </main>
      </div>
    </div>
  )
}