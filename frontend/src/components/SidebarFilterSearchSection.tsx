// frontend/src/components/sidebar/SidebarFilterSearchSection.tsx
import { Accordion, Checkbox, Group, Stack, Text, TextInput, Divider } from '@mantine/core'
import { IconSearch, IconChevronDown } from '@tabler/icons-react'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ROUTE_PATHS } from '../router/routes'

function toParamValue(label: string) {
  return label.trim().toLowerCase().replace(/\s+/g, '-')
}

function splitCSV(value: string | null) {
  if (!value) return []
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
}

export default function SidebarFilterSearchSection() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') ?? '')

  // keep input synced with URL for back/forward
  useEffect(() => {
    setSearchTerm(searchParams.get('search') ?? '')
  }, [searchParams])

  // Debounce searchTerm -> URL
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
          next.delete('page')
          return next
        },
        { replace: true },
      )

      // If searching on a non-list page, bounce to Recipes
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

  // ✅ Multi-select per filter key (CSV in URL)
  const handleFilterToggle = (paramKey: string, value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        const currentValues = splitCSV(next.get(paramKey))
        const isActive = currentValues.includes(value)

        const updated = isActive
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value]

        if (updated.length === 0) next.delete(paramKey)
        else next.set(paramKey, updated.join(','))

        next.delete('page')
        return next
      },
      { replace: true },
    )

    // If filtering while not on list pages, bounce to Recipes
    if (
      location.pathname !== ROUTE_PATHS.RECIPES &&
      location.pathname !== ROUTE_PATHS.MY_RECIPES &&
      location.pathname !== ROUTE_PATHS.FAVORITES
    ) {
      const nextParams = new URLSearchParams(searchParams)
      nextParams.delete('page')

      navigate({
        pathname: ROUTE_PATHS.RECIPES,
        search: `?${nextParams.toString()}`,
      })
    }
  }

  const clearAllFilters = () => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.delete('search')
        next.delete('diet')
        next.delete('mealType')
        next.delete('cuisine')
        next.delete('maxPrepTime')
        next.delete('maxTotalTime')
        next.delete('page')
        return next
      },
      { replace: true },
    )
    setSearchTerm('')

    if (
      location.pathname !== ROUTE_PATHS.RECIPES &&
      location.pathname !== ROUTE_PATHS.MY_RECIPES &&
      location.pathname !== ROUTE_PATHS.FAVORITES
    ) {
      navigate({ pathname: ROUTE_PATHS.RECIPES })
    }
  }

  const filterGroups = useMemo(
    () => [
      {
        label: 'Meal Type',
        paramKey: 'mealType',
        items: ['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((label) => ({
          label,
          value: toParamValue(label),
        })),
      },
      {
        label: 'Dietary Preference',
        paramKey: 'diet',
        items: ['High Protein', 'Low Carb', 'Keto', 'Vegetarian'].map((label) => ({
          label,
          value: toParamValue(label),
        })),
      },
      {
        label: 'Cuisine',
        paramKey: 'cuisine',
        items: ['American', 'Mexican', 'Italian', 'Asian'].map((label) => ({
          label,
          value: toParamValue(label),
        })),
      },
    ],
    [],
  )

  const activeCountFor = (paramKey: string) => splitCSV(searchParams.get(paramKey)).length

  const hasAnyFilter =
    Boolean(searchParams.get('search')) ||
    activeCountFor('mealType') > 0 ||
    activeCountFor('diet') > 0 ||
    activeCountFor('cuisine') > 0 ||
    Boolean(searchParams.get('maxPrepTime')) ||
    Boolean(searchParams.get('maxTotalTime'))

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Pinned header: Search + Clear */}
      <div className="flex flex-col gap-3">
        <TextInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
          placeholder="Search recipes…"
          leftSection={<IconSearch size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />}
          size="sm"
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

        <Group justify="space-between" align="center">
          <Text size="xs" style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Filters
          </Text>

          <Text
            size="xs"
            role="button"
            onClick={clearAllFilters}
            style={{
              cursor: hasAnyFilter ? 'pointer' : 'default',
              color: hasAnyFilter ? 'rgba(0,200,150,0.9)' : 'rgba(255,255,255,0.25)',
              textDecoration: hasAnyFilter ? 'underline' : 'none',
              textUnderlineOffset: '3px',
              userSelect: 'none',
            }}
          >
            Clear all
          </Text>
        </Group>

        {/* Strong separation from nav (inside this section) */}
        <Divider style={{ borderColor: 'rgba(255,255,255,0.07)' }} />
      </div>

      {/* Scrollable filters list */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 pt-3" style={{ scrollbarWidth: 'none' }}>
        <Accordion
          multiple
          defaultValue={['Meal Type']} // open one by default (optional)
          variant="separated"
          chevron={<IconChevronDown size={14} />}
          styles={{
            item: {
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '12px',
              overflow: 'hidden',
            },
            control: {
              background: 'rgba(255,255,255,0.02)',
              '&:hover': { background: 'rgba(255,255,255,0.04)' },
            },
            label: { padding: '10px 10px' },
            chevron: { color: 'rgba(255,255,255,0.5)' },
            panel: { padding: '10px 12px 12px' },
          }}
        >
          {filterGroups.map((group) => {
            const activeValues = splitCSV(searchParams.get(group.paramKey))
            const count = activeValues.length

            return (
              <Accordion.Item key={group.paramKey} value={group.label}>
                <Accordion.Control>
                  <Group justify="space-between" align="center" w="100%">
                    <Text
                      size="xs"
                      style={{
                        color: 'rgba(255,255,255,0.8)',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        fontSize: '0.7rem',
                      }}
                    >
                      {group.label}
                    </Text>

                    {count > 0 && (
                      <Text
                        size="xs"
                        style={{
                          color: '#00c896',
                          fontWeight: 800,
                          letterSpacing: '0.05em',
                        }}
                      >
                        ({count})
                      </Text>
                    )}
                  </Group>
                </Accordion.Control>

                <Accordion.Panel>
                  <Stack gap={6}>
                    {group.items.map((item) => (
                      <Checkbox
                        key={item.value}
                        label={item.label}
                        size="xs"
                        color="brand"
                        checked={activeValues.includes(item.value)}
                        onChange={() => handleFilterToggle(group.paramKey, item.value)}
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
                </Accordion.Panel>
              </Accordion.Item>
            )
          })}
        </Accordion>
      </div>
    </div>
  )
}