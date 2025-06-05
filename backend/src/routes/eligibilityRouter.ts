import { Router } from 'express';
const router = Router();

import { getEligibility, allowUser, blockUser } from '../controllers/eligibilityController';
import { tokenVerify } from '../middlewares/tokenVerify';
import { roleMiddleware } from '../middlewares/roleMiddleware';

router.get("/get", tokenVerify, getEligibility);
router.post("/allow/:phone", tokenVerify, roleMiddleware(["admin"]), allowUser);
router.post("/block/:phone", tokenVerify, roleMiddleware(["admin"]), blockUser);

export default router;