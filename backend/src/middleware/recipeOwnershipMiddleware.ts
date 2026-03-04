import { Request, Response, NextFunction } from 'express';
import { HttpStatusCode } from '../constants/httpStatusCodes.js';
import { Recipe } from '../models/v1/Recipe.js';
import { AppError } from '../utils/AppError.js';

export const checkRecipeOwner = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug;

    if (!slug) {
      return next(new AppError('Recipe slug is required.', HttpStatusCode.BAD_REQUEST));
    }

    if (!req.user?._id) {
      return next(new AppError('You are not logged in. Please log in to get access.', HttpStatusCode.UNAUTHORIZED));
    }

    const recipe = await Recipe.findOne({ slug, deletedAt: null }).select('owner');

    if (!recipe) {
      return next(new AppError('Recipe not found.', HttpStatusCode.NOT_FOUND));
    }

    if (String(recipe.owner) !== String(req.user._id)) {
      return next(new AppError('You are not allowed to modify this recipe.', HttpStatusCode.FORBIDDEN));
    }

    return next();
  } catch (error) {
    return next(error);
  }
};
