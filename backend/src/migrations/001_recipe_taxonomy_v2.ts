import { Recipe } from '../models/v2/Recipe.js'
import { RECIPE_CUISINES, RECIPE_DIETS, RECIPE_MEAL_TYPES } from '../constants/recipeTaxonomy.js'
import type { Migration } from './types.js'

const dietSet = new Set(RECIPE_DIETS)
const mealTypeSet = new Set(RECIPE_MEAL_TYPES)
const cuisineSet = new Set(RECIPE_CUISINES)

export const recipeTaxonomyV2Migration: Migration = {
  id: '001_recipe_taxonomy_v2',
  description: 'Remove primaryProtein and constrain taxonomy fields to preset enums',
  up: async () => {
    await Recipe.updateMany({}, { $unset: { primaryProtein: '' } })

    const recipes = await Recipe.find({}, { _id: 1, diets: 1, mealTypes: 1, cuisines: 1 })

    for (const recipe of recipes) {
      const diets = (recipe.diets ?? []).filter((value) => dietSet.has(value as (typeof RECIPE_DIETS)[number]))
      const mealTypes = (recipe.mealTypes ?? []).filter((value) => mealTypeSet.has(value as (typeof RECIPE_MEAL_TYPES)[number]))
      const cuisines = (recipe.cuisines ?? []).filter((value) => cuisineSet.has(value as (typeof RECIPE_CUISINES)[number]))

      recipe.diets = diets
      recipe.mealTypes = mealTypes
      recipe.cuisines = cuisines
      await recipe.save()
    }
  },
}
