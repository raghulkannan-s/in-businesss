import { Request, Response } from "express";
import { prisma } from "../database/db";

export const getAll = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
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
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

export const getAdmins = async (req: Request, res: Response) => {
    try {
        const admins = await prisma.user.findMany({
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
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch admins" });
    }
};

export const getManagers = async (req: Request, res: Response) => {
    try {
        const managers = await prisma.user.findMany({
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
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch managers" });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
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
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log("Fetching user with ID:", id);
    try {
        const user = await prisma.user.findUnique({
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
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
};