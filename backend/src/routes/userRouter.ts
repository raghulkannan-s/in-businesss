import { Router } from 'express';
const router = Router();

import { getAll, getUserById, getUserByPhone } from '../controllers/userController';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { authMiddleware } from '../middlewares/authMiddleware';

router.get("/all", authMiddleware, roleMiddleware(["admin"]), getAll);
router.get("/:id", authMiddleware, roleMiddleware(["admin"]), getUserById);
router.get("/phone/:phone", authMiddleware, roleMiddleware(["admin"]), getUserByPhone);

export default router;