import { Request, Response } from 'express';
import { prisma } from '../database/db';


export const getEligibility = async (req : Request, res : Response) => {

    const user = await prisma.user.findUnique({
        where: {
            phone: (req as any).user.phone
        }
    });
    if (!user) {
        res.status(404).json({
            message: "User not found"
        });
        return;
    }
    if(user.eligibility == true){
        res.status(200).json({
            message : `${user.name} is eligible`,
            eligibility: user.eligibility,
            score : user.score
        });
    } else {
        res.status(403).json({
            message : "Forbidden: User is not eligible",
            score : user.score
        });
    }
}

export const allowUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ message: "User ID is required" });
        return;
    }
    const parsedID = parseInt(id);
    const user = await prisma.user.update({
        where: { id : parsedID },
        data: { eligibility: true }
    });

    res.status(200).json({
        message: `${user.name} is now eligible`,
        eligibility: user.eligibility,
        score : user.score
    });
};

export const blockUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ message: "User ID is required" });
        return;
    }
    const parsedID = parseInt(id);
    const user = await prisma.user.update({
        where: { id: parsedID },
        data: { eligibility: false }
    });

    res.status(200).json({
        message: `${user.name} is now blocked`,
        eligibility: user.eligibility,
        score : user.score
    });
};