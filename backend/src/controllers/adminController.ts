import { Request, Response } from 'express';
import { prisma } from '../database/db';

export const promotionController = async (req : Request, res : Response) => {

    const { id } = req.body;
    let role = "manager";
    if(!id) {
        res.status(400).json({
            message: "ID is required"
        });
        return;
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id: id }
        });

        if (!user) {
            res.status(404).json({
                message: "User not found"
            });
            return;
        }
        if(user.role == "admin") {
            res.status(400).json({
                message: `${user.name} with ID ${user.id} is already an admin`
            });
            return;
        }
        if(user.role == "manager") {
            role = "admin";
        }
        await prisma.user.update({
            where: { id: id },
            data: {
                role: role
            }
        });

        res.status(200).json({
            message: `User : ${user.name} with Phone ${user.phone} promoted from ${user.role} to ${role}`
        });
    } catch (error) {
        console.error("Error promoting user:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }

}

export const demotionController = async (req : Request, res : Response) => {
    const {id} = req.body;
    let role = "user";
    if(!id) {
        res.status(400).json({
            message: "ID is required"
        });
        return;
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id: id }
        });

        if (!user) {
            res.status(404).json({
                message: "User not found"
            });
            return;
        }
        if(user.role == "user") {
            res.status(400).json({
                message: `${user.name} with ID ${user.id} is already on user role`
            });
            return;
        }
        if(user.role == "admin") {
            role = "manager";
        }
        await prisma.user.update({
            where: { id: id },
            data: {
                role: role
            }
        });

        res.status(200).json({
            message: `User : ${user.name} with Phone ${user.phone} demoted from ${user.role} to ${role}`
        });
    } catch (error) {
        console.error("Error demoting user:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}
