import { Router } from 'express';
const router = Router();

import { promotionController, demotionController } from '../controllers/adminController';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { tokenVerify } from '../middlewares/tokenVerify';

router.post("/promote/:phone/:role", tokenVerify, roleMiddleware(["admin"]), promotionController)
router.post("/demote/:phone/:role", tokenVerify, roleMiddleware(["admin"]), demotionController)

export default router;