"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const adminController_1 = require("../controllers/adminController");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const conditionalAuth = (req, res, next) => {
    next();
};
router.post("/promote", conditionalAuth, (0, roleMiddleware_1.roleMiddleware)(["admin"]), adminController_1.promotionController);
router.post("/demote", conditionalAuth, (0, roleMiddleware_1.roleMiddleware)(["admin"]), adminController_1.demotionController);
exports.default = router;
