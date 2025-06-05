import {Router } from 'express';
const router = Router();

import { getScore, updateScore } from '../controllers/scoreController';
import { allowUser, blockUser } from '../controllers/eligibilityController';

import { authenticate } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

router.get('/getScore', authenticate, getScore);
router.put('/update/:id', authenticate, roleMiddleware(["admin"]), updateScore);
router.post("/allow/:id", authenticate, roleMiddleware(["admin"]), allowUser);
router.post("/block/:id", authenticate, roleMiddleware(["admin"]), blockUser);


export default router;