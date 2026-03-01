import { Badge, Card, Group, Stack, Text } from '@mantine/core'
import { Link } from 'react-router-dom'
import PLACEHOLDER_IMAGE from './PlaceholderImage'

interface RecipeCardProps {
  id: string;
  name: string;
  mealType: string;
  goal: string;
}

export function RecipeCard({ id, name, mealType, goal }: RecipeCardProps) {
  return (
    <Card
      withBorder
      radius="md"
      component={Link}
      to={`/recipes/${id}`}
      className="no-underline bg-white/5 border-white/10 text-paper hover:bg-brand-500/10 transition-colors p-0 overflow-hidden"
    >
      {/* Image Placeholder (future: replace with real image if available) */}
      <div className="w-full h-40 bg-(--color-card-slate) flex items-center justify-center rounded-t-xl overflow-hidden">
        <img src={PLACEHOLDER_IMAGE} alt="Recipe placeholder" className="w-16 h-16 object-contain" />
      </div>
      <Stack gap="sm" className="p-4">
        <Text fw={700} className="text-paper font-bold">{name}</Text>
        <Group gap="xs">
          <Badge variant="light" className="bg-brand-500/10 text-brand-400 border-brand-500/20">{mealType}</Badge>
          <Badge variant="outline" className="border-brand-500 text-brand-500">{goal}</Badge>
        </Group>
      </Stack>
    </Card>
  )
}
