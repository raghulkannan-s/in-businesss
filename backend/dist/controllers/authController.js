"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.loginController = exports.registerController = void 0;
const db_1 = require("../database/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerController = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await db_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await db_1.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: req.body.name,
                phone: req.body.phone
            },
        });
        res.status(201).json({ message: 'User registered', user: {
                name: user.name,
                phone: user.phone,
                email: user.email
            } });
    }
    catch (error) {
        res.status(500).json({
            message: 'Registration failed', error
        });
    }
};
exports.registerController = registerController;
const loginController = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await db_1.prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            return res.status(401).json({
                message: 'Invalid user'
            });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: 'Password Incorrect'
            });
        }
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                message: 'JWT secret not configured. Contact Developer'
            });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Login failed', error
        });
    }
};
exports.loginController = loginController;
const verifyToken = async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            message: 'No authorization header provided'
        });
    }
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            message: 'No token provided'
        });
    }
    const token = authHeader.split(' ')[1];
    try {
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                message: 'JWT secret not configured. Contact Developer'
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await db_1.prisma.user.findUnique({
            where: { id: decoded.userId }
        });
        if (!user) {
            return res.status(401).json({
                message: 'User not found'
            });
        }
        res.json({
            message: "Token Verified, user found",
            user: {
                name: user.name,
                phone: user.phone,
                email: user.email
            }
        });
    }
    catch (error) {
        res.status(401).json({
            message: 'Invalid token', error
        });
    }
};
exports.verifyToken = verifyToken;
