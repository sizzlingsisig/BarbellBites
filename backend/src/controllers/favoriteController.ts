import { Request, Response, NextFunction } from 'express';
import * as favoriteService from '../services/favoriteService.js';
import { AppError } from '../utils/AppError.js';
import { HttpStatusCode } from '../constants/httpStatusCodes.js';

export async function listFavorites(req: Request, res: Response, next: NextFunction) {
	try {
		const favorites = await favoriteService.listFavorites(String(req.user!._id));
		res.status(HttpStatusCode.OK).json(favorites);
	} catch (err) {
		next(err);
	}
}

export async function addFavorite(req: Request, res: Response, next: NextFunction) {
	try {
		const favorite = await favoriteService.addFavorite(String(req.user!._id), String(req.params.recipeId));
		res.status(HttpStatusCode.CREATED).json(favorite);
	} catch (err) {
		next(err);
	}
}

export async function removeFavorite(req: Request, res: Response, next: NextFunction) {
	try {
		const removed = await favoriteService.removeFavorite(String(req.user!._id), String(req.params.recipeId));

		if (!removed) {
			return next(new AppError('Favorite not found.', HttpStatusCode.NOT_FOUND));
		}

		return res.status(204).send();
	} catch (err) {
		return next(err);
	}
}