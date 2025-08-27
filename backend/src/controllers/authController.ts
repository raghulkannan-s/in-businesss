import { Request, Response } from "express";
import { prisma } from "../database/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateTokens } from "../lib/jwt";

export const getMe = async (req: Request, res: Response) => {
  try {
    const phone = req.query.phone as string;
    if (!phone) {
      res.status(400).json({ error: 'Phone number is required' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { phone: phone },
      select: {
        name: true,
        email: true,
        phone: true,
        role: true,
        eligibility: true
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ user });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      res.status(400).json({ message: "Name, email, phone, and password are required" });
      return;
    }

    const userExists = await prisma.user.findUnique({ where: { phone: phone } });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, phone, password: hashedPassword },
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        phone: user.phone,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      message: "Registration failed", 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body;

    if (!phone) {
      res.status(400).json({ message: "Phone number is required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { phone: phone }, select: {
      id: true,
      password: true,
      name : true,
      email: true,
      role: true,
      phone: true,
      inScore: true,
      eligibility: true
    }});

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid password" });
      return;
    }

    const token = generateTokens(user.id);

    const { password: _, id: __, ...userWithoutPasswordandId } = user;
  
    res.status(200).json({
      message: "Login successful",
      user: { ...userWithoutPasswordandId },
      accessToken: token.accessToken,
      refreshToken: token.refreshToken
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Login failed",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

export const replenish = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.headers.authorization;

    if (!refreshToken) {
      res.status(401).json({ message: "Refresh token is required" });
      return;
    }

    const token = refreshToken.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as { userId: number };
    } catch (error) {
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        inScore: true,
        eligibility: true
      }
    });

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    const newAccessToken = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: "15m",
    });

    const { id: __, ...userWithoutId } = user;

    res.status(200).json({
      accessToken: newAccessToken,
      user: userWithoutId
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({
      message: "Failed to refresh token",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};


