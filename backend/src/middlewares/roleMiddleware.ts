import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware';

export const roleMiddleware = (allowedRoles: string[]) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const user = req.user;

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