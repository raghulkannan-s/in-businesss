"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = void 0;
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
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
};
exports.roleMiddleware = roleMiddleware;
