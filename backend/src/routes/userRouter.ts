import { Router } from 'express';
const router = Router();

import { getAll, getUserById, getUserByPhone } from '../controllers/userController';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { authenticate } from '../middlewares/auth.middleware';


router.get("/all", authenticate, roleMiddleware(["admin"]), getAll);
router.get("/:id", authenticate, roleMiddleware(["admin"]), getUserById);
router.get("/phone/:phone", authenticate, roleMiddleware(["admin"]), getUserByPhone);


export default router;