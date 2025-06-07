import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../lib/jwt";
import { hashToken, compareToken } from "../lib/hash";

import { prisma } from "../database/db";

export const getMe = async (req: Request, res: Response) => {
  try {
    const phone = (req as any).user.phone;
    if (!phone) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const user = await prisma.user.findUnique({
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  }
};


export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;
    
    // Validate input
    if (!name || !email || !phone || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const userExists = await prisma.user.findUnique({ where: { phone: phone } });
    if (userExists){
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const user = await prisma.user.create({
      data: { name, email, phone, password: hashedPassword },
    });

    const accessToken = generateAccessToken(user.phone);
    const refreshToken = generateRefreshToken(user.phone);
    const hashedRefreshToken = await hashToken(refreshToken);

    await prisma.user.update({
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

    if (!phone || !password) {
      res.status(400).json({ message: "Phone and password are required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { phone: phone } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    
    const accessToken = generateAccessToken(user.phone);
    const refreshToken = generateRefreshToken(user.phone);
    const hashedRefreshToken = await hashToken(refreshToken);

    await prisma.user.update({
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
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      message: "Login failed", 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const phone = (req as any).user.phone;
    await prisma.user.update({ where: { phone: phone }, data: { refreshToken: null } });

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({ message: "Logged out" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ 
      message: "Logout failed", 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const incomingToken = req.cookies.refreshToken;
  if (!incomingToken) {
    res.status(401).json({ message: "No refresh token" });
    return;
  }

  try {
    const decoded = verifyToken(incomingToken, process.env.REFRESH_TOKEN_SECRET!) as { phone: string };
    const user = await prisma.user.findUnique({ where: { phone: decoded.phone } });
    if (!user || !user.refreshToken) throw new Error("User not found");

    const match = await compareToken(incomingToken, user.refreshToken);
    if (!match) {
      res.status(403).json({ message: "Invalid refresh token" });
      return;
    }

    const newAccessToken = generateAccessToken(user.phone);
    const newRefreshToken = generateRefreshToken(user.phone);
    const hashed = await hashToken(newRefreshToken);

    await prisma.user.update({
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
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
    return;
    }
};
