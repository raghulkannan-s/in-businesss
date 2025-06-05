"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getUsers = exports.getManagers = exports.getAdmins = exports.getAll = void 0;
const db_1 = require("../database/db");
const getAll = async (req, res) => {
    try {
        const users = await db_1.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                score: true,
                phone: true,
                role: true,
                eligibility: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        console.log("Fetched all users:", users);
        res.json(users);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
};
exports.getAll = getAll;
const getAdmins = async (req, res) => {
    try {
        const admins = await db_1.prisma.user.findMany({
            where: { role: "admin" },
            select: {
                id: true,
                email: true,
                name: true,
                score: true,
                phone: true,
                role: true,
                eligibility: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        res.json(admins);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch admins" });
    }
};
exports.getAdmins = getAdmins;
const getManagers = async (req, res) => {
    try {
        const managers = await db_1.prisma.user.findMany({
            where: { role: "manager" },
            select: {
                id: true,
                email: true,
                name: true,
                score: true,
                phone: true,
                role: true,
                eligibility: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        res.json(managers);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch managers" });
    }
};
exports.getManagers = getManagers;
const getUsers = async (req, res) => {
    try {
        const users = await db_1.prisma.user.findMany({
            where: { role: "user" },
            select: {
                id: true,
                email: true,
                name: true,
                score: true,
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
        res.status(500).json({ error: "Failed to fetch users" });
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    const { id } = req.params;
    console.log("Fetching user with ID:", id);
    try {
        const user = await db_1.prisma.user.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                email: true,
                name: true,
                score: true,
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
