import { Badge, Group, Stack, Text } from '@mantine/core'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import PLACEHOLDER_IMAGE from './PlaceholderImage'

interface RecipeCardProps {
  id: string
  name: string
  description?: string
  image?: string
  mealType: string
  goal: string
  visibility: 'public' | 'private' | 'unlisted'
  totalTime?: number
  servings?: number
  calories?: number
  actionMenu?: ReactNode
}

/** Contrast tokens for cards */
const COLOR = {
  title: 'rgba(255,255,255,0.92)',
  description: 'rgba(255,255,255,0.72)', // ✅ brighter
  meta: 'rgba(255,255,255,0.72)', // ✅ brighter
  metaLabel: 'rgba(255,255,255,0.62)',
  border: 'rgba(255,255,255,0.10)',
  divider: 'rgba(255,255,255,0.08)',
  cardBg: 'rgba(255,255,255,0.04)',
  tealText: '#1DDFBD',
  tealBg: 'rgba(0,200,150,0.14)',
  tealBorder: 'rgba(0,200,150,0.32)',
  neutralText: 'rgba(255,255,255,0.78)', // ✅ key fix: brighter tag text
  neutralBg: 'rgba(255,255,255,0.08)', // ✅ key fix: brighter tag bg
  neutralBorder: 'rgba(255,255,255,0.16)',
}

export function RecipeCard({
  id,
  name,
  description,
  image,
  mealType,
  goal,
  visibility,
  totalTime,
  servings,
  calories,
  actionMenu,
}: RecipeCardProps) {
  return (
    <Link to={`/recipes/${id}`} className="no-underline group block">
      <div
        className="relative rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          background: COLOR.cardBg,
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: `1px solid ${COLOR.border}`,
          boxShadow: '0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {actionMenu ? (
          <div
            className="absolute top-2 right-2 z-20"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
            }}
          >
            {actionMenu}
          </div>
        ) : null}

        {/* Top teal shimmer line */}
        <div
          className="absolute top-0 left-6 right-6 h-px z-10"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,200,150,0.50), transparent)' }}
        />

        {/* Hover glow overlay */}
        <div
          className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,200,150,0.10) 0%, transparent 70%)' }}
        />

        {/* Image area */}
        <div className="relative w-full h-44 flex items-center justify-center overflow-hidden" style={{ background: 'rgba(0,0,0,0.25)' }}>
          {/* Subtle inner grid */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0,200,150,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,150,1) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />
          {/* Corner accent */}
          <div className="absolute bottom-0 left-0 right-0 h-16" style={{ background: 'linear-gradient(to top, rgba(0,200,150,0.06), transparent)' }} />

          <img
            src={image || PLACEHOLDER_IMAGE}
            alt={name}
            className="relative z-10 w-full h-full object-cover opacity-75 group-hover:opacity-95 transition-opacity duration-300"
            onError={(event) => {
              event.currentTarget.src = PLACEHOLDER_IMAGE
            }}
          />
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: COLOR.divider }} />

        {/* Content */}
        <Stack gap="sm" className="p-4 relative z-10">
          <Text
            fw={800}
            size="sm"
            style={{
              color: COLOR.title,
              letterSpacing: '0.01em',
              lineHeight: 1.35,
            }}
          >
            {name}
          </Text>

          {description ? (
            <Text size="xs" style={{ color: COLOR.description, lineHeight: 1.45 }} lineClamp={2}>
              {description}
            </Text>
          ) : null}

          {/* Tags */}
          <Group gap="xs">
            {/* Accent tag (good already) */}
            <Badge
              size="xs"
              style={{
                background: COLOR.tealBg,
                border: `1px solid ${COLOR.tealBorder}`,
                color: COLOR.tealText,
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontSize: '0.6rem',
                backdropFilter: 'blur(10px)',
              }}
            >
              {mealType}
            </Badge>

            {/* Neutral tags (FIXED: brighter bg + brighter text) */}
            <Badge
              size="xs"
              style={{
                background: COLOR.neutralBg,
                border: `1px solid ${COLOR.neutralBorder}`,
                color: COLOR.neutralText,
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontSize: '0.6rem',
                backdropFilter: 'blur(10px)',
              }}
            >
              {goal}
            </Badge>

            <Badge
              size="xs"
              style={{
                background: COLOR.neutralBg,
                border: `1px solid ${COLOR.neutralBorder}`,
                color: COLOR.neutralText,
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontSize: '0.6rem',
                backdropFilter: 'blur(10px)',
              }}
            >
              {visibility}
            </Badge>
          </Group>

          {/* Metadata (FIXED: brighter) */}
          <Group gap="md">
            <Text size="xs" style={{ color: COLOR.meta }}>
              <span style={{ color: COLOR.metaLabel, fontWeight: 700 }}>Time:</span>{' '}
              {typeof totalTime === 'number' ? `${totalTime} min` : 'N/A'}
            </Text>
            <Text size="xs" style={{ color: COLOR.meta }}>
              <span style={{ color: COLOR.metaLabel, fontWeight: 700 }}>Servings:</span>{' '}
              {typeof servings === 'number' ? servings : 'N/A'}
            </Text>
            <Text size="xs" style={{ color: COLOR.meta }}>
              <span style={{ color: COLOR.metaLabel, fontWeight: 700 }}>kcal:</span>{' '}
              {typeof calories === 'number' ? calories : 'N/A'}
            </Text>
          </Group>
        </Stack>

        {/* Bottom hover border glow */}
        <div
          className="absolute bottom-0 left-4 right-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,200,150,0.55), transparent)' }}
        />
      </div>
    </Link>
  )
}