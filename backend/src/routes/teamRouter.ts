import express from "express";
import {
    getTeam,
    createTeam,
    updateTeam,
    deleteTeam,
} from "../controllers/teamController";

import {
    getTeamPlayers,
    getTeamPlayer,
    createTeamPlayers,
    addTeamPlayer,
    deleteTeamPlayer,
    updateTeamPlayer
} from "../controllers/playerController"

import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = express.Router();

// ========================
// TEAM ROUTES
// ========================

// Get all teams
// Get specific team
router.get("/", getTeam);
router.get("/:id", getTeam);

// Create team
router.post("/", authMiddleware, roleMiddleware(["admin", "owner"]), createTeam);

// Update team
router.put("/:id", authMiddleware, roleMiddleware(["admin", "owner"]), updateTeam);

// Delete team
router.delete("/:id", authMiddleware, roleMiddleware(["admin", "owner"]), deleteTeam);

// ========================
// PLAYER ROUTES
// ========================

// Get all players in team
router.get("/:teamId/players", authMiddleware, roleMiddleware(["admin", "owner"]), getTeamPlayers);

// Get specific player
router.get("/:teamId/players/:playerId", authMiddleware, roleMiddleware(["admin", "owner"]), getTeamPlayer);

// Create multiple players
router.post("/:teamId/players", authMiddleware, roleMiddleware(["admin", "owner"]), createTeamPlayers);

// Add single player
router.post("/:teamId/players/add", authMiddleware, roleMiddleware(["admin", "owner"]), addTeamPlayer);

// Update player
router.put("/:teamId/players/:playerId", authMiddleware, roleMiddleware(["admin", "owner"]), updateTeamPlayer);

// Delete player
router.delete("/:teamId/players/:playerId", authMiddleware, roleMiddleware(["admin", "owner"]), deleteTeamPlayer);

export default router;
