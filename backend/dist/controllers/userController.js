"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByPhone = exports.getUserById = exports.getAll = void 0;
const db_1 = require("../database/db");
const getAll = async (req, res) => {
    try {
        const users = await db_1.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                inScore: true,
                phone: true,
                role: true,
                eligibility: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        res.json(users);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
};
exports.getAll = getAll;
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await db_1.prisma.user.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                email: true,
                name: true,
                inScore: true,
                phone: true,
                role: true,
                eligibility: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
};
exports.getUserById = getUserById;
const getUserByPhone = async (req, res) => {
    const { phone } = req.params;
    try {
        const user = await db_1.prisma.user.findUnique({
            where: { phone: phone },
            select: {
                id: true,
                email: true,
                name: true,
                inScore: true,
                phone: true,
                role: true,
                eligibility: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
};
exports.getUserByPhone = getUserByPhone;
