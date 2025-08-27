import express from "express";
import {
    uploadScreenshotController, 
    getScreenshotController, 
    getMatchScreenshotsController,
    deleteScreenshotController 
} from "../controllers/screenshotController";
import { authMiddleware } from '../middlewares/authMiddleware';
import { uploadScreenshot } from '../middlewares/uploadMiddleware';

const router = express.Router();

// Upload screenshot (with multer middleware)
router.post("/screenshot", authMiddleware, uploadScreenshot, uploadScreenshotController);

// Get screenshot by ID
router.get("/screenshot/:id", getScreenshotController);

// Get all screenshots for a match
router.get("/screenshots/:matchId", getMatchScreenshotsController);

// Delete screenshot
router.delete("/screenshot/:id", authMiddleware, deleteScreenshotController);

// Serve static screenshots
router.use('/screenshots', express.static('uploads/screenshots'));

export default router;