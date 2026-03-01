import { Badge, Container, Group, Stack, Text, Title, Grid, ThemeIcon, Card, ActionIcon } from '@mantine/core'
import PLACEHOLDER_IMAGE from '../components/PlaceholderImage'
import { IconShoppingCart, IconChefHat, IconClock, IconFlame, IconUsers } from '../components/RecipeIcons'
import { Link, useParams } from 'react-router-dom'

// Mock Data - You will eventually fetch this from your backend API
const recipes = {
	'anabolic-oats': {
		title: "Anabolic Oats",
		description: "High-protein oatmeal for muscle gain.",
		prepTime: "5 mins",
		cookTime: "10 mins",
		servings: 1,
		image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2000",
		macros: { calories: 350, protein: 32, carbs: 40, fats: 8 },
		ingredients: [
			{ item: "Rolled Oats", amount: "1/2 cup" },
			{ item: "Whey Protein", amount: "1 scoop" },
			{ item: "Almond Milk", amount: "1 cup" },
			{ item: "Chia Seeds", amount: "1 tbsp" },
			{ item: "Blueberries", amount: "1/4 cup" },
		],
		steps: [
			"Combine oats and almond milk in a pot. Cook until thickened.",
			"Stir in protein powder and chia seeds.",
			"Top with blueberries and enjoy.",
		],
	},
	'high-protein-wrap': {
		title: "High-Protein Chicken Wrap",
		description: "Lean chicken breast wrapped with veggies for weight loss.",
		prepTime: "10 mins",
		cookTime: "10 mins",
		servings: 1,
		image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&q=80&w=2000",
		macros: { calories: 400, protein: 38, carbs: 30, fats: 10 },
		ingredients: [
			{ item: "Chicken Breast", amount: "4 oz" },
			{ item: "Whole Wheat Wrap", amount: "1" },
			{ item: "Lettuce", amount: "1/2 cup" },
			{ item: "Tomato", amount: "2 slices" },
			{ item: "Greek Yogurt", amount: "2 tbsp" },
		],
		steps: [
			"Grill chicken breast and slice.",
			"Layer wrap with lettuce, tomato, chicken, and yogurt.",
			"Roll up and serve.",
		],
	},
	'salmon-bowl': {
		title: "Salmon Macro Bowl",
		description: "Heart-healthy salmon with macro-balanced sides.",
		prepTime: "8 mins",
		cookTime: "12 mins",
		servings: 1,
		image: "https://images.unsplash.com/photo-1464306076886-debede6bbf94?auto=format&fit=crop&q=80&w=2000",
		macros: { calories: 480, protein: 40, carbs: 35, fats: 18 },
		ingredients: [
			{ item: "Salmon Fillet", amount: "5 oz" },
			{ item: "Brown Rice", amount: "1/2 cup" },
			{ item: "Broccoli", amount: "1/2 cup" },
			{ item: "Olive Oil", amount: "1 tsp" },
			{ item: "Lemon", amount: "1 wedge" },
		],
		steps: [
			"Bake salmon fillet with olive oil and lemon.",
			"Steam broccoli and cook rice.",
			"Assemble bowl and serve.",
		],
	},
}

