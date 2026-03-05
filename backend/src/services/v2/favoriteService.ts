import { BackupFavorite, Favorite } from '../../models/v2/Favorite.js';
import { BackupRecipe, Recipe } from '../../models/v2/Recipe.js';
import { AppError } from '../../utils/AppError.js';
import { HttpStatusCode } from '../../constants/httpStatusCodes.js';
import { mirrorWriteToBackup, withReadFailover } from '../../utils/failover.js';

export async function listFavorites(userId: string) {
	const favorites = await withReadFailover(
		'favorites list',
		() =>
			Favorite.find({ userId })
				.populate({
					path: 'recipeId',
					match: { deletedAt: null },
					model: Recipe,
				})
				.sort({ createdAt: -1 }),
		() =>
			BackupFavorite.find({ userId })
				.populate({
					path: 'recipeId',
					match: { deletedAt: null },
					model: BackupRecipe,
				})
				.sort({ createdAt: -1 }),
	);

	return favorites.filter((favorite) => favorite.recipeId);
}

export async function addFavorite(userId: string, recipeId: string) {
	const recipe = await withReadFailover(
		'favorite recipe lookup',
		() =>
			Recipe.findOne({
				_id: recipeId,
				deletedAt: null,
				$or: [{ visibility: 'public' }, { owner: userId }],
			}),
		() =>
			BackupRecipe.findOne({
				_id: recipeId,
				deletedAt: null,
				$or: [{ visibility: 'public' }, { owner: userId }],
			}),
	);

	if (!recipe) {
		throw new AppError('Recipe not found or not visible.', HttpStatusCode.NOT_FOUND);
	}

	const existing = await withReadFailover(
		'favorite existence check',
		() => Favorite.findOne({ userId, recipeId }),
		() => BackupFavorite.findOne({ userId, recipeId }),
	);
	if (existing) {
		return existing;
	}

	const favorite = await Favorite.create({ userId, recipeId });

	await mirrorWriteToBackup('favorite create', async () => {
		const backupPayload = favorite.toObject();
		await BackupFavorite.updateOne(
			{ _id: favorite._id },
			{ $set: backupPayload },
			{ upsert: true, setDefaultsOnInsert: true },
		);
	});

	return favorite;
}

export async function removeFavorite(userId: string, recipeId: string) {
	const deleted = await Favorite.findOneAndDelete({ userId, recipeId });

	if (deleted) {
		await mirrorWriteToBackup('favorite delete', async () => {
			await BackupFavorite.findOneAndDelete({ userId, recipeId });
		});
	}

	return Boolean(deleted);
}
