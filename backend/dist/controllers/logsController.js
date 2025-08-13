"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBallByBallCommentary = exports.getLogsByMatchController = exports.storeLogController = void 0;
const Log = require('../models/log.model');
// Store log in MongoDB
const storeLogController = async (req, res) => {
    try {
        const { matchId, playerId, action, runs, over, ball, commentary, extras, isWicket, wicketType, bowlerId, fielderId, metadata } = req.body;
        // Validate required fields
        if (!matchId || !playerId || !action || runs === undefined || !over || !ball) {
            res.status(400).json({
                message: 'matchId, playerId, action, runs, over, and ball are required'
            });
            return;
        }
        // Create log entry
        const logEntry = new Log({
            matchId,
            playerId: parseInt(playerId),
            action,
            runs: parseInt(runs),
            over: parseInt(over),
            ball: parseInt(ball),
            commentary: commentary || '',
            extras: parseInt(extras) || 0,
            isWicket: Boolean(isWicket),
            wicketType,
            bowlerId: bowlerId ? parseInt(bowlerId) : null,
            fielderId: fielderId ? parseInt(fielderId) : null,
            metadata: metadata || {}
        });
        await logEntry.save();
        res.status(201).json({
            message: 'Log stored successfully',
            log: logEntry
        });
    }
    catch (error) {
        console.error("Error storing log:", error);
        res.status(500).json({ message: 'Failed to store log', error: error.message });
    }
};
exports.storeLogController = storeLogController;
// Get logs by matchId
const getLogsByMatchController = async (req, res) => {
    try {
        const { matchId } = req.params;
        if (!matchId) {
            res.status(400).json({ message: 'Match ID is required' });
            return;
        }
        // Get logs for the match
        const logs = await Log.find({ matchId })
            .sort({ over: 1, ball: 1, timestamp: 1 })
            .exec();
        // Get match statistics from logs
        const stats = {
            totalBalls: logs.length,
            totalRuns: logs.reduce((sum, log) => sum + log.runs, 0),
            totalExtras: logs.reduce((sum, log) => sum + log.extras, 0),
            totalWickets: logs.filter((log) => log.isWicket).length,
            boundaries: logs.filter((log) => log.runs === 4).length,
            sixes: logs.filter((log) => log.runs === 6).length,
            currentOver: Math.max(...logs.map((log) => log.over), 0),
            lastBall: logs.length > 0 ? logs[logs.length - 1] : null
        };
        res.status(200).json({
            message: 'Logs retrieved successfully',
            matchId,
            stats,
            logs,
            totalLogs: logs.length
        });
    }
    catch (error) {
        console.error("Error fetching logs:", error);
        res.status(500).json({ message: 'Failed to fetch logs', error: error.message });
    }
};
exports.getLogsByMatchController = getLogsByMatchController;
// Get ball-by-ball commentary
const getBallByBallCommentary = async (req, res) => {
    try {
        const { matchId } = req.params;
        const { over, limit = 20 } = req.query;
        const query = { matchId };
        if (over) {
            query.over = parseInt(over);
        }
        const logs = await Log.find(query)
            .sort({ over: -1, ball: -1, timestamp: -1 })
            .limit(parseInt(limit))
            .exec();
        const commentary = logs.map((log) => ({
            over: log.over,
            ball: log.ball,
            runs: log.runs,
            action: log.action,
            commentary: log.commentary,
            isWicket: log.isWicket,
            wicketType: log.wicketType,
            timestamp: log.timestamp
        }));
        res.status(200).json({
            message: 'Commentary retrieved successfully',
            matchId,
            commentary
        });
    }
    catch (error) {
        console.error("Error fetching commentary:", error);
        res.status(500).json({ message: 'Failed to fetch commentary', error: error.message });
    }
};
exports.getBallByBallCommentary = getBallByBallCommentary;
