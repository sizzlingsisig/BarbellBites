// frontend/src/components/SideBarNavSection.tsx
import { Divider, Stack, Text } from '@mantine/core'
import { IconBook2, IconHeart } from '@tabler/icons-react'
import NavButton from './NavButton'
import { ROUTE_PATHS } from '../router/routes'

type SidebarNavSectionProps = {
  userEmail?: string
}

export default function SidebarNavSection({ userEmail }: SidebarNavSectionProps) {
  return (
    <div className="mb-4">
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
            {userEmail ?? 'Guest'}
          </Text>
        </div>
      </div>

      {/* Nav buttons */}
      <Stack gap="xs">
        <NavButton to={ROUTE_PATHS.RECIPES} icon={<IconBook2 size={15} />} label="Recipes" variant="ghost" />
        <NavButton to={ROUTE_PATHS.MY_RECIPES} icon={<IconBook2 size={15} />} label="My Recipes" variant="ghost" />
        <NavButton to={ROUTE_PATHS.FAVORITES} icon={<IconHeart size={15} />} label="Favorites" variant="ghost" />
      </Stack>

      {/* ✅ Strong separation between Nav and Filters */}
      <Divider
        my="md"
        style={{
          borderColor: 'rgba(255,255,255,0.07)',
        }}
      />

      {/* Optional: a tiny hint label for clarity */}
      <Text
        size="xs"
        style={{
          color: 'rgba(255,255,255,0.35)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontWeight: 700,
          marginBottom: '6px',
        }}
      >
        Refine results
      </Text>
    </div>
  )
}