"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const screenshotController_1 = require("../controllers/screenshotController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const router = express_1.default.Router();
// Upload screenshot (with multer middleware)
router.post("/screenshot", authMiddleware_1.authMiddleware, uploadMiddleware_1.uploadScreenshot, screenshotController_1.uploadScreenshotController);
// Get screenshot by ID
router.get("/screenshot/:id", screenshotController_1.getScreenshotController);
// Get all screenshots for a match
router.get("/screenshots/:matchId", screenshotController_1.getMatchScreenshotsController);
// Delete screenshot
router.delete("/screenshot/:id", authMiddleware_1.authMiddleware, screenshotController_1.deleteScreenshotController);
// Serve static screenshots
router.use('/screenshots', express_1.default.static('uploads/screenshots'));
exports.default = router;
