import api from './axios'

export const getCurrentProfile = async () => {
	const response = await api.get('/auth/test')
	return response.data
}

export const updateGoals = async (payload: { targetCalories?: number; targetProtein?: number }) => {
	const response = await api.patch('/auth/goals', payload)
	return response.data
}