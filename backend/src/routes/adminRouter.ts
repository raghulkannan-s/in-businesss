import { Router } from 'express';
const router = Router();

import { promotionController, demotionController } from '../controllers/adminController';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { authenticate } from '../middlewares/auth.middleware';

router.post("/promote", authenticate, roleMiddleware(["admin"]), promotionController)
router.post("/demote", authenticate, roleMiddleware(["admin"]), demotionController)

export default router;