import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { validate } from '../middleware/validateRequests.js';
import { RegisterRequest, LoginRequest } from '../requests/authRequests.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// Public: create account
router.post(
    '/register', 
    validate(RegisterRequest),
    authController.register
);

// Public: authenticate and return tokens
router.post(
    '/login', 
    validate(LoginRequest), 
    authController.login
);

// Private: quick auth guard test endpoint
router.get('/test', protect, authController.getTest);

// Public: exchange refresh token cookie for new access token
router.post('/refresh', authController.refresh);

// Public: clear refresh cookie and revoke refresh token
router.post('/logout', authController.logout);

export default router;