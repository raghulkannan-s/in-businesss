"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockUser = exports.allowUser = exports.getEligibility = void 0;
const db_1 = require("../database/db");
const getEligibility = async (req, res) => {
    const user = await db_1.prisma.user.findUnique({
        where: {
            phone: req.user.phone
        }
    });
    if (!user) {
        res.status(404).json({
            message: "User not found"
        });
        return;
    }
    if (user.eligibility == true) {
        res.status(200).json({
            message: `${user.name} is eligible`,
            eligibility: user.eligibility,
            score: user.score
        });
    }
    else {
        res.status(403).json({
            message: "Forbidden: User is not eligible",
            score: user.score
        });
    }
};
exports.getEligibility = getEligibility;
const allowUser = async (req, res) => {
    const { phone } = req.params;
    const user = await db_1.prisma.user.update({
        where: { phone },
        data: { eligibility: true }
    });
    res.status(200).json({
        message: `${user.name} is now eligible`,
        eligibility: user.eligibility,
        score: user.score
    });
};
exports.allowUser = allowUser;
const blockUser = async (req, res) => {
    const { phone } = req.params;
    const user = await db_1.prisma.user.update({
        where: { phone },
        data: { eligibility: false }
    });
    res.status(200).json({
        message: `${user.name} is now blocked`,
        eligibility: user.eligibility,
        score: user.score
    });
};
exports.blockUser = blockUser;
