import { Request, Response, NextFunction } from 'express'
import * as recipeService from '../../services/v2/recipeService.js'
import { AppError } from '../../utils/AppError.js'
import {
	createRecipeSchemaV2,
	updateRecipeSchemaV2,
	recipeSlugSchemaV2,
	listRecipesQuerySchemaV2,
} from '../../requests/v2/recipeRequests.js'
import { RECIPE_CUISINES, RECIPE_DIETS, RECIPE_MEAL_TYPES } from '../../constants/recipeTaxonomy.js'

export async function listTaxonomy(_req: Request, res: Response) {
	res.json({
		diets: RECIPE_DIETS,
		mealTypes: RECIPE_MEAL_TYPES,
		cuisines: RECIPE_CUISINES,
	})
}

export async function createRecipe(req: Request, res: Response, next: NextFunction) {
	try {
		const parsed = createRecipeSchemaV2.parse(req)
		const recipe = await recipeService.createRecipe(String(req.user!._id), parsed.body)
		res.status(201).json(recipe)
	} catch (err) {
		next(err)
	}
}

export async function getRecipe(req: Request, res: Response, next: NextFunction) {
	try {
		const parsed = recipeSlugSchemaV2.parse(req)
		const userId = req.user?._id ? String(req.user._id) : undefined
		const recipe = await recipeService.getRecipeById(parsed.params.slug, userId)
		if (!recipe) return next(new AppError('Recipe not found', 404))
		res.json(recipe)
	} catch (err) {
		next(err)
	}
}

export async function updateRecipe(req: Request, res: Response, next: NextFunction) {
	try {
		const parsed = updateRecipeSchemaV2.parse(req)
		const updated = await recipeService.updateRecipe(String(req.user!._id), parsed.params.slug, parsed.body)
		if (!updated) return next(new AppError('Recipe not found or not authorized', 404))
		res.json(updated)
	} catch (err) {
		next(err)
	}
}

export async function deleteRecipe(req: Request, res: Response, next: NextFunction) {
	try {
		const parsed = recipeSlugSchemaV2.parse(req)
		const deleted = await recipeService.softDeleteRecipe(String(req.user!._id), parsed.params.slug)
		if (!deleted) return next(new AppError('Recipe not found or not authorized', 404))
		res.status(204).send()
	} catch (err) {
		next(err)
	}
}

export async function undoDeleteRecipe(req: Request, res: Response, next: NextFunction) {
	try {
		const parsed = recipeSlugSchemaV2.parse(req)
		const restored = await recipeService.undoDeleteRecipe(String(req.user!._id), parsed.params.slug)
		if (!restored) return next(new AppError('Recipe not found or undo window expired', 404))
		res.json(restored)
	} catch (err) {
		next(err)
	}
}

export async function listPublicRecipes(req: Request, res: Response, next: NextFunction) {
	try {
		const parsed = listRecipesQuerySchemaV2.parse(req)
		const userId = req.user?._id ? String(req.user._id) : undefined
		const result = await recipeService.listPublicRecipes(parsed.query, userId)
		res.json(result)
	} catch (err) {
		next(err)
	}
}

export async function listUserRecipes(req: Request, res: Response, next: NextFunction) {
	try {
		const parsed = listRecipesQuerySchemaV2.parse(req)
		const result = await recipeService.listUserRecipes(String(req.user!._id), parsed.query)
		res.json(result)
	} catch (err) {
		next(err)
	}
}