function RecipeDetailPage() {
	const { recipeId } = useParams()
	const recipe = recipes[recipeId as keyof typeof recipes]

	if (!recipe) {
		return (
			<main className="min-h-screen bg-ink font-sans selection:bg-brand-500 selection:text-ink pb-20 flex items-center justify-center">
				<Stack gap="md" align="center">
					<Title order={2} className="text-paper font-bold">Recipe Not Found</Title>
					<Text className="text-paper/70">No recipe found for ID: {recipeId}</Text>
					<ActionIcon component={Link} to="/" variant="subtle" color="gray" radius="xl" size="xl" className="bg-brand-500/10 backdrop-blur-md hover:bg-brand-500 text-paper">
						←
					</ActionIcon>
				</Stack>
			</main>
		)
	}

	return (
		<main className="min-h-screen bg-ink font-sans selection:bg-brand-500 selection:text-ink pb-20">
			{/* HERO SECTION (Image & Title) */}
			<section className="relative w-full h-[40vh] min-h-100">
				<img 
					src={recipe.image || PLACEHOLDER_IMAGE}
					alt={recipe.title}
					className="absolute inset-0 w-full h-full object-cover opacity-60"
					onError={e => { e.currentTarget.src = PLACEHOLDER_IMAGE; }}
				/>
				<div className="absolute inset-0 bg-linear-to-t from-ink via-ink/60 to-transparent"></div>

				<Container size="lg" className="relative z-10 h-full pt-8 pb-12">
					<Grid gutter="md" align="center">
						<Grid.Col span={{ base: 12, md: 2 }} className="flex items-center justify-start">
							<ActionIcon component={Link} to="/" variant="subtle" color="gray" radius="xl" size="xl" className="bg-ink/40 backdrop-blur-md hover:bg-ink/80 text-paper">
								←
							</ActionIcon>
						</Grid.Col>
						<Grid.Col span={{ base: 12, md: 10 }}>
							<Badge color="brand.5" variant="outline" size="lg" className="backdrop-blur-md bg-brand-500/10 border-brand-500 text-brand-500 mb-4">
								{recipe.title}
							</Badge>
							<Title order={1} className="text-paper font-black text-4xl sm:text-5xl md:text-6xl mb-4 leading-tight">
								{recipe.title}
							</Title>
							<Text className="text-paper/80 text-lg max-w-2xl mb-6 leading-relaxed">
								{recipe.description}
							</Text>
							<Grid gutter="xs" className="text-paper/60 font-medium mb-2">
								<Grid.Col span={{ base: 12, sm: 4 }}>
									<Group gap="xs">
										<IconClock size={18} className="inline-block align-middle text-brand-500 mr-1" /> Prep: {recipe.prepTime}
									</Group>
								</Grid.Col>
								<Grid.Col span={{ base: 12, sm: 4 }}>
									<Group gap="xs">
										<IconFlame size={18} className="inline-block align-middle text-brand-500 mr-1" /> Cook: {recipe.cookTime}
									</Group>
								</Grid.Col>
								<Grid.Col span={{ base: 12, sm: 4 }}>
									<Group gap="xs">
										<IconUsers size={18} className="inline-block align-middle text-brand-500 mr-1" /> Serves: {recipe.servings}
									</Group>
								</Grid.Col>
							</Grid>
						</Grid.Col>
					</Grid>
				</Container>
			</section>

			<Container size="lg" className="-mt-8 relative z-20">
				{/* MACROS */}
				<Grid gutter="md" className="mb-12">
					{[{ label: 'Calories', value: recipe.macros.calories, unit: 'kcal', color: 'text-white' },
						{ label: 'Protein', value: recipe.macros.protein, unit: 'g', color: 'text-brand-500' },
						{ label: 'Carbs', value: recipe.macros.carbs, unit: 'g', color: 'text-paper/70' },
						{ label: 'Fats', value: recipe.macros.fats, unit: 'g', color: 'text-paper/70' },
					].map((macro, idx) => (
						<Grid.Col span={{ base: 6, sm: 3 }} key={idx}>
							  <Card radius="lg" className="bg-white/5 backdrop-blur-xl border border-white/10 text-center py-6">
								<Text className="text-paper/50 font-bold uppercase tracking-widest text-xs mb-1">
									{macro.label}
								</Text>
								<Title order={2} className={`${macro.color} font-black text-3xl sm:text-4xl`}>
									{macro.value}<span className="text-lg text-paper/40 ml-1">{macro.unit}</span>
								</Title>
							</Card>
						</Grid.Col>
					))}
				</Grid>

				{/* CONTENT SPLIT (Ingredients Left, Steps Right) */}
				<Grid gutter={40}>
					{/* LEFT COLUMN: INGREDIENTS */}
					<Grid.Col span={{ base: 12, md: 4 }}>
						<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 sticky top-8">
							<Title order={3} className="text-paper font-bold text-2xl mb-6 flex items-center gap-3">
								<IconShoppingCart size={24} className="text-brand-500" /> Ingredients
							</Title>
							<Stack gap="md">
								{recipe.ingredients.map((ing, idx) => (
									<Group key={idx} justify="space-between" wrap="nowrap" className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
										<Text className="text-paper/90 font-medium text-base">{ing.item}</Text>
										<Badge color="brand.5" variant="light" size="lg" className="bg-brand-500/10 text-brand-400 font-bold border border-brand-500/20">
											{ing.amount}
										</Badge>
									</Group>
								))}
							</Stack>
						</div>
					</Grid.Col>

					{/* RIGHT COLUMN: STEPS */}
					<Grid.Col span={{ base: 12, md: 8 }}>
						<div className="p-4 md:p-8">
							<Title order={3} className="text-paper font-bold text-3xl mb-8 flex items-center gap-3">
								<IconChefHat size={28} className="text-brand-500" /> Instructions
							</Title>

							<Stack gap="xl">
								{recipe.steps.map((step, idx) => (
									<Group key={idx} align="flex-start" wrap="nowrap" gap="lg" className="group">
										<ThemeIcon 
											size={48} 
											radius="xl" 
											className="bg-brand-500/10 text-brand-500 font-black text-xl border border-brand-500/30 group-hover:bg-brand-500 group-hover:text-ink transition-colors duration-300"
										>
											{idx + 1}
										</ThemeIcon>
										<div className="flex-1 mt-1">
											<Text className="text-paper font-bold text-lg mb-2">Step {idx + 1}</Text>
											<Text className="text-paper/70 text-lg leading-relaxed">
												{step}
											</Text>
										</div>
									</Group>
								))}
							</Stack>
						</div>
					</Grid.Col>
				</Grid>
			</Container>
		</main>
	)
}

export default RecipeDetailPage