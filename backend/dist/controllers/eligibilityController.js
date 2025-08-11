"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockUser = exports.allowUser = void 0;
const db_1 = require("../database/db");
const allowUser = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ message: "User ID is required" });
        return;
    }
    const parsedID = parseInt(id);
    const user = await db_1.prisma.user.update({
        where: { id: parsedID },
        data: { eligibility: true }
    });
    res.status(200).json({
        message: `${user.name} is now eligible`,
        eligibility: user.eligibility,
        inScore: user.inScore
    });
};
exports.allowUser = allowUser;
const blockUser = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ message: "User ID is required" });
        return;
    }
    const parsedID = parseInt(id);
    const user = await db_1.prisma.user.update({
        where: { id: parsedID },
        data: { eligibility: false }
    });
    res.status(200).json({
        message: `${user.name} is now blocked`,
        eligibility: user.eligibility,
        inScore: user.inScore
    });
};
exports.blockUser = blockUser;
