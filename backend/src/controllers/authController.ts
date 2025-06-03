import { Request, Response } from 'express';
import { prisma } from "../database/db";

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerController = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ 
                message: 'User already exists' 
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
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
    } catch (error) {
        res.status(500).json({ 
            message: 'Registration failed', error 
        });
    }
};

export const loginController = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            return res.status(401).json({
                message: 'Invalid user'
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
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
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Login failed', error
        });
    }
};

export const verifyToken = async (req: Request, res: Response) => {

    if(!req.headers.authorization){
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: number };
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });
        if (!user) {
            return res.status(401).json({
                message: 'User not found'
            });
        }
        res.json({
            message : "Token Verified, user found",
            user: {
                name: user.name,
                phone: user.phone,
                email: user.email
            }
        });
    } catch (error) {
        res.status(401).json({
            message: 'Invalid token', error
        });
    }
};