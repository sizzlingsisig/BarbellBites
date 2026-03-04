import { Router } from 'express'
import * as recipeController from '../../controllers/v1/recipeController.js'
import { protect } from '../../middleware/authMiddleware.js'
import { checkRecipeOwner } from '../../middleware/recipeOwnershipMiddleware.js'

const router = Router()

router.get('/', recipeController.listPublicRecipes)
router.get('/mine', protect, recipeController.listUserRecipes)
router.get('/:slug', recipeController.getRecipe)

router.post('/', protect, recipeController.createRecipe)
router.put('/:slug', protect, checkRecipeOwner, recipeController.updateRecipe)
router.delete('/:slug', protect, checkRecipeOwner, recipeController.deleteRecipe)

export default router
