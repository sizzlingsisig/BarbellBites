import axios from './axios';

export const getRecipes = async () => {
	const response = await axios.get('/recipes');
	return response.data;
};

export const getRecipeById = async (id: string) => {
	const response = await axios.get(`/recipes/${id}`);
	return response.data;
};

export const createRecipe = async (recipeData: any) => {
	const response = await axios.post('/recipes', recipeData);
	return response.data;
};

export const updateRecipe = async (id: string, recipeData: any) => {
	const response = await axios.put(`/recipes/${id}`, recipeData);
	return response.data;
};

export const deleteRecipe = async (id: string) => {
	const response = await axios.delete(`/recipes/${id}`);
	return response.data;
};

export const getUserRecipes = async () => {
	const response = await axios.get('/recipes/mine');
	return response.data;
};