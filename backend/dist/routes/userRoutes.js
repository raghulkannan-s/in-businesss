"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const playerController_1 = require("../controllers/playerController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = (0, express_1.Router)();
// User Management Routes (Admin/Owner only)
router.get('/', authMiddleware_1.authMiddleware, roleMiddleware_1.requireManagementLevel, userController_1.getAll);
router.get('/:id', authMiddleware_1.authMiddleware, userController_1.getUserById); // Users can see their own profile
router.put('/:id', authMiddleware_1.authMiddleware, userController_1.updateUser); // Users can update their own profile
router.delete('/:id', authMiddleware_1.authMiddleware, roleMiddleware_1.requireAdmin, userController_1.deleteUser);
// Player Rankings and Stats (All authenticated users can see)
router.get('/rankings/leaderboard', authMiddleware_1.authMiddleware, playerController_1.getPlayerRankings);
router.get('/profile/:id', authMiddleware_1.authMiddleware, playerController_1.getPlayerProfile);
exports.default = router;
