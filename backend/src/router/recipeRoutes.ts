import { Router } from 'express';
import * as recipeController from '../controllers/recipeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.get('/', recipeController.listPublicRecipes); // GET /api/v1/recipes
router.get('/:slug', recipeController.getRecipe);    // GET /api/v1/recipes/:slug

// Protected routes
router.post('/', protect, recipeController.createRecipe); // POST /api/v1/recipes
router.put('/:slug', protect, recipeController.updateRecipe); // PUT /api/v1/recipes/:slug
router.delete('/:slug', protect, recipeController.deleteRecipe); // DELETE /api/v1/recipes/:slug
router.get('/mine', protect, recipeController.listUserRecipes); // GET /api/v1/recipes/mine

export default router;