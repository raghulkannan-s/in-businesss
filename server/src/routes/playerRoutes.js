import express from "express";
import { authMiddleware, adminMiddleware, managerMiddleware } from "../middleware/authMiddleware.js";
import {
    createPlayer,
    getAllPlayers,
    getPlayerById,
    updatePlayer,
    deletePlayer,
    checkEligibility,
    getPlayerRankings
} from "../controllers/playerControllers.js";

const router = express.Router();

// Create a new player (admin only)
router.post("/", authMiddleware, adminMiddleware, createPlayer);

// Get all players
router.get("/", authMiddleware, getAllPlayers);

// Get player by ID
router.get("/:id", authMiddleware, getPlayerById);

// Update player (admin/manager only)
router.put("/:id", authMiddleware, managerMiddleware, updatePlayer);

// Delete player (admin only)
router.delete("/:id", authMiddleware, adminMiddleware, deletePlayer);

// Check player eligibility
router.post("/eligibility", authMiddleware, checkEligibility);

// Get player rankings
router.get("/rankings", authMiddleware, getPlayerRankings);

export default router;