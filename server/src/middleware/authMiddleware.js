import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

export const authMiddleware = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded._id).select("-password");
        next();
    } catch (error) {
        res.status(401).json({ message: "Token is invalid or expired" });
    }
    } else {
    res.status(401).json({ message: "No token, authorization denied" });
    }
};

export const adminMiddleware = async (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Not authorized as an admin" });
    }
};

export const managerMiddleware = async (req, res, next) => {
    if (req.user && (req.user.role === "manager" || req.user.role === "admin")) {
        next();
    } else {
        res.status(403).json({ message: "Not authorized as a manager" });
    }
};

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return null;
        }
        return decoded;
    });
};