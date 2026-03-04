import { Router } from 'express';
import * as favoriteController from '../controllers/favoriteController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateRequests.js';
import { favoriteParamsSchema } from '../requests/favoriteRequests.js';

const router = Router();

router.use(protect);

router.get('/', favoriteController.listFavorites);
router.post('/:recipeId', validate(favoriteParamsSchema), favoriteController.addFavorite);
router.delete('/:recipeId', validate(favoriteParamsSchema), favoriteController.removeFavorite);

export default router;