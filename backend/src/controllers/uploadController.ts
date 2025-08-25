import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { prisma } from '../database/db';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/screenshots';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `match-${req.params.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export const uploadMatchScreenshot = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const matchId = req.params.id;
        
        // Check if match exists
        const match = await prisma.match.findUnique({
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
    } catch (error) {
        console.error('Error uploading screenshot:', error);
        res.status(500).json({ message: 'Failed to upload screenshot', error });
    }
};

// Export the multer upload middleware
export const uploadScreenshotMiddleware = upload.single('screenshot');