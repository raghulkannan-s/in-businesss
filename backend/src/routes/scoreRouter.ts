import {Router } from 'express';
const router = Router();

import { getScore, updateScore } from '../controllers/scoreController';
import { allowUser, blockUser } from '../controllers/eligibilityController';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { authMiddleware } from '../middlewares/authMiddleware';

router.get('/getScore', authMiddleware, getScore);
router.put('/update/:id', authMiddleware, roleMiddleware(["admin"]), updateScore);
router.post("/allow/:id", authMiddleware, roleMiddleware(["admin"]), allowUser);
router.post("/block/:id", authMiddleware, roleMiddleware(["admin"]), blockUser);

export default router;