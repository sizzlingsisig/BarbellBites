import { Favorite } from '../../models/v2/Favorite.js';
import { Recipe } from '../../models/v2/Recipe.js';
import { AppError } from '../../utils/AppError.js';
import { HttpStatusCode } from '../../constants/httpStatusCodes.js';

export async function listFavorites(userId: string) {
	const favorites = await Favorite.find({ userId })
		.populate({
			path: 'recipeId',
			match: { deletedAt: null },
		})
		.sort({ createdAt: -1 });

	return favorites.filter((favorite) => favorite.recipeId);
}

export async function addFavorite(userId: string, recipeId: string) {
	const recipe = await Recipe.findOne({
		_id: recipeId,
		deletedAt: null,
		$or: [{ visibility: 'public' }, { owner: userId }],
	});

	if (!recipe) {
		throw new AppError('Recipe not found or not visible.', HttpStatusCode.NOT_FOUND);
	}

	const existing = await Favorite.findOne({ userId, recipeId });
	if (existing) {
		return existing;
	}

	return Favorite.create({ userId, recipeId });
}

export async function removeFavorite(userId: string, recipeId: string) {
	const deleted = await Favorite.findOneAndDelete({ userId, recipeId });
	return Boolean(deleted);
}
