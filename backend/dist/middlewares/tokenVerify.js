"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenVerify = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokenVerify = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).send("Unauthorized: No token provided");
        return;
    }
    if (!process.env.JWT_SECRET) {
        res.status(500).send("Internal Server Error: JWT secret not configured. Contact the administrator.");
        console.error("JWT secret is not defined in environment variables.");
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log("Token verified successfully:", decoded);
        next();
    }
    catch (err) {
        res.status(401).send("Unauthorized: Invalid token");
    }
};
exports.tokenVerify = tokenVerify;
