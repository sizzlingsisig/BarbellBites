import { z } from 'zod'
import { RECIPE_CUISINES, RECIPE_DIETS, RECIPE_MEAL_TYPES } from '../../constants/recipeTaxonomy.js'

const imageSourceSchema = z
  .string()
  .refine((value) => /^(https?:\/\/.+|data:image\/[a-zA-Z0-9.+-]+;base64,.+)$/.test(value), {
    message: 'Image must be a valid URL or data image string',
  })

const ingredientSchema = z.object({
  name: z.string().min(1, 'Ingredient name is required'),
  amount: z.string().min(1, 'Amount is required'),
  unit: z.string().min(1, 'Unit is required').optional(),
})

const nutritionSchema = z.object({
  calories: z.number().nonnegative(),
  protein: z.number().nonnegative(),
  carbs: z.number().nonnegative(),
  fats: z.number().nonnegative(),
})

const recipeBodyBaseSchemaV2 = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  photo: imageSourceSchema.optional(),
  image: imageSourceSchema.optional(),
  visibility: z.enum(['public', 'private', 'unlisted']).default('public'),
  diets: z.array(z.enum(RECIPE_DIETS)).optional(),
  mealTypes: z.array(z.enum(RECIPE_MEAL_TYPES)).optional(),
  cuisines: z.array(z.enum(RECIPE_CUISINES)).optional(),
  prepTime: z.number().nonnegative().optional(),
  cookTime: z.number().nonnegative().optional(),
  totalTime: z.number().nonnegative().optional(),
  servings: z.number().int().positive().optional(),
  servingSize: z.string().optional(),
  ingredients: z.array(ingredientSchema).min(1, 'At least one ingredient is required'),
  steps: z.array(z.string()).min(1).optional(),
  instructions: z.array(z.string()).min(1).optional(),
  nutritionPerServing: nutritionSchema.optional(),
  nutrition: nutritionSchema.optional(),
})

const createRecipeBodySchemaV2 = recipeBodyBaseSchemaV2.superRefine((data, ctx) => {
  if (!data.steps && !data.instructions) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Provide either steps or instructions',
    })
  }

  if (!data.nutritionPerServing && !data.nutrition) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Provide either nutritionPerServing or nutrition',
    })
  }
})

export const createRecipeSchemaV2 = z.object({
  body: createRecipeBodySchemaV2,
})

export const updateRecipeSchemaV2 = z.object({
  params: z.object({
    slug: z.string().min(1, 'Recipe slug is required'),
  }),
  body: recipeBodyBaseSchemaV2.partial().refine((data) => Object.keys(data).length > 0, { message: 'At least one field must be provided for update' }),
})

export const recipeSlugSchemaV2 = z.object({
  params: z.object({
    slug: z.string().min(1, 'Recipe slug is required'),
  }),
})

/* ================================
   PATCH: CSV + multi-select query params
   Supports:
   - ?mealType=breakfast,snack
   - ?mealType=breakfast&mealType=snack
================================== */

const splitCSV = (value: string) =>
  value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)

const csvStringOptional = z.preprocess((val) => {
  if (Array.isArray(val)) return val.join(',') // mealType=a&mealType=b
  if (typeof val === 'string') return val
  return undefined
}, z.string().optional())

const csvEnumOptional = (allowed: readonly string[], label: string) =>
  csvStringOptional.refine((val) => {
    if (!val) return true
    const parts = splitCSV(val)
    return parts.every((p) => allowed.includes(p))
  }, `${label} contains an invalid value`)

export const listRecipesQuerySchemaV2 = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).default(1),
    limit: z.string().regex(/^\d+$/).transform(Number).default(10),

    search: z.string().optional(),

    // ✅ now supports multi-select via CSV
    diet: csvEnumOptional(RECIPE_DIETS, 'diet'),
    mealType: csvEnumOptional(RECIPE_MEAL_TYPES, 'mealType'),
    cuisine: csvEnumOptional(RECIPE_CUISINES, 'cuisine'),

    maxPrepTime: z.string().regex(/^\d+$/).transform(Number).optional(),
    maxTotalTime: z.string().regex(/^\d+$/).transform(Number).optional(),
    visibility: z.enum(['public', 'private', 'unlisted']).optional(),
  }),
})