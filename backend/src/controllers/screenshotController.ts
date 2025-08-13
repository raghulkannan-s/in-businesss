import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import path from 'path';
import fs from 'fs';

import Log from "../models/log.model";

interface UploadedFile {
    filename: string;
    originalname: string;
    mimetype: string;
    size: number;
    path: string;
}

export const uploadScreenshotController = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const file = req.file as UploadedFile;
        const { matchId, description, over, ball } = req.body;

        if (!file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        if (!matchId) {
            res.status(400).json({ message: 'Match ID is required' });
            return;
        }

        const screenshotLog = new Log({
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
    } catch (error) {
        console.error("Error uploading screenshot:", error);
        res.status(500).json({ message: 'Failed to upload screenshot', error: (error as Error).message });
    }
};

// Get screenshot by ID
export const getScreenshotController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Find screenshot metadata in MongoDB
        const screenshotLog = await Log.findById(id);

        if (!screenshotLog || screenshotLog.action !== 'screenshot') {
            res.status(404).json({ message: 'Screenshot not found' });
            return;
        }

        const filename = screenshotLog.metadata.filename;
        const filePath = path.join(__dirname, '../../uploads/screenshots', filename);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            res.status(404).json({ message: 'Screenshot file not found on disk' });
            return;
        }

        // Set appropriate headers
        res.setHeader('Content-Type', screenshotLog.metadata.mimetype);
        res.setHeader('Content-Disposition', `inline; filename="${screenshotLog.metadata.originalname}"`);

        // Stream the file
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } catch (error) {
        console.error("Error retrieving screenshot:", error);
        res.status(500).json({ message: 'Failed to retrieve screenshot', error: (error as Error).message });
    }
};

// Get all screenshots for a match
export const getMatchScreenshotsController = async (req: Request, res: Response) => {
    try {
        const { matchId } = req.params;

        const screenshots = await Log.find({
            matchId,
            action: 'screenshot'
        }).sort({ timestamp: -1 });

        const screenshotList = screenshots.map((screenshot: any) => ({
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
    } catch (error) {
        console.error("Error retrieving match screenshots:", error);
        res.status(500).json({ message: 'Failed to retrieve screenshots', error: (error as Error).message });
    }
};

// Delete screenshot
export const deleteScreenshotController = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;

        // Find screenshot metadata
        const screenshotLog = await Log.findById(id);

        if (!screenshotLog || screenshotLog.action !== 'screenshot') {
            res.status(404).json({ message: 'Screenshot not found' });
            return;
        }

        const filename = screenshotLog.metadata.filename;
        const filePath = path.join(__dirname, '../../uploads/screenshots', filename);

        // Delete file from disk
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Delete metadata from MongoDB
        await Log.findByIdAndDelete(id);

        res.status(200).json({
            message: 'Screenshot deleted successfully',
            deletedFile: {
                id,
                filename,
                originalname: screenshotLog.metadata.originalname
            }
        });
    } catch (error) {
        console.error("Error deleting screenshot:", error);
        res.status(500).json({ message: 'Failed to delete screenshot', error: (error as Error).message });
    }
};