// frontend/src/layouts/DefaultLayout.tsx
import { Button, Checkbox, Divider, Stack, Text, TextInput } from '@mantine/core'
import { IconSearch, IconLogout, IconHeart, IconBook2 } from '@tabler/icons-react'
import { useEffect, useState, type PropsWithChildren } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import NavButton from '../components/NavButton'
import { ROUTE_PATHS } from '../router/routes'
import { useAuthStore } from '../store/authStore'
import { notifyError, notifySuccess } from '../services/notify'

function DefaultLayout({ children }: PropsWithChildren) {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()

  // Local input state (controlled)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') ?? '')

  // Keep input in sync with URL (back/forward, external param changes)
  useEffect(() => {
    setSearchTerm(searchParams.get('search') ?? '')
  }, [searchParams])

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

  // Debounce: write searchTerm -> URL
  useEffect(() => {
    const t = window.setTimeout(() => {
      const desired = searchTerm.trim()
      const existing = searchParams.get('search') ?? ''

      if (desired === existing) return

      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)

          if (desired) next.set('search', desired)
          else next.delete('search')

          // reset paging when query changes
          next.delete('page')

          return next
        },
        { replace: true },
      )

      // Optional UX: If user searches while not on list pages, redirect to recipes
      if (
        desired &&
        location.pathname !== ROUTE_PATHS.RECIPES &&
        location.pathname !== ROUTE_PATHS.MY_RECIPES &&
        location.pathname !== ROUTE_PATHS.FAVORITES
      ) {
        const nextParams = new URLSearchParams(searchParams)
        nextParams.set('search', desired)
        nextParams.delete('page')

        navigate({
          pathname: ROUTE_PATHS.RECIPES,
          search: `?${nextParams.toString()}`,
        })
      }
    }, 500)

    return () => window.clearTimeout(t)
  }, [searchTerm, searchParams, setSearchParams, navigate, location.pathname])

  // Single-select toggle (matches backend: diet/mealType/cuisine = string)
  const handleFilterToggle = (paramKey: string, value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        const current = next.get(paramKey)

        if (current === value) next.delete(paramKey)
        else next.set(paramKey, value)

        // reset paging when filters change
        next.delete('page')

        return next
      },
      { replace: true },
    )
  }

  const filterGroups = [
    {
      label: 'Meal Type',
      paramKey: 'mealType',
      items: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
    },
    {
      label: 'Dietary Preference',
      paramKey: 'diet',
      items: ['High Protein', 'Low Carb', 'Keto', 'Vegetarian'],
    },
    {
      label: 'Cuisine',
      paramKey: 'cuisine',
      items: ['American', 'Mexican', 'Italian', 'Asian'],
    },
  ] as const

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
            {/* Brand */}
            <div className="mb-5">
              <Text className="font-black uppercase tracking-[0.15em] text-lg" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Barbell <span style={{ color: '#00c896' }}>Bites</span>
              </Text>
              <div
                className="mt-1.5 flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{
                  background: 'rgba(0,200,150,0.08)',
                  border: '1px solid rgba(0,200,150,0.15)',
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#00c896', boxShadow: '0 0 6px #00c896' }} />
                <Text size="xs" style={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '0.04em' }}>
                  {user?.email ?? 'Guest'}
                </Text>
              </div>
            </div>

            {/* Nav buttons */}
            <Stack gap="xs" mb="md">
              <NavButton to={ROUTE_PATHS.RECIPES} icon={<IconBook2 size={15} />} label="Recipes" variant="ghost" />
              <NavButton to={ROUTE_PATHS.MY_RECIPES} icon={<IconBook2 size={15} />} label="My Recipes" variant="ghost" />
              <NavButton to={ROUTE_PATHS.FAVORITES} icon={<IconHeart size={15} />} label="Favorites" variant="ghost" />
            </Stack>

            <Divider mb="md" style={{ borderColor: 'rgba(255,255,255,0.07)' }} />

            {/* Search */}
            <TextInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.currentTarget.value)}
              placeholder="Search recipes…"
              leftSection={<IconSearch size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />}
              size="sm"
              mb="md"
              styles={{
                input: {
                  background: 'rgba(255,255,255,0.04)',
                  color: 'rgba(255,255,255,0.85)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  backdropFilter: 'blur(8px)',
                  fontSize: '0.8rem',
                  '&::placeholder': { color: 'rgba(255,255,255,0.3)' },
                },
              }}
            />

            {/* Filters */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-5" style={{ scrollbarWidth: 'none' }}>
              {filterGroups.map((group) => {
                const active = searchParams.get(group.paramKey) // single select

                return (
                  <div key={group.label}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-px flex-1" style={{ background: 'rgba(0,200,150,0.2)' }} />
                      <Text
                        size="xs"
                        style={{
                          color: '#00c896',
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          fontSize: '0.65rem',
                        }}
                      >
                        {group.label}
                      </Text>
                      <div className="h-px flex-1" style={{ background: 'rgba(0,200,150,0.2)' }} />
                    </div>

                    <Stack gap={6}>
                      {group.items.map((item) => (
                        <Checkbox
                          key={item}
                          label={item}
                          size="xs"
                          color="brand"
                          checked={active === item}
                          onChange={() => handleFilterToggle(group.paramKey, item)}
                          styles={{
                            label: {
                              color: 'rgba(255,255,255,0.65)',
                              fontWeight: 500,
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                            },
                            input: {
                              background: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.15)',
                            },
                          }}
                        />
                      ))}
                    </Stack>
                  </div>
                )
              })}
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