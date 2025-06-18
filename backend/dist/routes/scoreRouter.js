"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const scoreController_1 = require("../controllers/scoreController");
const eligibilityController_1 = require("../controllers/eligibilityController");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
// Conditional auth middleware
const conditionalAuth = (req, res, next) => {
    next();
};
router.get('/getScore', conditionalAuth, scoreController_1.getScore);
router.put('/update/:id', conditionalAuth, (0, roleMiddleware_1.roleMiddleware)(["admin"]), scoreController_1.updateScore);
router.post("/allow/:id", conditionalAuth, (0, roleMiddleware_1.roleMiddleware)(["admin"]), eligibilityController_1.allowUser);
router.post("/block/:id", conditionalAuth, (0, roleMiddleware_1.roleMiddleware)(["admin"]), eligibilityController_1.blockUser);
exports.default = router;
