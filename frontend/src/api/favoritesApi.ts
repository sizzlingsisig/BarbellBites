import api from './axios'

export type FavoriteRecipe = {
	_id: string
	slug: string
	title: string
	description?: string
	mealTypes?: string[]
	visibility?: 'public' | 'private' | 'unlisted'
	diets?: string[]
	cuisines?: string[]
	totalTime?: number
	servings?: number
	nutritionPerServing?: {
		calories: number
		protein: number
		carbs: number
		fats: number
	}
}

export type FavoriteItem = {
	_id: string
	recipeId?: FavoriteRecipe
}

export const getFavorites = async () => {
	const response = await api.get<FavoriteItem[]>('/favorites')
	return response.data
}

export const addFavorite = async (recipeId: string) => {
	const response = await api.post(`/favorites/${recipeId}`)
	return response.data
}

export const removeFavorite = async (recipeId: string) => {
	const response = await api.delete(`/favorites/${recipeId}`)
	return response.data
}