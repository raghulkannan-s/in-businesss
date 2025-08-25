import { Request, Response } from "express";
import { prisma } from "../database/db";

export const getAll = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
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
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
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
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
};

export const getUserByPhone = async (req: Request, res: Response) => {
    const { phone } = req.params;
    try {
        const user = await prisma.user.findUnique({
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
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { email, name, phone, role, eligibility } = req.body;
    try {
        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                email,
                name,
                phone,
                role,
                eligibility,
            },
        });
        res.json(user);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Failed to update user" });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Failed to delete user" });
    }
};