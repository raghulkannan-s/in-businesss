"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.demotionController = exports.promotionController = void 0;
const db_1 = require("../database/db");
const promotionController = async (req, res) => {
    const { id, role } = req.body;
    if (!id || !role) {
        res.status(400).send("id and role are required");
        return;
    }
    try {
        const user = await db_1.prisma.user.findUnique({
            where: { id: id }
        });
        if (!user) {
            res.status(404).send("User not found");
            return;
        }
        await db_1.prisma.user.update({
            where: { id: id },
            data: {
                role: role
            }
        });
        res.status(200).send(`User : ${user.name} with Phone ${user.phone} promoted from ${user.role} to ${role}`);
    }
    catch (error) {
        console.error("Error promoting user:", error);
        res.status(500).send("Internal server error");
    }
};
exports.promotionController = promotionController;
const demotionController = async (req, res) => {
    const { id, role } = req.body;
    if (!id || !role) {
        res.status(400).send("id and role are required");
        return;
    }
    try {
        const user = await db_1.prisma.user.findUnique({
            where: { id: id }
        });
        if (!user) {
            res.status(404).send("User not found");
            return;
        }
        await db_1.prisma.user.update({
            where: { id: id },
            data: {
                role: role
            }
        });
        res.status(200).send(`User : ${user.name} with Phone ${user.phone} demoted from ${user.role} to ${role}`);
    }
    catch (error) {
        console.error("Error demoting user:", error);
        res.status(500).send("Internal server error");
    }
};
exports.demotionController = demotionController;
