import { Recipe, IRecipe } from '../models/Recipe.js';
import { Types } from 'mongoose';

// Create a new recipe
export async function createRecipe(userId: string, data: Partial<IRecipe>) {
	const recipe = await Recipe.create({ ...data, owner: userId });
	return recipe;
}

// Get a recipe by slug (public or owned)
export async function getRecipeById(slug: string, userId?: string) {
	const query: any = { slug, deletedAt: null };
	if (userId) {
		// Allow owner to see private recipes
		query.$or = [
			{ visibility: 'public' },
			{ owner: userId }
		];
	} else {
		query.visibility = 'public';
	}
	return Recipe.findOne(query);
}

// Update a recipe (must own)
export async function updateRecipe(userId: string, slug: string, data: Partial<IRecipe>) {
	const recipe = await Recipe.findOne({ slug, owner: userId, deletedAt: null });
	if (!recipe) return null;
	Object.assign(recipe, data);
	await recipe.save();
	return recipe;
}

// Soft delete a recipe (must own)
export async function softDeleteRecipe(userId: string, slug: string) {
	const recipe = await Recipe.findOne({ slug, owner: userId, deletedAt: null });
	if (!recipe) return null;
	recipe.deletedAt = new Date();
	await recipe.save();
	return recipe;
}

// List public recipes (browse/search/filter)
export async function listPublicRecipes(query: any) {
	const filter: any = { visibility: 'public', deletedAt: null };
	if (query.q) {
		filter.$text = { $search: query.q };
	}
	if (query.tag) {
		filter.tags = query.tag;
	}
	return Recipe.find(filter).limit(50).sort({ createdAt: -1 });
}

// List user's own recipes
export async function listUserRecipes(userId: string, query: any) {
	const filter: any = { owner: userId, deletedAt: null };
	if (query.q) {
		filter.$text = { $search: query.q };
	}
	if (query.tag) {
		filter.tags = query.tag;
	}
	return Recipe.find(filter).limit(50).sort({ createdAt: -1 });
}