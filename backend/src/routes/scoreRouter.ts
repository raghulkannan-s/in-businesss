import {Router } from 'express';
const router = Router();

import { getScore, updateScore } from '../controllers/scoreController';
import { tokenVerify } from '../middlewares/tokenVerify';
import { roleMiddleware } from '../middlewares/roleMiddleware';

router.get('/get', tokenVerify, getScore);
router.put('/update/:id', tokenVerify, roleMiddleware(["admin"]), updateScore);

export default router;