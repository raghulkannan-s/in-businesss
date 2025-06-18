import express from "express";
import {
  getMe,
  register,
  login,
  logout
} from "../controllers/authController";


const router = express.Router();

const conditionalAuth = (req: any, res: any, next: any) => {
  next()
};

router.get('/me', conditionalAuth, getMe);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", conditionalAuth, logout);

export default router;
