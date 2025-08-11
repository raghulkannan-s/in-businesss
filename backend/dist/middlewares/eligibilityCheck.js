"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eligibilityCheck = void 0;
const db_1 = require("../database/db");
const eligibilityCheck = async (req, res, next) => {
    try {
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
            next();
        }
        else {
            res.status(403).json({
                message: "Forbidden: User is not eligible",
                inScore: user.inScore
            });
            return;
        }
    }
    catch (error) {
        console.error("Error in eligibilityCheck middleware:", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
exports.eligibilityCheck = eligibilityCheck;
