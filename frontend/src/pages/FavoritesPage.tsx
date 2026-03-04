import { useEffect, useState } from 'react'
import { Badge, Card, Group, Loader, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router-dom'
import { getFavorites } from '../api/favoritesApi'

type FavoriteRecipe = {
  _id: string
  slug: string
  title: string
  mealTypes?: string[]
  visibility?: 'public' | 'private' | 'unlisted'
}

type FavoriteItem = {
  _id: string
  recipeId?: FavoriteRecipe
}

function FavoritesPage() {
	const [favorites, setFavorites] = useState<FavoriteItem[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

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

	const favoriteRecipes = favorites
		.map((favorite) => favorite.recipeId)
		.filter((recipe): recipe is FavoriteRecipe => Boolean(recipe && recipe.slug && recipe.title))
		.map((recipe) => ({
			id: recipe.slug,
			name: recipe.title,
			mealType: recipe.mealTypes?.[0] ?? recipe.visibility ?? 'Recipe',
		}))

	return (
		<div className="mx-auto max-w-5xl px-4 py-8">
			<Stack gap="lg">
				<div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
					<Text className="text-paper font-black uppercase tracking-[0.15em] text-sm mb-3">
						Barbell <span className="text-brand-500">Bites</span>
					</Text>
					<Title order={2} className="text-paper font-bold text-3xl mb-2">Favorite Recipes</Title>
					<Text className="text-paper/70 text-sm">Your saved recipes are listed here.</Text>
				</div>

				<Stack gap="sm">
					{loading && (
						<div className="py-6 flex items-center justify-center">
							<Loader size="sm" />
						</div>
					)}

					{!loading && error && (
						<Text className="text-red-300 text-sm">{error}</Text>
					)}

					{!loading && !error && favoriteRecipes.length === 0 && (
						<Text className="text-paper/70 text-sm">No favorite recipes yet.</Text>
					)}

					{favoriteRecipes.map((recipe) => (
						<Card
							key={recipe.id}
							withBorder
							radius="lg"
							component={Link}
							to={`/recipes/${recipe.id}`}
							className="no-underline text-paper transition-all duration-200 relative overflow-hidden active:scale-[0.98] active:translate-y-px"
							style={{
								background: 'rgba(255,255,255,0.045)',
								backdropFilter: 'blur(24px) saturate(180%)',
								WebkitBackdropFilter: 'blur(24px) saturate(180%)',
								border: '1px solid rgba(255,255,255,0.09)',
								boxShadow: '0 8px 32px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.06)',
							}}
							onMouseDown={e => {
								e.currentTarget.style.boxShadow = `0 2px 12px rgba(0,0,0,0.5), 0 0 0 3px rgba(0,200,150,0.12), inset 0 2px 6px rgba(0,0,0,0.3)`;
								e.currentTarget.style.borderColor = 'rgba(0,200,150,0.6)';
							}}
							onMouseUp={e => {
								e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.06)';
								e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)';
							}}
							onMouseLeave={e => {
								e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.06)';
								e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)';
							}}
						>
							<Group justify="space-between" align="center">
								<Text fw={600} className="text-paper font-bold">{recipe.name}</Text>
								<Badge variant="light" className="bg-brand-500/10 text-brand-400 border-brand-500/20">{recipe.mealType}</Badge>
							</Group>
						</Card>
					))}
				</Stack>
			</Stack>
		</div>
	)
}

export default FavoritesPage