import { Request, Response } from 'express';
import { prisma } from '../database/db';

export const promotionController = async (req : Request, res : Response) => {

    const {id, role} = req.body;

    if(!id || !role) {
        res.status(400).send("id and role are required");
        return;
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id: id }
        });

        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        await prisma.user.update({
            where: { id: id },
            data: {
                role: role
            }
        });

        res.status(200).send(`User : ${user.name} with Phone ${user.phone} promoted from ${user.role} to ${role}`);
    } catch (error) {
        console.error("Error promoting user:", error);
        res.status(500).send("Internal server error");
    }

}

export const demotionController = async (req : Request, res : Response) => {
    const {id, role} = req.body;

    if(!id || !role) {
        res.status(400).send("id and role are required");
        return;
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id: id }
        });

        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        await prisma.user.update({
            where: { id: id },
            data: {
                role: role
            }
        });

        res.status(200).send(`User : ${user.name} with Phone ${user.phone} demoted from ${user.role} to ${role}`);
    } catch (error) {
        console.error("Error demoting user:", error);
        res.status(500).send("Internal server error");
    }
}
