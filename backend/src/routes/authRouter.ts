import express from "express";
import {
  getMe,
  register,
  login,
  logout,
  refreshAccessToken,
} from "../controllers/authController";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

router.get('/me', authenticate, getMe);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", authenticate, logout);
router.post("/refresh", refreshAccessToken);

export default router;
