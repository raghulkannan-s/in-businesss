import {Router } from 'express';
const router = Router();

import { getScore, updateScore } from '../controllers/scoreController';
import { allowUser, blockUser } from '../controllers/eligibilityController';

import { roleMiddleware } from '../middlewares/roleMiddleware';

// Conditional auth middleware
const conditionalAuth = (req: any, res: any, next: any) => {
 next()
};

router.get('/getScore', conditionalAuth, getScore);
router.put('/update/:id', conditionalAuth, roleMiddleware(["admin"]), updateScore);
router.post("/allow/:id", conditionalAuth, roleMiddleware(["admin"]), allowUser);
router.post("/block/:id", conditionalAuth, roleMiddleware(["admin"]), blockUser);


export default router;