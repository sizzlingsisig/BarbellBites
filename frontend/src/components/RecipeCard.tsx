import { Badge, Group, Stack, Text } from '@mantine/core'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import PLACEHOLDER_IMAGE from './PlaceholderImage'

interface RecipeCardProps {
  id: string;
  name: string;
  description?: string;
  mealType: string;
  goal: string;
  visibility: 'public' | 'private' | 'unlisted';
  totalTime?: number;
  servings?: number;
  calories?: number;
  actionMenu?: ReactNode;
}

export function RecipeCard({ id, name, description, mealType, goal, visibility, totalTime, servings, calories, actionMenu }: RecipeCardProps) {
  return (
    <Link
      to={`/recipes/${id}`}
      className="no-underline group block"
    >
      <div
        className="relative rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.09)',
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
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,200,150,0.45), transparent)' }}
        />

        {/* Hover glow overlay */}
        <div
          className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,200,150,0.08) 0%, transparent 70%)' }}
        />

        {/* Image area */}
        <div
          className="relative w-full h-44 flex items-center justify-center overflow-hidden"
          style={{ background: 'rgba(0,0,0,0.25)' }}
        >
          {/* Subtle inner grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(rgba(0,200,150,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,150,1) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />
          {/* Corner accent */}
          <div
            className="absolute bottom-0 left-0 right-0 h-16"
            style={{ background: 'linear-gradient(to top, rgba(0,200,150,0.06), transparent)' }}
          />
          <img
            src={PLACEHOLDER_IMAGE}
            alt="Recipe placeholder"
            className="relative z-10 w-14 h-14 object-contain opacity-60 group-hover:opacity-90 transition-opacity duration-300"
            style={{ filter: 'drop-shadow(0 0 12px rgba(0,200,150,0.4))' }}
          />
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

        {/* Content */}
        <Stack gap="sm" className="p-4 relative z-10">
          <Text
            fw={700}
            size="sm"
            style={{
              color: 'rgba(255,255,255,0.9)',
              letterSpacing: '0.01em',
              lineHeight: 1.4,
            }}
          >
            {name}
          </Text>
          {description ? (
            <Text size="xs" style={{ color: 'rgba(255,255,255,0.62)', lineHeight: 1.4 }} lineClamp={2}>
              {description}
            </Text>
          ) : null}
          <Group gap="xs">
            <Badge
              size="xs"
              style={{
                background: 'rgba(0,200,150,0.12)',
                border: '1px solid rgba(0,200,150,0.3)',
                color: '#1DDFBD',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontSize: '0.6rem',
                backdropFilter: 'blur(8px)',
              }}
            >
              {mealType}
            </Badge>
            <Badge
              size="xs"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.5)',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontSize: '0.6rem',
                backdropFilter: 'blur(8px)',
              }}
            >
              {goal}
            </Badge>
            <Badge
              size="xs"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.6)',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontSize: '0.6rem',
                backdropFilter: 'blur(8px)',
              }}
            >
              {visibility}
            </Badge>
          </Group>
          <Group gap="md">
            <Text size="xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Time: {typeof totalTime === 'number' ? `${totalTime} min` : 'N/A'}
            </Text>
            <Text size="xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Servings: {typeof servings === 'number' ? servings : 'N/A'}
            </Text>
            <Text size="xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              kcal: {typeof calories === 'number' ? calories : 'N/A'}
            </Text>
          </Group>
        </Stack>

        {/* Bottom hover border glow */}
        <div
          className="absolute bottom-0 left-4 right-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,200,150,0.5), transparent)' }}
        />
      </div>
    </Link>
  )
}