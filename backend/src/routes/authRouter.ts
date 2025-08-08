import express from "express";
import {
  getMe,
  register,
  login,
  replenish
} from "../controllers/authController";


const router = express.Router();


router.get('/me', getMe);
router.post("/register", register);
router.post("/login", login);
router.post("/replenish", replenish);

export default router;
