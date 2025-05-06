import express from "express";
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserScore,
    updateUserScore
} from "../controllers/userControllers.js";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes accessible to any authenticated user
router.get("/score", authMiddleware, getUserScore);
router.post("/score", adminMiddleware, updateUserScore);

// Admin only routes
router.get("/all", authMiddleware, adminMiddleware, getAllUsers);
router.get("/delete/:id", authMiddleware, adminMiddleware, deleteUser);
router.get("/:id", authMiddleware, adminMiddleware, getUserById);
router.put("/:id", authMiddleware, adminMiddleware, updateUser);

export default router;