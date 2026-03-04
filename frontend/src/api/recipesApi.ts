import api from './axios'

export type RecipeMutationPayload = {
  title: string
  description?: string
  image?: string
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

export type RecipeTaxonomy = {
  diets: string[]
  mealTypes: string[]
  cuisines: string[]
}

export type RecipeListItem = {
  _id: string
  slug: string
  title: string
  description?: string
  image?: string
  visibility: 'public' | 'private' | 'unlisted'
  diets?: string[]
  mealTypes?: string[]
  cuisines?: string[]
  prepTime?: number
  cookTime?: number
  totalTime?: number
  servings?: number
  nutritionPerServing?: {
    calories: number
    protein: number
    carbs: number
    fats: number
  }
}

export type PaginatedRecipesResponse = {
  items: RecipeListItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const getRecipes = async (params?: { page?: number; limit?: number; search?: string }) => {
  const response = await api.get<PaginatedRecipesResponse>('/recipes', { params })
  return response.data
}

export const getRecipeById = async (slug: string) => {
  const response = await api.get(`/recipes/${slug}`)
  return response.data
}

export const getRecipeTaxonomy = async (): Promise<RecipeTaxonomy> => {
  const response = await api.get('/recipes/meta/taxonomy')
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

export const undoDeleteRecipe = async (slug: string) => {
  const response = await api.post(`/recipes/${slug}/undo-delete`)
  return response.data
}

export const getUserRecipes = async (params?: { page?: number; limit?: number; search?: string }) => {
  const response = await api.get<PaginatedRecipesResponse>('/recipes/mine', { params })
  return response.data
}