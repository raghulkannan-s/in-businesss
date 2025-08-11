"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.demotionController = exports.promotionController = void 0;
const db_1 = require("../database/db");
const client_1 = require("@prisma/client");
const promotionController = async (req, res) => {
    const { id } = req.body;
    let role = client_1.UserRole.manager;
    if (!id) {
        res.status(400).json({
            message: "ID is required"
        });
        return;
    }
    try {
        const user = await db_1.prisma.user.findUnique({
            where: { id: id }
        });
        if (!user) {
            res.status(404).json({
                message: "User not found"
            });
            return;
        }
        if (user.role == client_1.UserRole.admin) {
            res.status(400).json({
                message: `${user.name} with ID ${user.id} is already an admin`
            });
            return;
        }
        if (user.role == client_1.UserRole.manager) {
            role = client_1.UserRole.admin;
        }
        await db_1.prisma.user.update({
            where: { id: id },
            data: {
                role: role
            }
        });
        res.status(200).json({
            message: `User : ${user.name} with Phone ${user.phone} promoted from ${user.role} to ${role}`
        });
    }
    catch (error) {
        console.error("Error promoting user:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};
exports.promotionController = promotionController;
const demotionController = async (req, res) => {
    const { id } = req.body;
    let role = client_1.UserRole.user;
    if (!id) {
        res.status(400).json({
            message: "ID is required"
        });
        return;
    }
    try {
        const user = await db_1.prisma.user.findUnique({
            where: { id: id }
        });
        if (!user) {
            res.status(404).json({
                message: "User not found"
            });
            return;
        }
        if (user.role == client_1.UserRole.user) {
            res.status(400).json({
                message: `${user.name} with ID ${user.id} is already on user role`
            });
            return;
        }
        if (user.role == client_1.UserRole.admin) {
            role = client_1.UserRole.manager;
        }
        await db_1.prisma.user.update({
            where: { id: id },
            data: {
                role: role
            }
        });
        res.status(200).json({
            message: `User : ${user.name} with Phone ${user.phone} demoted from ${user.role} to ${role}`
        });
    }
    catch (error) {
        console.error("Error demoting user:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};
exports.demotionController = demotionController;
