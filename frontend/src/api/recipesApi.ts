import api from './axios'

export type RecipeMutationPayload = {
  title: string
  description?: string
  visibility: 'public' | 'private'
  prepTime?: number
  cookTime?: number
  totalTime?: number
  servings?: number
  servingSize?: string
  diets?: string[]
  mealTypes?: string[]
  cuisines?: string[]
  ingredients: Array<{
    name: string
    amount: string
    unit?: string
  }>
  instructions: string[]
  nutrition: {
    calories: number
    protein: number
    carbs: number
    fats: number
  }
}

export const getRecipes = async () => {
  const response = await api.get('/recipes')
  return response.data
}

export const getRecipeById = async (slug: string) => {
  const response = await api.get(`/recipes/${slug}`)
  return response.data
}

export const createRecipe = async (recipeData: RecipeMutationPayload) => {
  const response = await api.post('/recipes', recipeData)
  return response.data
}

export const updateRecipe = async (slug: string, recipeData: Partial<RecipeMutationPayload>) => {
  const response = await api.put(`/recipes/${slug}`, recipeData)
  return response.data
}

export const deleteRecipe = async (slug: string) => {
  const response = await api.delete(`/recipes/${slug}`)
  return response.data
}

export const getUserRecipes = async () => {
  const response = await api.get('/recipes/mine')
  return response.data
}