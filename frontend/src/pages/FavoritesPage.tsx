import { Badge, Card, Group, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router-dom'

const favoriteRecipes = [
	{ id: 'salmon-bowl', name: 'Salmon Macro Bowl', mealType: 'Dinner' },
	{ id: 'high-protein-wrap', name: 'High-Protein Chicken Wrap', mealType: 'Lunch' },
]

function FavoritesPage() {
	return (
		<main className="min-h-screen bg-ink font-sans selection:bg-brand-500 selection:text-ink pb-10">
			<div className="mx-auto max-w-5xl px-4 py-8">
				<Stack gap="lg">
					<div>
						<Title order={2} className="text-paper font-bold text-3xl mb-2">Favorite Recipes</Title>
						<Text className="text-paper/70 text-sm">Your saved recipes are listed here.</Text>
					</div>

					<Stack gap="sm">
						{favoriteRecipes.map((recipe) => (
							<Card key={recipe.id} withBorder radius="md" component={Link} to={`/recipes/${recipe.id}`} className="no-underline bg-white/5 border-white/10 text-paper hover:bg-brand-500/10 transition-colors">
								<Group justify="space-between" align="center">
									<Text fw={600} className="text-paper font-bold">{recipe.name}</Text>
									<Badge variant="light" className="bg-brand-500/10 text-brand-400 border-brand-500/20">{recipe.mealType}</Badge>
								</Group>
							</Card>
						))}
					</Stack>
				</Stack>
			</div>
		</main>
	)
}

export default FavoritesPage