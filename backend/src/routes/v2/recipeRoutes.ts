import { Router } from 'express'
import * as recipeControllerV2 from '../../controllers/v2/recipeController.js'
import { protect } from '../../middleware/authMiddleware.js'
import { checkRecipeOwner } from '../../middleware/recipeOwnershipMiddleware.js'

const router = Router()

router.get('/meta/taxonomy', recipeControllerV2.listTaxonomy)
router.get('/', recipeControllerV2.listPublicRecipes)
router.get('/mine', protect, recipeControllerV2.listUserRecipes)
router.get('/:slug', recipeControllerV2.getRecipe)

router.post('/', protect, recipeControllerV2.createRecipe)
router.put('/:slug', protect, checkRecipeOwner, recipeControllerV2.updateRecipe)
router.delete('/:slug', protect, checkRecipeOwner, recipeControllerV2.deleteRecipe)

export default router
