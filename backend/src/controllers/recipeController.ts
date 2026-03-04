import { Request, Response, NextFunction } from 'express';
import * as recipeService from '../services/recipeService.js';
import { AppError } from '../utils/AppError.js';
import {
    createRecipeSchema,
    updateRecipeSchema,
    recipeSlugSchema,
    listRecipesQuerySchema
} from '../requests/recipeRequests.js';

// Create a new recipe (authenticated)
export async function createRecipe(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = createRecipeSchema.parse(req);
        const recipe = await recipeService.createRecipe(String(req.user!._id), parsed.body);
        res.status(201).json(recipe);
    } catch (err) {
        next(err);
    }
}

// Get a single recipe by slug (public or owned)
export async function getRecipe(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = recipeSlugSchema.parse(req);
        const userId = req.user?._id ? String(req.user._id) : undefined;
        const recipe = await recipeService.getRecipeById(parsed.params.slug, userId);
        if (!recipe) return next(new AppError('Recipe not found', 404));
        res.json(recipe);
    } catch (err) {
        next(err);
    }
}

// Update a recipe (must own, by slug)
export async function updateRecipe(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = updateRecipeSchema.parse(req);
        const updated = await recipeService.updateRecipe(String(req.user!._id), parsed.params.slug, parsed.body);
        if (!updated) return next(new AppError('Recipe not found or not authorized', 404));
        res.json(updated);
    } catch (err) {
        next(err);
    }
}

// Soft delete a recipe (must own, by slug)
export async function deleteRecipe(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = recipeSlugSchema.parse(req);
        const deleted = await recipeService.softDeleteRecipe(String(req.user!._id), parsed.params.slug);
        if (!deleted) return next(new AppError('Recipe not found or not authorized', 404));
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

// Undo soft delete a recipe (must own, by slug)
export async function undoDeleteRecipe(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = recipeSlugSchema.parse(req);
        const restored = await recipeService.undoDeleteRecipe(String(req.user!._id), parsed.params.slug);
        if (!restored) return next(new AppError('Recipe not found, not authorized, or not currently deleted', 404));
        res.json({ message: 'Recipe restored successfully', recipe: restored });
    } catch (err) {
        next(err);
    }
}

// List public recipes (browse/search/filter)
export async function listPublicRecipes(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = listRecipesQuerySchema.parse(req);
        const recipes = await recipeService.listPublicRecipes(parsed.query);
        res.json(recipes);
    } catch (err) {
        next(err);
    }
}

// List user's own recipes
export async function listUserRecipes(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = listRecipesQuerySchema.parse(req);
        const recipes = await recipeService.listUserRecipes(String(req.user!._id), parsed.query);
        res.json(recipes);
    } catch (err) {
        next(err);
    }
}