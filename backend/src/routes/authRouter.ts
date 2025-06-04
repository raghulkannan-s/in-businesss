import { Router } from "express";
const router = Router();

import { loginController, registerController, verifyToken } from "../controllers/authController";

router.post("/login", loginController);
router.post("/register", registerController);
router.get("/verify", verifyToken);

export default router;
