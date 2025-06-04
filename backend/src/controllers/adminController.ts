import { Request, Response } from 'express';
import { prisma } from '../database/db';

export const promotionController = async (req : Request, res : Response) => {

    const {phone, role} = req.params;

    if(!phone || !role) {
        res.status(400).send("Phone and role are required");
        return;
    }
    try {
        const user = await prisma.user.findUnique({
            where: { phone: phone }
        });

        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        await prisma.user.update({
            where: { phone: phone },
            data: {
                role: role
            }
        });

        res.status(200).send(`User ${user.name} with phone ${user.phone} promoted from ${user.role} to ${role}`);
    } catch (error) {
        console.error("Error promoting user:", error);
        res.status(500).send("Internal server error");
    }

}

export const demotionController = async (req : Request, res : Response) => {
    const {phone, role} = req.params;

    if(!phone || !role) {
        res.status(400).send("Phone and role are required");
        return;
    }
    try {
        const user = await prisma.user.findUnique({
            where: { phone: phone }
        });

        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        await prisma.user.update({
            where: { phone: phone },
            data: {
                role: role
            }
        });

        res.status(200).send(`User ${user.name} with phone ${user.phone} demoted from ${user.role} to ${role}`);
    } catch (error) {
        console.error("Error demoting user:", error);
        res.status(500).send("Internal server error");
    }
}
