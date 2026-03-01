import { Grid, Text, Title } from '@mantine/core'
import { RecipeCard } from '../components/RecipeCard'

const recipes = [
  { id: 'anabolic-oats', name: 'Anabolic Oats', mealType: 'Breakfast', goal: 'Muscle Gain' },
  { id: 'high-protein-wrap', name: 'High-Protein Chicken Wrap', mealType: 'Lunch', goal: 'Weight Loss' },
  { id: 'salmon-bowl', name: 'Salmon Macro Bowl', mealType: 'Dinner', goal: 'Heart Health' },
]

function RecipesPage() {
	return (
		<main className="min-h-screen bg-ink font-sans selection:bg-brand-500 selection:text-ink pb-10">
			<div className="mx-auto max-w-6xl px-4 py-8">
				<div className="mb-6">
					<Title order={2} className="text-paper font-bold text-3xl mb-2">Recipes</Title>
					<Text className="text-paper/70 text-sm">Browse recipes and open any card to view details.</Text>
				</div>
				<Grid gutter="md">
					{recipes.map((recipe) => (
						<Grid.Col key={recipe.id} span={{ base: 12, sm: 6, md: 4 }}>
							<RecipeCard {...recipe} />
						</Grid.Col>
					))}
				</Grid>
			</div>
		</main>
	)
}

export default RecipesPage