import { Router } from 'express';
const router = Router();

import { promotionController, demotionController } from '../controllers/adminController';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { authMiddleware } from '../middlewares/authMiddleware';

router.post("/promote", authMiddleware, roleMiddleware(["admin"]), promotionController)
router.post("/demote", authMiddleware, roleMiddleware(["admin"]), demotionController)

export default router;