import { Recipe, IRecipe } from '../../models/v1/Recipe.js';
import { RECIPE_DIETS } from '../../constants/recipeTaxonomy.js';

type RecipePayload = Partial<IRecipe> & {
	tags?: string[];
	instructions?: string[];
	nutrition?: {
		calories: number;
		protein: number;
		carbs: number;
		fats: number;
	};
};

type RecipeListQuery = {
	search?: string;
	diet?: string;
	mealType?: string;
	cuisine?: string;
	maxPrepTime?: number;
	maxTotalTime?: number;
};

type MongoFilter = Record<string, unknown>;

const ESCAPE_REGEX = /[.*+?^${}()|[\]\\]/g;

function escapeRegex(value: string): string {
	return value.replace(ESCAPE_REGEX, '\\$&');
}

function normalizeRecipePayload(data: RecipePayload): Partial<IRecipe> {
	const next: RecipePayload = { ...data };
	const dietSet = new Set(RECIPE_DIETS);

	if (!next.diets && Array.isArray(next.tags)) {
		next.diets = next.tags.filter((value): value is (typeof RECIPE_DIETS)[number] =>
			dietSet.has(value as (typeof RECIPE_DIETS)[number]),
		);
	}

	if (!next.steps && Array.isArray(next.instructions)) {
		next.steps = next.instructions;
	}

	if (!next.nutritionPerServing && next.nutrition) {
		next.nutritionPerServing = next.nutrition;
	}

	if (!next.photo && next.image) {
		next.photo = next.image;
	}

	if (next.totalTime == null && (next.prepTime != null || next.cookTime != null)) {
		next.totalTime = (next.prepTime ?? 0) + (next.cookTime ?? 0);
	}

	delete next.tags;
	delete next.instructions;
	delete next.nutrition;

	return next;
}

function buildRecipeFilters(query: RecipeListQuery): MongoFilter {
	const filter: MongoFilter = {};

	if (query.search) {
		const search = escapeRegex(query.search.trim());
		if (search) {
			filter.$or = [
				{ title: { $regex: search, $options: 'i' } },
				{ description: { $regex: search, $options: 'i' } },
			];
		}
	}

	if (query.diet) {
		filter.diets = query.diet;
	}
	if (query.mealType) {
		filter.mealTypes = query.mealType;
	}
	if (query.cuisine) {
		filter.cuisines = query.cuisine;
	}
	if (typeof query.maxPrepTime === 'number') {
		filter.prepTime = { $lte: query.maxPrepTime };
	}
	if (typeof query.maxTotalTime === 'number') {
		filter.totalTime = { $lte: query.maxTotalTime };
	}

	return filter;
}

export async function createRecipe(userId: string, data: Partial<IRecipe>) {
	const normalizedData = normalizeRecipePayload(data as RecipePayload);
	const recipe = await Recipe.create({ ...normalizedData, owner: userId });
	return recipe;
}

export async function getRecipeById(slug: string, userId?: string) {
	const query: MongoFilter = { slug, deletedAt: null };
	if (userId) {
		query.$or = [
			{ visibility: 'public' },
			{ owner: userId }
		];
	} else {
		query.visibility = 'public';
	}
	return Recipe.findOne(query);
}

export async function updateRecipe(userId: string, slug: string, data: Partial<IRecipe>) {
	const recipe = await Recipe.findOne({ slug, owner: userId, deletedAt: null });
	if (!recipe) return null;
	const normalizedData = normalizeRecipePayload(data as RecipePayload);
	Object.assign(recipe, normalizedData);
	await recipe.save();
	return recipe;
}

export async function softDeleteRecipe(userId: string, slug: string) {
	const recipe = await Recipe.findOne({ slug, owner: userId, deletedAt: null });
	if (!recipe) return null;
	recipe.deletedAt = new Date();
	await recipe.save();
	return recipe;
}

export async function undoDeleteRecipe(userId: string, slug: string) {
	const recipe = await Recipe.findOne({ slug, owner: userId, deletedAt: { $ne: null } });
	if (!recipe) return null;
	recipe.deletedAt = null;
	await recipe.save();
	return recipe;
}

export async function listPublicRecipes(query: RecipeListQuery) {
	const filter: MongoFilter = {
		...buildRecipeFilters(query),
		visibility: 'public',
		deletedAt: null,
	};
	return Recipe.find(filter).limit(50).sort({ createdAt: -1 });
}

export async function listUserRecipes(userId: string, query: RecipeListQuery) {
	const filter: MongoFilter = {
		...buildRecipeFilters(query),
		owner: userId,
		deletedAt: null,
	};
	return Recipe.find(filter).limit(50).sort({ createdAt: -1 });
}
