

const roleMiddleware = (allowedRoles: string[]) => {
    return (req: any, res: any, next: any) => {
        const user = req.user;

        if (!user || !user.roles) {
            return res.status(403).json({ message: "Forbidden: No user roles found" });
        }

        const hasRole = user.roles.some((role: string) => allowedRoles.includes(role));

        if (!hasRole) {
            return res.status(403).json({ message: "Forbidden: You do not have the required role" });
        }

        next();
    };
}