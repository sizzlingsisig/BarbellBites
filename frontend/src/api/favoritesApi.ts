import api from './axios'

export const getFavorites = async () => {
	const response = await api.get('/favorites')
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