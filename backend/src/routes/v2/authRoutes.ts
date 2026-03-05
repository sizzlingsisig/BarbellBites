import { Router } from 'express'
import * as authController from '../../controllers/v2/authController.js'
import { validate } from '../../middleware/validateRequests.js'
import { RegisterRequest, LoginRequest } from '../../requests/v2/authRequests.js'
import { protect } from '../../middleware/authMiddleware.js'

const router = Router()

router.post('/register', validate(RegisterRequest), authController.register)
router.post('/login', validate(LoginRequest), authController.login)
router.get('/test', protect, authController.getTest)
router.post('/refresh', authController.refresh)
router.post('/logout', authController.logout)

export default router
