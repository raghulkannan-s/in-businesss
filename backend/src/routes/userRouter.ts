import { Router } from 'express';
const router = Router();

import { getAll, getAdmins, getManagers, getUsers, getUserById } from '../controllers/userController';
import { roleMiddleware } from '../middlewares/roleMiddleware';
import { authenticate } from '../middlewares/auth.middleware';
import { eligibilityCheck } from '../middlewares/eligibilityCheck';


router.get("/all", authenticate, roleMiddleware(["admin"]), getAll);
router.get("/allAdmins", authenticate, roleMiddleware(["admin"]), getAdmins);
router.get("/allManagers", authenticate, roleMiddleware(["admin"]), getManagers);
router.get("/allUsers", authenticate, roleMiddleware(["admin"]), getUsers);

router.get("/:id", authenticate, getUserById);


export default router;