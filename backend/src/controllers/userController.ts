
import { Request, Response } from "express";
import { prisma } from "../database/db";

export const getAll = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

export const getAdmins = async (req: Request, res: Response) => {
    try {
        const admins = await prisma.user.findMany({
            where: { role: "admin" },
        });
        res.json(admins);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch admins" });
    }
};

export const getManagers = async (req: Request, res: Response) => {
    try {
        const managers = await prisma.user.findMany({
            where: { role: "manager" },
        });
        res.json(managers);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch managers" });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            where: { role: "user" },
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};