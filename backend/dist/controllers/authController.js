"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.logout = exports.login = exports.register = exports.getMe = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../lib/jwt");
const hash_1 = require("../lib/hash");
const db_1 = require("../database/db");
const getMe = async (req, res) => {
    try {
        const phone = req.user.phone;
        if (!phone) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }
        const user = await db_1.prisma.user.findUnique({
            where: { phone: phone },
            select: {
                name: true,
                email: true,
                phone: true,
                role: true,
                eligibility: true,
                score: true,
            },
        });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json({ user });
        return;
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
};
exports.getMe = getMe;
const register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        // Validate input
        if (!name || !email || !phone || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const userExists = await db_1.prisma.user.findUnique({ where: { phone: phone } });
        if (userExists) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const user = await db_1.prisma.user.create({
            data: { name, email, phone, password: hashedPassword },
        });
        const accessToken = (0, jwt_1.generateAccessToken)(user.phone);
        const refreshToken = (0, jwt_1.generateRefreshToken)(user.phone);
        const hashedRefreshToken = await (0, hash_1.hashToken)(refreshToken);
        await db_1.prisma.user.update({
            where: { phone: user.phone },
            data: { refreshToken: hashedRefreshToken },
        });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(201).json({
            phone: user.phone,
            name: user.name,
            email: user.email
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            message: "Registration failed",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        if (!phone || !password) {
            res.status(400).json({ message: "Phone and password are required" });
            return;
        }
        const user = await db_1.prisma.user.findUnique({ where: { phone: phone } });
        if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        const accessToken = (0, jwt_1.generateAccessToken)(user.phone);
        const refreshToken = (0, jwt_1.generateRefreshToken)(user.phone);
        const hashedRefreshToken = await (0, hash_1.hashToken)(refreshToken);
        await db_1.prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: hashedRefreshToken },
        });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({
            phone: user.phone,
            name: user.name,
            email: user.email
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: "Login failed",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.login = login;
const logout = async (req, res) => {
    try {
        const phone = req.user.phone;
        await db_1.prisma.user.update({ where: { phone: phone }, data: { refreshToken: null } });
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.json({ message: "Logged out" });
    }
    catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            message: "Logout failed",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.logout = logout;
const refreshAccessToken = async (req, res) => {
    const incomingToken = req.cookies.refreshToken;
    if (!incomingToken) {
        res.status(401).json({ message: "No refresh token" });
        return;
    }
    try {
        const decoded = (0, jwt_1.verifyToken)(incomingToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await db_1.prisma.user.findUnique({ where: { phone: decoded.phone } });
        if (!user || !user.refreshToken)
            throw new Error("User not found");
        const match = await (0, hash_1.compareToken)(incomingToken, user.refreshToken);
        if (!match) {
            res.status(403).json({ message: "Invalid refresh token" });
            return;
        }
        const newAccessToken = (0, jwt_1.generateAccessToken)(user.phone);
        const newRefreshToken = (0, jwt_1.generateRefreshToken)(user.phone);
        const hashed = await (0, hash_1.hashToken)(newRefreshToken);
        await db_1.prisma.user.update({
            where: { phone: user.phone },
            data: { refreshToken: hashed },
        });
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({ message: "Refreshed" });
    }
    catch (err) {
        res.status(403).json({ message: "Invalid or expired refresh token" });
        return;
    }
};
exports.refreshAccessToken = refreshAccessToken;
