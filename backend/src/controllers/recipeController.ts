import { Request, Response, NextFunction } from 'express';
import * as recipeService from '../services/recipeService.js';
import { AppError } from '../utils/AppError.js';

// Create a new recipe (authenticated)
export async function createRecipe(req: Request, res: Response, next: NextFunction) {
	try {
		const recipe = await recipeService.createRecipe(String(req.user!._id), req.body);
		res.status(201).json(recipe);
	} catch (err) {
		next(err);
	}
}

// Get a single recipe by slug (public or owned)
export async function getRecipe(req: Request, res: Response, next: NextFunction) {
	try {
		const slug = Array.isArray(req.params.slug) ? String(req.params.slug[0]) : String(req.params.slug);
		const userId = req.user?._id ? String(req.user._id) : undefined;
		const recipe = await recipeService.getRecipeById(slug, userId);
		if (!recipe) return next(new AppError('Recipe not found', 404));
		res.json(recipe);
	} catch (err) {
		next(err);
	}
}

// Update a recipe (must own, by slug)
export async function updateRecipe(req: Request, res: Response, next: NextFunction) {
	try {
		const slug = Array.isArray(req.params.slug) ? String(req.params.slug[0]) : String(req.params.slug);
		const updated = await recipeService.updateRecipe(String(req.user!._id), slug, req.body);
		if (!updated) return next(new AppError('Recipe not found or not authorized', 404));
		res.json(updated);
	} catch (err) {
		next(err);
	}
}

// Soft delete a recipe (must own, by slug)
export async function deleteRecipe(req: Request, res: Response, next: NextFunction) {
	try {
		const slug = Array.isArray(req.params.slug) ? String(req.params.slug[0]) : String(req.params.slug);
		const deleted = await recipeService.softDeleteRecipe(String(req.user!._id), slug);
		if (!deleted) return next(new AppError('Recipe not found or not authorized', 404));
		res.status(204).send();
	} catch (err) {
		next(err);
	}
}

// List public recipes (browse/search/filter)
export async function listPublicRecipes(req: Request, res: Response, next: NextFunction) {
	try {
		const recipes = await recipeService.listPublicRecipes(req.query);
		res.json(recipes);
	} catch (err) {
		next(err);
	}
}

// List user's own recipes
export async function listUserRecipes(req: Request, res: Response, next: NextFunction) {
	try {
		const recipes = await recipeService.listUserRecipes(String(req.user!._id), req.query);
		res.json(recipes);
	} catch (err) {
		next(err);
	}
}