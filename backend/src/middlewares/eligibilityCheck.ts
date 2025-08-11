import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database/db';


export const eligibilityCheck = async(req: Request, res: Response, next: NextFunction) => {

    try{
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
        next();
    } else {
        res.status(403).json({
            message : "Forbidden: User is not eligible",
            inScore : user.inScore
        });
        return;
    }
    } catch (error) {
        console.error("Error in eligibilityCheck middleware:", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}