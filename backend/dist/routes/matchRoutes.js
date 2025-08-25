"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const matchController_1 = require("../controllers/matchController");
const uploadController_1 = require("../controllers/uploadController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = (0, express_1.Router)();
// Public/Sports Hall Routes (Live matches only for regular users)
router.get('/', authMiddleware_1.authMiddleware, roleMiddleware_1.requireSportsHallAccess, matchController_1.getAllMatchesController);
router.get('/:id', authMiddleware_1.authMiddleware, roleMiddleware_1.requireSportsHallAccess, matchController_1.getMatchByIdController);
router.get('/:id/scoreboard', authMiddleware_1.authMiddleware, roleMiddleware_1.requireSportsHallAccess, matchController_1.getMatchScoreboardController);
// Management Only Routes
router.post('/', authMiddleware_1.authMiddleware, roleMiddleware_1.requireAdminOrManager, matchController_1.createMatchController);
router.put('/:id', authMiddleware_1.authMiddleware, roleMiddleware_1.requireAdminOrManager, matchController_1.updateMatchController);
router.delete('/:id', authMiddleware_1.authMiddleware, roleMiddleware_1.requireAdmin, matchController_1.deleteMatchController);
// Match Setup Routes (Manager/Admin)
router.put('/:id/toss', authMiddleware_1.authMiddleware, roleMiddleware_1.requireAdminOrManager, matchController_1.updateMatchTossController);
router.put('/:id/overs', authMiddleware_1.authMiddleware, roleMiddleware_1.requireAdminOrManager, matchController_1.updateMatchOversController);
router.put('/:id/winner', authMiddleware_1.authMiddleware, roleMiddleware_1.requireAdminOrManager, matchController_1.updateMatchWinnerController);
// Live Scoring Routes (Manager/Admin only)
router.post('/:id/ball', authMiddleware_1.authMiddleware, roleMiddleware_1.requireAdminOrManager, matchController_1.addBallToMatch);
// Screenshot Upload (Manager/Admin only)
router.post('/:id/screenshot', authMiddleware_1.authMiddleware, roleMiddleware_1.requireAdminOrManager, uploadController_1.uploadScreenshotMiddleware, uploadController_1.uploadMatchScreenshot);
exports.default = router;
