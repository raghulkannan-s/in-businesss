import { Request, Response } from 'express';
import { prisma } from '../database/db';

export const getScore = async (req: Request, res: Response) => {
    const { phone } = (req as any).user;
    try {
        const user = await prisma.user.findUnique({
            where: { phone : phone }
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({
            inScore: user.inScore
        });
        return;
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve score'
        });
        return;
    }
}

export const updateScore = async (req: Request, res: Response) =>{
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
        res.status(400).json({
            message: "A valid numeric ID is required"
        });
        return;
    }
    const { inScore } = req.body;
    const parsedScore = parseInt(inScore);
    if (parsedScore === undefined || parsedScore === null) {
        res.status(400).json({
            message: "Score is required"
        });
        return;
    }
    try {
        const user = await prisma.user.update({
            where: { id: parsedId },
            data: { inScore: parsedScore }
        });
        res.status(200).json({
            message: 'Score updated successfully',
            user: user
        });
        return;
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update score'
        });
        return;
    }
}