import type { ReactNode } from 'react'

const STATS = [
  { value: '50K+', label: 'Demo Active Learners' },
  { value: '1,200+', label: ' Demo Expert Courses' },
  { value: '98%', label: 'Demo Completion Rate' },
]

const TESTIMONIAL = {
  quote:
    'CourseMaster transformed the way our team learns. The platform is intuitive, the content is world-class, and results speak for themselves.',
  name: 'vishwam patel',
  role: 'Full Stack Project',
  avatar:'ts'
}

interface AuthPanelProps {
  children: ReactNode
}

export default function AuthPanel({ children }: AuthPanelProps) {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left — brand panel */}
      <div
        className="hidden lg:flex lg:w-[52%] flex-col justify-between relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #080c1e 0%, #0f1428 40%, #1a0e3a 100%)' }}
      >
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(108,59,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(108,59,255,0.07) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Glow blobs */}
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(108,59,255,0.22) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(138,95,255,0.18) 0%, transparent 70%)',
          }}
        />

        {/* Logo */}
        <div className="relative z-10 px-10 pt-10">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6c3bff, #a880ff)' }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M9 2L15.5 5.5V12.5L9 16L2.5 12.5V5.5L9 2Z"
                  stroke="white"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path d="M9 8L12 6.5V9.5L9 11L6 9.5V6.5L9 8Z" fill="white" />
              </svg>
            </div>
            <span
              className="text-white text-xl font-bold tracking-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              CourseMaster
            </span>
          </div>
        </div>

        {/* Hero image + overlay */}
        <div className="relative z-10 mx-10 rounded-2xl overflow-hidden" style={{ height: 280 }}>
          <img
            src="https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=900&h=560&fit=crop&auto=format"
            alt="Student learning online"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.55) saturate(0.8)' }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(8,12,30,0.9) 0%, rgba(8,12,30,0.2) 60%, transparent 100%)',
            }}
          />
          <div className="absolute bottom-0 left-0 p-6">
            <p
              className="text-white text-2xl font-bold leading-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Unlock your potential
              <br />
              <span style={{ color: '#a880ff' }}>one lesson at a time.</span>
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 mx-10 grid grid-cols-3 gap-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-4 text-center"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(108,59,255,0.2)' }}
            >
              <p
                className="text-white text-xl font-bold"
                style={{ fontFamily: 'Outfit, sans-serif', color: '#a880ff' }}
              >
                {s.value}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="relative z-10 mx-10 mb-10">
          <div
            className="rounded-2xl p-6"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <svg
              width="24"
              height="18"
              viewBox="0 0 24 18"
              fill="none"
              className="mb-3"
              style={{ opacity: 0.4 }}
            >
              <path
                d="M0 18V10.8C0 4.8 3.6 1.2 10.8 0l1.2 2.4C8.4 3.2 6.4 5.2 6 8H10.8V18H0ZM13.2 18V10.8C13.2 4.8 16.8 1.2 24 0l1.2 2.4C21.6 3.2 19.6 5.2 19.2 8H24V18H13.2Z"
                fill="white"
              />
            </svg>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {TESTIMONIAL.quote}
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, #6c3bff, #a880ff)' }}
              >
                {TESTIMONIAL.avatar}
              </div>
              <div>
                <p className="text-white text-sm font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {TESTIMONIAL.name}
                </p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {TESTIMONIAL.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 px-6 py-12 overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-8">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6c3bff, #a880ff)' }}
          >
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L15.5 5.5V12.5L9 16L2.5 12.5V5.5L9 2Z" stroke="white" strokeWidth="1.5" fill="none" />
              <path d="M9 8L12 6.5V9.5L9 11L6 9.5V6.5L9 8Z" fill="white" />
            </svg>
          </div>
          <span
            className="text-navy-900 text-xl font-bold"
            style={{ fontFamily: 'Outfit, sans-serif', color: '#0f1428' }}
          >
            CourseMaster
          </span>
        </div>

        <div className="w-full max-w-105">{children}</div>
      </div>
    </div>
  )
}

