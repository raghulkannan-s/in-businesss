"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const authController_1 = require("../controllers/authController");
function asyncHandler(fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
router.post("/login", asyncHandler(authController_1.loginController));
router.post('/register', asyncHandler(authController_1.registerController));
router.get('/verify', asyncHandler(authController_1.verifyToken));
exports.default = router;
