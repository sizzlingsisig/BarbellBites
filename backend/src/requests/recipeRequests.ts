// src/requests/recipeRequests.ts
import { z } from 'zod';

// Base schema pieces based on your Bruno API tests
const ingredientSchema = z.object({
    name: z.string().min(1, "Ingredient name is required"),
    amount: z.string().min(1, "Amount is required"), // Using string based on {"amount": "2"} payload [cite: 1]
    unit: z.string().min(1, "Unit is required")
});

const nutritionSchema = z.object({
    calories: z.number().nonnegative(),
    protein: z.number().nonnegative(),
    carbs: z.number().nonnegative(),
    fats: z.number().nonnegative()
});

const recipeBodyBaseSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    image: z.string().url().optional(),
    visibility: z.enum(['public', 'private', 'unlisted']).default('public'),
    diets: z.array(z.string()).optional(),
    mealTypes: z.array(z.string()).optional(),
    cuisines: z.array(z.string()).optional(),
    primaryProtein: z.string().optional(),
    prepTime: z.number().nonnegative().optional(),
    cookTime: z.number().nonnegative().optional(),
    totalTime: z.number().nonnegative().optional(),
    servings: z.number().int().positive().optional(),
    servingSize: z.string().optional(),
    ingredients: z.array(ingredientSchema).min(1, "At least one ingredient is required"),
    steps: z.array(z.string()).min(1, "At least one step is required").optional(),
    nutritionPerServing: nutritionSchema.optional(),

    // Legacy aliases accepted for compatibility
    tags: z.array(z.string()).optional(),
    instructions: z.array(z.string()).min(1).optional(),
    nutrition: nutritionSchema.optional()
});

const createRecipeBodySchema = recipeBodyBaseSchema.superRefine((data, ctx) => {
    if (!data.steps && !data.instructions) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Provide either steps or instructions"
        });
    }

    if (!data.nutritionPerServing && !data.nutrition) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Provide either nutritionPerServing or nutrition"
        });
    }
});

// Schema for POST /recipes
export const createRecipeSchema = z.object({
    body: createRecipeBodySchema
});

// Schema for PUT /recipes/:slug
// We use deepPartial() because the UpdateRecipe.bru test only sends {"description": "Updated description"} [cite: 11]
export const updateRecipeSchema = z.object({
    params: z.object({
        slug: z.string().min(1, "Recipe slug is required")
    }),
    body: recipeBodyBaseSchema.partial().refine(
        (data) => Object.keys(data).length > 0,
        { message: "At least one field must be provided for update" }
    )
});

// Schema for GET/DELETE /recipes/:slug
export const recipeSlugSchema = z.object({
    params: z.object({
        slug: z.string().min(1, "Recipe slug is required")
    })
});

// Schema for GET /recipes and GET /recipes/mine (Query Params)
export const listRecipesQuerySchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).transform(Number).default(1),
        limit: z.string().regex(/^\d+$/).transform(Number).default(10),
        search: z.string().optional(),
        diet: z.string().optional(),
        mealType: z.string().optional(),
        cuisine: z.string().optional(),
        primaryProtein: z.string().optional(),
        maxPrepTime: z.string().regex(/^\d+$/).transform(Number).optional(),
        maxTotalTime: z.string().regex(/^\d+$/).transform(Number).optional(),
        visibility: z.enum(['public', 'private', 'unlisted']).optional()
    })
});