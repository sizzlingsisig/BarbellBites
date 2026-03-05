export const RECIPE_DIETS = [
  'high-protein',
  'low-carb',
  'keto',
  'vegetarian',
  'vegan',
  'paleo',
] as const

export const RECIPE_MEAL_TYPES = [
  'breakfast',
  'lunch',
  'dinner',
  'snack',
] as const

export const RECIPE_CUISINES = [
  'american',
  'mediterranean',
  'mexican',
  'indian',
  'italian',
  'asian',
] as const

export type RecipeDiet = (typeof RECIPE_DIETS)[number]
export type RecipeMealType = (typeof RECIPE_MEAL_TYPES)[number]
export type RecipeCuisine = (typeof RECIPE_CUISINES)[number]
