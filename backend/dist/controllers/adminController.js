"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.demotionController = exports.promotionController = void 0;
const db_1 = require("../database/db");
const promotionController = async (req, res) => {
    const { id } = req.body;
    let role = "manager";
    if (!id) {
        res.status(400).json({
            message: "ID is required",
            color: "red"
        });
        return;
    }
    try {
        const user = await db_1.prisma.user.findUnique({
            where: { id: id }
        });
        if (!user) {
            res.status(404).json({
                message: "User not found",
                color: "red"
            });
            return;
        }
        if (user.role == "admin") {
            res.status(400).json({
                message: `${user.name} with ID ${user.id} is already an admin`,
                color: "red"
            });
            return;
        }
        if (user.role == "manager") {
            role = "admin";
        }
        await db_1.prisma.user.update({
            where: { id: id },
            data: {
                role: role
            }
        });
        res.status(200).json({
            message: `User : ${user.name} with Phone ${user.phone} promoted from ${user.role} to ${role}`,
            color: "green"
        });
    }
    catch (error) {
        console.error("Error promoting user:", error);
        res.status(500).json({
            message: "Internal server error",
            color: "red"
        });
    }
};
exports.promotionController = promotionController;
const demotionController = async (req, res) => {
    const { id } = req.body;
    let role = "user";
    if (!id) {
        res.status(400).json({
            message: "ID is required",
            color: "red"
        });
        return;
    }
    try {
        const user = await db_1.prisma.user.findUnique({
            where: { id: id }
        });
        if (!user) {
            res.status(404).json({
                message: "User not found",
                color: "red"
            });
            return;
        }
        if (user.role == "user") {
            res.status(400).json({
                message: `${user.name} with ID ${user.id} is already on user role`,
                color: "red"
            });
            return;
        }
        if (user.role == "admin") {
            role = "manager";
        }
        await db_1.prisma.user.update({
            where: { id: id },
            data: {
                role: role
            }
        });
        res.status(200).json({
            message: `User : ${user.name} with Phone ${user.phone} demoted from ${user.role} to ${role}`,
            color: "green"
        });
    }
    catch (error) {
        console.error("Error demoting user:", error);
        res.status(500).json({
            message: "Internal server error",
            color: "red"
        });
    }
};
exports.demotionController = demotionController;
