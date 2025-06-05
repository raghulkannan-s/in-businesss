"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateScore = exports.getScore = void 0;
const db_1 = require("../database/db");
const getScore = async (req, res) => {
    const { phone } = req.user;
    try {
        const user = await db_1.prisma.user.findUnique({
            where: { phone: phone }
        });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({
            score: user.score
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve score'
        });
        return;
    }
};
exports.getScore = getScore;
const updateScore = async (req, res) => {
    const { id } = req.params;
    const parsedId = parseInt(id);
    console.log("ID:", parsedId, "Type:", typeof parsedId);
    if (!id || isNaN(parsedId)) {
        res.status(400).json({
            message: "A valid numeric ID is required"
        });
        return;
    }
    const { score } = req.body;
    const parsedScore = parseInt(score);
    if (parsedScore === undefined || parsedScore === null) {
        res.status(400).json({
            message: "Score is required"
        });
        return;
    }
    console.log("Score:", parsedScore, "Type:", typeof parsedScore);
    try {
        const user = await db_1.prisma.user.update({
            where: { id: parsedId },
            data: { score: parsedScore }
        });
        console.log("User", user);
        res.status(200).json({
            message: 'Score updated successfully',
            user: user
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            message: 'Failed to update score'
        });
        return;
    }
};
exports.updateScore = updateScore;
