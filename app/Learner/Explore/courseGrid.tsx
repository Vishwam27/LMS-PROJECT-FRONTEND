'use client'

import { useRouter } from 'next/navigation'
import { CldImage } from 'next-cloudinary'

type Category = {
  id: string
  name: string
  description?: string | null
}

export type Course = {
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

type CourseGridProps = {
  courses: Course[]
}

export default function CourseGrid({
  courses,
}: CourseGridProps) {
  const router = useRouter()

  const openCourse = (courseId: string) => {
    router.push(`/Learner/Courses/${courseId}`)
  }

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-6
        md:grid-cols-2
        xl:grid-cols-3
        items-stretch
      "
    >
      {courses.map((course) => (
        <article
          key={course.id}
          className="
            group
            flex
            flex-col
            overflow-hidden
            rounded-[28px]
            border
            border-slate-200
            bg-white
            shadow-sm
            transition-all
            duration-300
            ease-out
            hover:-translate-y-2
            hover:border-[#6c3bff]
            hover:shadow-[0_18px_45px_rgba(108,59,255,0.16)]
          "
        >
          {/* =================================
              COURSE IMAGE
          ================================= */}

          <div
            onClick={() => openCourse(course.id)}
            className="
              relative
              h-50
              shrink-0
              cursor-pointer
              overflow-hidden
              bg-linear-to-br
              from-[#6c3bff]
              to-[#1a0e3a]
            "
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
                className="
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-500
                  ease-out
                  group-hover:scale-105
                "
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-6xl">
                  🎓
                </span>
              </div>
            )}

            {/* Image Overlay */}
            <div
              className="
                absolute
                inset-0
                bg-linear-to-t
                from-black/45
                via-transparent
                to-transparent
              "
            />

            {/* Category */}
            <span
              className="
                absolute
                left-4
                top-4
                rounded-full
                bg-black/60
                px-4
                py-2
                text-sm
                font-semibold
                text-white
                backdrop-blur-md
              "
            >
              {course.category?.name || 'Course'}
            </span>

            {/* Level */}
            <span
              className="
                absolute
                bottom-4
                left-4
                rounded-full
                bg-white/25
                px-4
                py-2
                text-sm
                font-semibold
                text-white
                backdrop-blur-md
              "
            >
              {course.level}
            </span>
          </div>

          {/* =================================
              COURSE BODY
          ================================= */}

          <div className="flex flex-1 flex-col p-6">

            {/* Title */}
            <button
              type="button"
              onClick={() => openCourse(course.id)}
              className="text-left"
            >
              <h3
                className="
                  text-xl
                  font-bold
                  leading-snug
                  text-[#0f1428]
                  transition-colors
                  duration-200
                  group-hover:text-[#6c3bff]
                "
                style={{
                  fontFamily: 'Outfit, sans-serif',
                }}
              >
                {course.title}
              </h3>
            </button>

            {/* Description */}
            <button
              type="button"
              onClick={() => openCourse(course.id)}
              className="
                mt-3
                h-21
                overflow-hidden
                text-left
              "
            >
              <p className="line-clamp-3 text-base leading-[1.7] text-slate-500">
                {course.description}
              </p>
            </button>

            {/* =================================
                COURSE INFORMATION
            ================================= */}

            <div
              className="
                mt-4
                mb-5
                flex
                min-h-16
                flex-wrap
                items-start
                gap-3
                text-sm
                text-slate-500
              "
            >
              <span className="whitespace-nowrap">
                🕒 {course.duration}
              </span>

              <span>•</span>

              <span className="whitespace-nowrap">
                📚 {course.level}
              </span>

              <span>•</span>

              <span className="whitespace-nowrap">
                {course.isPublished
                  ? '✓ Published'
                  : 'Draft'}
              </span>
            </div>

            {/* =================================
                FOOTER
            ================================= */}

            <div
              className="
                mt-auto
                flex
                items-center
                justify-between
                border-t
                border-slate-100
                pt-5
              "
            >
              {/* Price */}
              <div>
                <p
                  className="
                    text-2xl
                    font-bold
                    text-[#0f1428]
                  "
                  style={{
                    fontFamily: 'Outfit, sans-serif',
                  }}
                >
                  $
                  {Number(course.price).toFixed(2)}
                </p>

                <p className="text-sm text-slate-400">
                  Full course
                </p>
              </div>

              {/* View Course */}
              <button
                type="button"
                onClick={() => openCourse(course.id)}
                className="
                  rounded-2xl
                  bg-linear-to-br
                  from-[#6c3bff]
                  to-[#8a5fff]
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  shadow-[0_6px_18px_rgba(108,59,255,0.25)]
                  transition-all
                  duration-300
                  hover:scale-105
                  hover:shadow-[0_10px_28px_rgba(108,59,255,0.4)]
                "
              >
                View Course
              </button>
            </div>

          </div>
        </article>
      ))}
    </div>
  )
}