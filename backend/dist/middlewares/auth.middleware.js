"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieSessionAuthMiddleware = exports.bearerAuthMiddleware = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = { phone: decoded.phone };
        next();
    }
    catch (err) {
        res.status(401).json({ message: "Invalid token" });
        return;
    }
};
exports.authenticate = authenticate;
const bearerAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized - Missing Bearer token' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = { phone: decoded.phone };
        next();
    }
    catch {
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
};
exports.bearerAuthMiddleware = bearerAuthMiddleware;
const cookieSessionAuthMiddleware = (req, res, next) => {
    const token = req.cookies?.accessToken;
    if (!token) {
        res.status(401).json({ message: 'Unauthorized - Missing cookie token' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = { phone: decoded.phone };
        next();
    }
    catch {
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
};
exports.cookieSessionAuthMiddleware = cookieSessionAuthMiddleware;
