"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteScreenshotController = exports.getMatchScreenshotsController = exports.getScreenshotController = exports.uploadScreenshotController = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const log_model_1 = __importDefault(require("../models/log.model"));
const uploadScreenshotController = async (req, res) => {
    try {
        const file = req.file;
        const { matchId, description, over, ball } = req.body;
        if (!file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }
        if (!matchId) {
            res.status(400).json({ message: 'Match ID is required' });
            return;
        }
        const screenshotLog = new log_model_1.default({
            matchId,
            playerId: req.user?.id || 0,
            action: 'screenshot',
            runs: 0,
            over: parseInt(over) || 0,
            ball: parseInt(ball) || 0,
            commentary: description || 'Screenshot uploaded',
            metadata: {
                filename: file.filename,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                uploadedBy: req.user?.name || 'Unknown',
                uploadedAt: new Date()
            }
        });
        await screenshotLog.save();
        const fileUrl = `/screenshots/${file.filename}`;
        res.status(201).json({
            message: 'Screenshot uploaded successfully',
            file: {
                id: screenshotLog._id,
                filename: file.filename,
                originalname: file.originalname,
                url: fileUrl,
                size: file.size,
                matchId,
                description,
                uploadedAt: screenshotLog.timestamp
            }
        });
    }
    catch (error) {
        console.error("Error uploading screenshot:", error);
        res.status(500).json({ message: 'Failed to upload screenshot', error: error.message });
    }
};
exports.uploadScreenshotController = uploadScreenshotController;
// Get screenshot by ID
const getScreenshotController = async (req, res) => {
    try {
        const { id } = req.params;
        // Find screenshot metadata in MongoDB
        const screenshotLog = await log_model_1.default.findById(id);
        if (!screenshotLog || screenshotLog.action !== 'screenshot') {
            res.status(404).json({ message: 'Screenshot not found' });
            return;
        }
        const filename = screenshotLog.metadata.filename;
        const filePath = path_1.default.join(__dirname, '../../uploads/screenshots', filename);
        // Check if file exists
        if (!fs_1.default.existsSync(filePath)) {
            res.status(404).json({ message: 'Screenshot file not found on disk' });
            return;
        }
        // Set appropriate headers
        res.setHeader('Content-Type', screenshotLog.metadata.mimetype);
        res.setHeader('Content-Disposition', `inline; filename="${screenshotLog.metadata.originalname}"`);
        // Stream the file
        const fileStream = fs_1.default.createReadStream(filePath);
        fileStream.pipe(res);
    }
    catch (error) {
        console.error("Error retrieving screenshot:", error);
        res.status(500).json({ message: 'Failed to retrieve screenshot', error: error.message });
    }
};
exports.getScreenshotController = getScreenshotController;
// Get all screenshots for a match
const getMatchScreenshotsController = async (req, res) => {
    try {
        const { matchId } = req.params;
        const screenshots = await log_model_1.default.find({
            matchId,
            action: 'screenshot'
        }).sort({ timestamp: -1 });
        const screenshotList = screenshots.map((screenshot) => ({
            id: screenshot._id,
            filename: screenshot.metadata.filename,
            originalname: screenshot.metadata.originalname,
            url: `/screenshots/${screenshot.metadata.filename}`,
            size: screenshot.metadata.size,
            description: screenshot.commentary,
            over: screenshot.over,
            ball: screenshot.ball,
            uploadedBy: screenshot.metadata.uploadedBy,
            uploadedAt: screenshot.timestamp
        }));
        res.status(200).json({
            message: 'Screenshots retrieved successfully',
            matchId,
            screenshots: screenshotList,
            count: screenshotList.length
        });
    }
    catch (error) {
        console.error("Error retrieving match screenshots:", error);
        res.status(500).json({ message: 'Failed to retrieve screenshots', error: error.message });
    }
};
exports.getMatchScreenshotsController = getMatchScreenshotsController;
// Delete screenshot
const deleteScreenshotController = async (req, res) => {
    try {
        const { id } = req.params;
        // Find screenshot metadata
        const screenshotLog = await log_model_1.default.findById(id);
        if (!screenshotLog || screenshotLog.action !== 'screenshot') {
            res.status(404).json({ message: 'Screenshot not found' });
            return;
        }
        const filename = screenshotLog.metadata.filename;
        const filePath = path_1.default.join(__dirname, '../../uploads/screenshots', filename);
        // Delete file from disk
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
        // Delete metadata from MongoDB
        await log_model_1.default.findByIdAndDelete(id);
        res.status(200).json({
            message: 'Screenshot deleted successfully',
            deletedFile: {
                id,
                filename,
                originalname: screenshotLog.metadata.originalname
            }
        });
    }
    catch (error) {
        console.error("Error deleting screenshot:", error);
        res.status(500).json({ message: 'Failed to delete screenshot', error: error.message });
    }
};
exports.deleteScreenshotController = deleteScreenshotController;
