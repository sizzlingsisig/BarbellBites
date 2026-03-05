import { useEffect, useState } from 'react'
import { ActionIcon, Loader, Stack, Text, Title, Grid } from '@mantine/core'
import { IconHeartFilled } from '@tabler/icons-react'
import { RecipeCard } from '../components/RecipeCard'
import { getFavorites, removeFavorite, type FavoriteItem, type FavoriteRecipe } from '../api/favoritesApi'
import { notifyError, notifySuccess } from '../services/notify'

function FavoritesPage() {
	const [favorites, setFavorites] = useState<FavoriteItem[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [removingId, setRemovingId] = useState<string | null>(null)

	useEffect(() => {
		const loadFavorites = async () => {
			try {
				setLoading(true)
				setError('')
				const data = await getFavorites()
				setFavorites(Array.isArray(data) ? (data as FavoriteItem[]) : [])
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : 'Failed to load favorites'
				setError(message)
			} finally {
				setLoading(false)
			}
		}

		void loadFavorites()
	}, [])

	const handleRemoveFavorite = async (recipeId: string, recipeTitle: string) => {
		try {
			setRemovingId(recipeId)
			await removeFavorite(recipeId)
			setFavorites((prev) => prev.filter((item) => item.recipeId?._id !== recipeId))
			notifySuccess({
				title: 'Removed from Favorites',
				message: `${recipeTitle} was removed from favorites.`,
			})
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Failed to remove favorite'
			notifyError({
				title: 'Favorites Failed',
				message,
			})
		} finally {
			setRemovingId(null)
		}
	}

	const favoriteRecipes = favorites
		.map((favorite) => favorite.recipeId)
		.filter((recipe): recipe is FavoriteRecipe => Boolean(recipe && recipe.slug && recipe.title))
		.map((recipe) => ({
			id: recipe.slug,
			recipeId: recipe._id,
			name: recipe.title,
			description: recipe.description,
			image: recipe.image,
			mealType: recipe.mealTypes?.[0] ?? recipe.visibility ?? 'Recipe',
			goal: recipe.diets?.[0] ?? recipe.cuisines?.[0] ?? 'General',
			visibility: recipe.visibility ?? 'public',
			totalTime: recipe.totalTime,
			servings: recipe.servings,
			calories: recipe.nutritionPerServing?.calories,
		}))

	return (
		<div className="h-full flex flex-col gap-6">
			<div
				className="relative rounded-2xl overflow-hidden p-6"
				style={{
					background: 'rgba(255,255,255,0.04)',
					backdropFilter: 'blur(32px) saturate(180%)',
					WebkitBackdropFilter: 'blur(32px) saturate(180%)',
					border: '1px solid rgba(255,255,255,0.09)',
					boxShadow: '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
				}}
			>
				<div
					className="absolute top-0 left-8 right-8 h-px"
					style={{ background: 'linear-gradient(90deg, transparent, rgba(0,200,150,0.5), transparent)' }}
				/>

				<div
					className="absolute -top-10 -right-10 w-48 h-48 rounded-full pointer-events-none"
					style={{ background: 'radial-gradient(circle, rgba(0,200,150,0.12) 0%, transparent 70%)', filter: 'blur(30px)' }}
				/>

				<div className="relative z-10 flex items-end justify-between">
					<div>
						<Text
							size="xs"
							style={{
								color: '#00c896',
								fontWeight: 700,
								letterSpacing: '0.14em',
								textTransform: 'uppercase',
								marginBottom: '6px',
							}}
						>
							<span>Barbell Bites</span>
						</Text>
						<Title
							order={2}
							style={{
								color: 'rgba(255,255,255,0.95)',
								fontWeight: 800,
								fontSize: '1.75rem',
								letterSpacing: '-0.02em',
								lineHeight: 1.2,
								marginBottom: '6px',
							}}
						>
							Favorite Recipes
						</Title>
						<Text size="sm" style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.01em' }}>
							Your saved recipes are listed here.
						</Text>
					</div>

					<div
						className="flex items-center gap-2 px-4 py-2 rounded-xl"
						style={{
							background: 'rgba(0,200,150,0.08)',
							border: '1px solid rgba(0,200,150,0.2)',
						}}
					>
						<div
							className="w-1.5 h-1.5 rounded-full"
							style={{ background: '#00c896', boxShadow: '0 0 6px #00c896' }}
						/>
						<Text
							size="xs"
							style={{ color: '#1DDFBD', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}
						>
							{favoriteRecipes.length} Favorites
						</Text>
					</div>
				</div>
			</div>

			<Grid gutter="md" className="flex-1">
				{loading && (
					<Grid.Col span={12}>
						<div className="py-6 flex items-center justify-center">
							<Loader size="sm" />
						</div>
					</Grid.Col>
				)}

				{!loading && error && (
					<Grid.Col span={12}>
						<Text c="red.5">{error}</Text>
					</Grid.Col>
				)}

				{!loading && !error && favoriteRecipes.length === 0 && (
					<Grid.Col span={12}>
						<Text c="dimmed">No favorite recipes yet.</Text>
					</Grid.Col>
				)}

				{favoriteRecipes.map((recipe) => (
					<Grid.Col key={recipe.id} span={{ base: 12, sm: 6, md: 4 }}>
						<RecipeCard
							id={recipe.id}
							name={recipe.name}
							description={recipe.description}
							image={recipe.image}
							mealType={recipe.mealType}
							goal={recipe.goal}
							visibility={recipe.visibility}
							totalTime={recipe.totalTime}
							servings={recipe.servings}
							calories={recipe.calories}
							actionMenu={
								<ActionIcon
									variant="subtle"
									color="red"
									aria-label="Remove favorite"
									loading={removingId === recipe.recipeId}
									onClick={() => {
										void handleRemoveFavorite(recipe.recipeId, recipe.name)
									}}
								>
									<IconHeartFilled size={16} />
								</ActionIcon>
							}
						/>
					</Grid.Col>
				))}
			</Grid>
		</div>
	)
}

export default FavoritesPage