"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.get('/me', auth_middleware_1.authenticate, authController_1.getMe);
router.post("/register", authController_1.register);
router.post("/login", authController_1.login);
router.post("/logout", auth_middleware_1.authenticate, authController_1.logout);
router.post("/refresh", authController_1.refreshAccessToken);
exports.default = router;
