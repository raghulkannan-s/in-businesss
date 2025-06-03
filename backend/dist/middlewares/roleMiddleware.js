"use strict";
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !user.roles) {
            return res.status(403).json({ message: "Forbidden: No user roles found" });
        }
        const hasRole = user.roles.some((role) => allowedRoles.includes(role));
        if (!hasRole) {
            return res.status(403).json({ message: "Forbidden: You do not have the required role" });
        }
        next();
    };
};
