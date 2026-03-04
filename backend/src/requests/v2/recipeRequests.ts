import { z } from 'zod'
import { RECIPE_CUISINES, RECIPE_DIETS, RECIPE_MEAL_TYPES } from '../../constants/recipeTaxonomy.js'

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
	photo: z.string().url().optional(),
	image: z.string().url().optional(),
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
	body: recipeBodyBaseSchemaV2.partial().refine(
		(data) => Object.keys(data).length > 0,
		{ message: 'At least one field must be provided for update' },
	),
})

export const recipeSlugSchemaV2 = z.object({
	params: z.object({
		slug: z.string().min(1, 'Recipe slug is required'),
	}),
})

export const listRecipesQuerySchemaV2 = z.object({
	query: z.object({
		page: z.string().regex(/^\d+$/).transform(Number).default(1),
		limit: z.string().regex(/^\d+$/).transform(Number).default(10),
		search: z.string().optional(),
		diet: z.enum(RECIPE_DIETS).optional(),
		mealType: z.enum(RECIPE_MEAL_TYPES).optional(),
		cuisine: z.enum(RECIPE_CUISINES).optional(),
		maxPrepTime: z.string().regex(/^\d+$/).transform(Number).optional(),
		maxTotalTime: z.string().regex(/^\d+$/).transform(Number).optional(),
		visibility: z.enum(['public', 'private', 'unlisted']).optional(),
	}),
})
