import { Router } from 'express';
const router = Router();

import { getAll, getAdmins, getManagers, getUsers } from '../controllers/userController';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { tokenVerify } from '../middlewares/tokenVerify';

router.get("/all", tokenVerify, roleMiddleware(["admin"]), getAll);
router.get("/admins", tokenVerify, roleMiddleware(["admin"]), getAdmins);
router.get("/managers", tokenVerify, roleMiddleware(["admin"]), getManagers);
router.get("/users", tokenVerify, roleMiddleware(["admin"]), getUsers);

export default router;