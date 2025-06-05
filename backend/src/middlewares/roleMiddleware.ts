import { prisma } from "../database/db";


export const roleMiddleware = (allowedRoles: string[]) => {
    return async (req: any, res: any, next: any) => {
        const user = await prisma.user.findUnique({
            where: { phone: req.user.phone },
        });

        if (!user || !user.role) {
            res.status(403).json({ message: "Forbidden: No user roles found" });
            return;
        }

        const hasRole = allowedRoles.includes(user.role);

        if (!hasRole) {
            res.status(403).json({ message: "Forbidden: You do not have the required role" });
            return;
        }

        next();
    };
}