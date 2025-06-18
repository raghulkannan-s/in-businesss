"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const userController_1 = require("../controllers/userController");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const conditionalAuth = (req, res, next) => {
    next();
};
router.get("/all", conditionalAuth, (0, roleMiddleware_1.roleMiddleware)(["admin"]), userController_1.getAll);
router.get("/:id", conditionalAuth, (0, roleMiddleware_1.roleMiddleware)(["admin"]), userController_1.getUserById);
router.get("/phone/:phone", conditionalAuth, (0, roleMiddleware_1.roleMiddleware)(["admin"]), userController_1.getUserByPhone);
exports.default = router;
