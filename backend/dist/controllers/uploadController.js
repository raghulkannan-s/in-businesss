"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadScreenshotMiddleware = exports.uploadMatchScreenshot = void 0;
const db_1 = require("../database/db");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/screenshots';
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `match-${req.params.id}-${uniqueSuffix}${path_1.default.extname(file.originalname)}`);
    }
});
const upload = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(null, false);
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});
const uploadMatchScreenshot = async (req, res) => {
    try {
        const matchId = req.params.id;
        // Check if match exists
        const match = await db_1.prisma.match.findUnique({
            where: { id: matchId }
        });
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        // Save screenshot info to database (if you have a screenshots table)
        // For now, just return success
        res.status(201).json({
            success: true,
            message: 'Screenshot uploaded successfully',
            filename: req.file.filename,
            path: req.file.path
        });
    }
    catch (error) {
        console.error('Error uploading screenshot:', error);
        res.status(500).json({ message: 'Failed to upload screenshot', error });
    }
};
exports.uploadMatchScreenshot = uploadMatchScreenshot;
// Export the multer upload middleware
exports.uploadScreenshotMiddleware = upload.single('screenshot');
