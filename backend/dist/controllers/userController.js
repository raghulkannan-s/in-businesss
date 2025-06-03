"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.getManagers = exports.getAdmins = exports.getAll = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAll = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};
exports.getAll = getAll;
const getAdmins = async (req, res) => {
    try {
        const admins = await prisma.user.findMany({
            where: { role: "admin" },
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
        const managers = await prisma.user.findMany({
            where: { role: "manager" },
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
        const users = await prisma.user.findMany({
            where: { role: "user" },
        });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};
exports.getUsers = getUsers;
