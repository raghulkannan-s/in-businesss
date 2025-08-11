"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teamController_1 = require("../controllers/teamController");
const playerController_1 = require("../controllers/playerController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = express_1.default.Router();
// ========================
// TEAM ROUTES
// ========================
// Get all teams
// Get specific team
router.get("/", teamController_1.getTeam);
router.get("/:id", teamController_1.getTeam);
// Create team
router.post("/", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(["admin", "owner"]), teamController_1.createTeam);
// Update team
router.put("/:id", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(["admin", "owner"]), teamController_1.updateTeam);
// Delete team
router.delete("/:id", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(["admin", "owner"]), teamController_1.deleteTeam);
// ========================
// PLAYER ROUTES
// ========================
// Get all players in team
router.get("/:teamId/players", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(["admin", "owner"]), playerController_1.getTeamPlayers);
// Get specific player
router.get("/:teamId/players/:playerId", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(["admin", "owner"]), playerController_1.getTeamPlayer);
// Create multiple players
router.post("/:teamId/players", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(["admin", "owner"]), playerController_1.createTeamPlayers);
// Add single player
router.post("/:teamId/players/add", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(["admin", "owner"]), playerController_1.addTeamPlayer);
// Update player
router.put("/:teamId/players/:playerId", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(["admin", "owner"]), playerController_1.updateTeamPlayer);
// Delete player
router.delete("/:teamId/players/:playerId", authMiddleware_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(["admin", "owner"]), playerController_1.deleteTeamPlayer);
exports.default = router;
