import { Request, Response } from "express";
import { prisma } from "../database/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


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

    const user = await prisma.user.findUnique({ where: { phone: phone } });

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid password" });
      return;
    }

    const accessToken = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "7d" });

    const { password: _, id: __, ...userWithoutPasswordandId } = user;

    res.status(200).json({
      message: "Login successful",
      user: { ...userWithoutPasswordandId },
      accessToken,
      refreshToken
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
    res.status(200).json({
      message: "Logout successful"
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      message: "Logout failed",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401).json({ message: "Refresh token is required" });
      return;
    }

    // Verify the refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { userId: number };
    } catch (error) {
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    // Generate new access token
    const newAccessToken = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: "15m",
    });

    // Return user data with new token
    const { password: _, id: __, ...userWithoutPasswordandId } = user;

    res.status(200).json({
      accessToken: newAccessToken,
      user: userWithoutPasswordandId
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({
      message: "Failed to refresh token",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};


