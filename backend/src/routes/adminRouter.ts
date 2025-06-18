import { Router } from 'express';
const router = Router();

import { promotionController, demotionController } from '../controllers/adminController';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const conditionalAuth = (req: any, res: any, next: any) => {
 next()
};

router.post("/promote", conditionalAuth, roleMiddleware(["admin"]), promotionController)
router.post("/demote", conditionalAuth, roleMiddleware(["admin"]), demotionController)

export default router;