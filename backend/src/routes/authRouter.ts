import express from "express";
import {
  getMe,
  register,
  login,
  logout,
  refreshToken
} from "../controllers/authController";


const router = express.Router();


router.get('/me', getMe);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken)

export default router;
