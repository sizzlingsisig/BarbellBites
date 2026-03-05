import { Router } from 'express';
import * as healthController from '../../controllers/v1/healthController.js';

const router = Router();

router.get('/db', healthController.getDbHealth);

export default router;
