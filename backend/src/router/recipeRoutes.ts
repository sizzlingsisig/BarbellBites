import { Router } from 'express';
import * as recipeController from '../controllers/recipeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { checkRecipeOwner } from '../middleware/recipeOwnershipMiddleware.js';

const router = Router();

// Public routes
router.get('/', recipeController.listPublicRecipes); // GET /api/v1/recipes
router.get('/mine', protect, recipeController.listUserRecipes); // GET /api/v1/recipes/mine
router.get('/:slug', recipeController.getRecipe);    // GET /api/v1/recipes/:slug

// Protected routes
router.post('/', protect, recipeController.createRecipe); // POST /api/v1/recipes
router.put('/:slug', protect, checkRecipeOwner, recipeController.updateRecipe); // PUT /api/v1/recipes/:slug
router.delete('/:slug', protect, checkRecipeOwner, recipeController.deleteRecipe); // DELETE /api/v1/recipes/:slug

export default router;