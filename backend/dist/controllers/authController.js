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
    const { email, password, name, phone } = req.body;
    try {
        const existingUser = await db_1.prisma.user.findUnique({
            where: { phone }
        });
        if (existingUser) {
            res.status(400).json({
                message: 'User already exists'
            });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await db_1.prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                name: name,
                phone: phone,
                role: "user"
            },
        });
        res.status(201).json({ message: 'User registered successfully', user: {
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
    const { phone, password } = req.body;
    try {
        const user = await db_1.prisma.user.findUnique({
            where: { phone }
        });
        if (!user) {
            res.status(401).json({
                message: 'Invalid user'
            });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({
                message: 'Password Incorrect'
            });
            return;
        }
        if (!process.env.JWT_SECRET) {
            res.status(500).json({
                message: 'JWT secret not configured. Contact Developer'
            });
            return;
        }
        if (user.eligibility == false) {
            res.status(403).json({
                message: "User is not eligible"
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            role: user.role,
            name: user.name,
            phone: user.phone,
            eligibility: user.eligibility
        }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({
            message: "Login successful",
            token,
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                eligibility: user.eligibility
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
        res.status(401).json({
            message: 'No authorization header provided'
        });
        return;
    }
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({
            message: 'No token provided'
        });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        if (!process.env.JWT_SECRET) {
            res.status(500).json({
                message: 'JWT secret not configured. Contact Developer'
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await db_1.prisma.user.findUnique({
            where: { id: decoded.userId }
        });
        if (!user) {
            res.status(401).json({
                message: 'User not found'
            });
            return;
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
