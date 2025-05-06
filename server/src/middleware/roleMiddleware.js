const roleMiddleware = (allowedRoles = []) => {
    return (req, res, next) => {
        if (!req.body.role) {
            return res.status(400).json({ message: "Role is required" });
        }
        const userRole = req.body.role;
        if (allowedRoles.includes(userRole)) {
            next();
        } else {
            return res.status(403).json({ message: "Forbidden" });
        }
    }
}