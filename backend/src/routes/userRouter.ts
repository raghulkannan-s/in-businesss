import { Router } from 'express';
const router = Router();

import { getAll, getUserById, getUserByPhone } from '../controllers/userController';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const conditionalAuth = (req: any, res: any, next: any) => {
 next()
};

router.get("/all", conditionalAuth, roleMiddleware(["admin"]), getAll);
router.get("/:id", conditionalAuth, roleMiddleware(["admin"]), getUserById);
router.get("/phone/:phone", conditionalAuth, roleMiddleware(["admin"]), getUserByPhone);


export default router;