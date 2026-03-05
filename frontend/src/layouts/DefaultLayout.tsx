// frontend/src/layouts/DefaultLayout.tsx
import { Button } from '@mantine/core'
import { IconLogout } from '@tabler/icons-react'
import type { PropsWithChildren } from 'react'
import { useAuthStore } from '../store/authStore'
import { notifyError, notifySuccess } from '../services/notify'
import SidebarFilterSearchSection from '../components/SidebarFilterSearchSection'
import SidebarNavSection from '../components/SideBarNavSection'

function DefaultLayout({ children }: PropsWithChildren) {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = async () => {
    try {
      await logout()
      notifySuccess({
        title: 'Logged Out',
        message: 'You have been signed out successfully.',
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to log out. Please try again.'
      notifyError({
        title: 'Logout Failed',
        message,
      })
    }
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a0f0d 0%, #0d1a15 40%, #091210 100%)' }}
    >
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute -left-40 -top-40 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #00c896 0%, transparent 70%)',
            filter: 'blur(80px)',
            height: '500px',
            width: '500px',
          }}
        />
        <div
          className="absolute -right-20 top-1/3 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, #00b37d 0%, transparent 70%)',
            filter: 'blur(90px)',
            height: '400px',
            width: '400px',
          }}
        />
        <div
          className="absolute bottom-0 left-1/3 rounded-full"
          style={{
            background: 'radial-gradient(circle, #00ffa3 0%, transparent 70%)',
            filter: 'blur(100px)',
            height: '350px',
            width: '350px',
            opacity: 0.07,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,200,150,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,150,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 grid min-h-screen p-4 gap-3" style={{ gridTemplateColumns: '280px 1fr' }}>
        {/* ── Sidebar ── */}
        <aside
          className="relative flex flex-col rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(32px) saturate(180%)',
            WebkitBackdropFilter: 'blur(32px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)',
          }}
        >
          <div
            className="absolute top-0 left-6 right-6 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(0,200,150,0.6), transparent)' }}
          />

          <div className="flex flex-col h-full p-5 gap-0">
            {/* Navigation Section */}
            <SidebarNavSection userEmail={user?.email} />

            {/* Search + Filters Section */}
            <div className="flex-1 min-h-0">
              {/* IMPORTANT:
                  Your multi-select URL param logic + correct taxonomy values
                  should live inside SidebarFilterSearchSection now.
                  (diet=low-carb,keto etc.) */}
              <SidebarFilterSearchSection />
            </div>

            {/* Logout */}
            <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <Button
                fullWidth
                leftSection={<IconLogout size={14} />}
                onClick={() => void handleLogout()}
                styles={{
                  root: {
                    background: 'rgba(255,255,255,0.04)',
                    color: 'rgba(255,255,255,0.45)',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    border: '1px solid rgba(255,255,255,0.07)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'rgba(255,80,80,0.08)',
                      color: 'rgba(255,120,120,0.85)',
                      border: '1px solid rgba(255,80,80,0.2)',
                    },
                  },
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <section
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(24px) saturate(160%)',
            WebkitBackdropFilter: 'blur(24px) saturate(160%)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          <div
            className="absolute top-0 left-12 right-12 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(0,200,150,0.3), transparent)' }}
          />
          <div className="h-full w-full p-6">{children}</div>
        </section>
      </div>
    </div>
  )
}

export default DefaultLayout