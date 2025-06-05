import { Request, Response } from 'express';
import { prisma } from "../database/db";

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerController = async (req: Request, res: Response) => {
    const { email, password, name, phone } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({
            where: { phone }
        });
        if (existingUser) {
            res.status(400).json({
                message: 'User already exists'
            });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
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
    } catch (error) {
        res.status(500).json({
            message: 'Registration failed', error
        });
    }
};

export const loginController = async (req: Request, res: Response) => {
    const { phone, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { phone }
        });
        if (!user) {
            res.status(401).json({
                message: 'Invalid user'
            });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
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
        if( user.eligibility == false) {
            res.status(403).json({
                message: "User is not eligible"
            });
            return;
        }
        const token = jwt.sign({
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
    } catch (error) {
        res.status(500).json({
            message: 'Login failed', error
        });
    }
};

export const verifyToken = async (req: Request, res: Response) => {

    if(!req.headers.authorization){
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: number };
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });
        if (!user) {
            res.status(401).json({
                message: 'User not found'
            });
            return;
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