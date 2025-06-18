import { Request, Response } from "express";
import { prisma } from "../database/db";

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
    const { name, email, phone } = req.body;
    
    // Validate input
    if (!name || !email || !phone) {
      res.status(400).json({ message: "Name, email, and phone are required" });
      return;
    }

    const userExists = await prisma.user.findUnique({ where: { phone: phone } });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const user = await prisma.user.create({
      data: { name, email, phone },
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
    const { phone } = req.body;

    if (!phone) {
      res.status(400).json({ message: "Phone number is required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { phone: phone } });

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role,
        eligibility: user.eligibility,
        score: user.score
      }
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
  res.json({ message: "Logged out successfully" });
};
