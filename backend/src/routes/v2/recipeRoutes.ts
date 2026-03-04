import { Router } from 'express'
import * as recipeControllerV2 from '../../controllers/v2/recipeController.js'
import { attachUserIfPresent, protect } from '../../middleware/authMiddleware.js'
import { checkRecipeOwner } from '../../middleware/recipeOwnershipMiddleware.js'

const router = Router()

router.get('/meta/taxonomy', recipeControllerV2.listTaxonomy)
router.get('/', attachUserIfPresent, recipeControllerV2.listPublicRecipes)
router.get('/mine', protect, recipeControllerV2.listUserRecipes)
router.get('/:slug', attachUserIfPresent, recipeControllerV2.getRecipe)

router.post('/', protect, recipeControllerV2.createRecipe)
router.post('/:slug/undo-delete', protect, recipeControllerV2.undoDeleteRecipe)
router.put('/:slug', protect, checkRecipeOwner, recipeControllerV2.updateRecipe)
router.delete('/:slug', protect, checkRecipeOwner, recipeControllerV2.deleteRecipe)

export default router
