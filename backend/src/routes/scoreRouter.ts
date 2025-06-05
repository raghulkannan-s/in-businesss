import {Router } from 'express';
const router = Router();

import { getScore, updateScore } from '../controllers/scoreController';
import { getEligibility, allowUser, blockUser } from '../controllers/eligibilityController';

import { tokenVerify } from '../middlewares/tokenVerify';
import { roleMiddleware } from '../middlewares/roleMiddleware';

router.get('/score', tokenVerify, getScore);
router.put('/update/:id', tokenVerify, roleMiddleware(["admin"]), updateScore);


router.get("/eligible", tokenVerify, getEligibility);
router.post("/allow/:id", tokenVerify, roleMiddleware(["admin"]), allowUser);
router.post("/block/:id", tokenVerify, roleMiddleware(["admin"]), blockUser);


export default router;