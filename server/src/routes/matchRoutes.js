import express from "express";
import { authMiddleware, adminMiddleware, managerMiddleware } from "../middleware/authMiddleware.js";
import {
    getAllMatches,
    getMatchById,
    createMatch,
    updateMatch,
    deleteMatch,
    setToss,
    startMatch,
    addBallEntry,
    getScoreboard
} from "../controllers/matchControllers.js";

const router = express.Router();

// Get all matches
router.get("/", authMiddleware, getAllMatches);

// Get match by ID
router.get("/:id", authMiddleware, getMatchById);

// Create new match (admin only)
router.post("/", authMiddleware, adminMiddleware, createMatch);

// Update match details (admin only)
router.put("/:id", authMiddleware, adminMiddleware, updateMatch);

// Delete match (admin only)
router.delete("/:id", authMiddleware, adminMiddleware, deleteMatch);

// Set toss result
router.post("/:id/toss", authMiddleware, managerMiddleware, setToss);

// Start match
router.post("/:id/start", authMiddleware, managerMiddleware, startMatch);

// Add ball-by-ball entry
router.post("/:id/ball", authMiddleware, managerMiddleware, addBallEntry);

// Get scoreboard
router.get("/:id/scoreboard", authMiddleware, getScoreboard);

export default router;