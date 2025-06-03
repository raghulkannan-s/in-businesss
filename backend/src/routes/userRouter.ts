import { Router } from 'express';
const router = Router();

import { getAll, getAdmins, getManagers, getUsers } from '../controllers/userController';

router.get("/all", getAll);
router.get("/admins", getAdmins);
router.get("/managers", getManagers);
router.get("/users", getUsers);

export default router;