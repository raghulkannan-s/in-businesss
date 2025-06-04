"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const authController_1 = require("../controllers/authController");
router.post("/login", authController_1.loginController);
router.post("/register", authController_1.registerController);
router.get("/verify", authController_1.verifyToken);
exports.default = router;
