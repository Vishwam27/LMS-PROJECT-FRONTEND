export function BannerHeader(){
   return(
     <section
            className="relative overflow-hidden px-8 py-10"
            style={{
              background:
                'linear-gradient(135deg, #080c1e 0%, #1a0e3a 100%)',
            }}
          >
            {/* Background Grid */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(108,59,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(108,59,255,0.08) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }}
            />

            <div className="relative z-10 max-w-2xl">

              <span
                className="mb-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
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
                className="mb-3 text-3xl font-bold text-white"
                style={{
                  fontFamily: 'Outfit, sans-serif',
                }}
              >
                Everything you need
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
   )}