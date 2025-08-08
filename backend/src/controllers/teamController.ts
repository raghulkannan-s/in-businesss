import { Request, Response } from 'express';
import { prisma } from '../database/db';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export const createTeam = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { name, logo } = req.body;

        if (!name) {
            res.status(400).json({ message: "Team name is required" });
            return;
        }

        const existingTeam = await prisma.team.findFirst({
            where: { name: name }
        });

        if (existingTeam) {
            res.status(400).json({ message: "Team with this name already exists" });
            return;
        }

        const team = await prisma.team.create({
            data: {
                name,
                logo: logo || null,
            },
        });

        res.status(201).json({
            message: "Team created successfully",
            team,
        });
    } catch (error) {
        console.error("Error creating team:", error);
        res.status(500).json({ message: "Failed to create team" });
    }
};

export const getTeam = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Changed from teamId to id to match router

        if (!id) {
            const teams = await prisma.team.findMany({
                include: {
                    players: { // This is User[] relation in your schema
                        select: {
                            id: true,
                            name: true,
                            phone: true,
                            role: true,
                        },
                    },
                    _count: {
                        select: {
                            players: true,
                            matchesAsTeamA: true,
                            matchesAsTeamB: true,
                        },
                    },
                },
                orderBy: { name: 'asc' },
            });

            res.status(200).json({
                message: "Teams retrieved successfully",
                teams,
            });
            return;
        }

        // Get specific team
        const team = await prisma.team.findUnique({
            where: { id }, // Changed from teamId to id
            include: {
                players: { // This is User[] relation
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        role: true,
                        email: true,
                    },
                    orderBy: { name: 'asc' },
                },
                matchesAsTeamA: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        createdAt: true,
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
                matchesAsTeamB: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        createdAt: true,
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
            },
        });

        if (!team) {
            res.status(404).json({ message: "Team not found" });
            return;
        }

        res.status(200).json({
            message: "Team retrieved successfully",
            team,
        });
    } catch (error) {
        console.error("Error fetching team:", error);
        res.status(500).json({ message: "Failed to fetch team" });
    }
};

export const updateTeam = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params; // Changed from teamId to id
        const { name, logo } = req.body;

        if (!id) {
            res.status(400).json({ message: "Team ID is required" });
            return;
        }

        // Check if team exists
        const existingTeam = await prisma.team.findUnique({
            where: { id },
        });

        if (!existingTeam) {
            res.status(404).json({ message: "Team not found" });
            return;
        }

        // Check if new name conflicts with existing team
        if (name && name !== existingTeam.name) {
            const nameConflict = await prisma.team.findFirst({
                where: {
                    name,
                    id: { not: id },
                },
            });

            if (nameConflict) {
                res.status(400).json({ message: "Team with this name already exists" });
                return;
            }
        }

        const updatedTeam = await prisma.team.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(logo !== undefined && { logo }),
            },
            include: {
                players: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        role: true,
                    },
                },
            },
        });

        res.status(200).json({
            message: "Team updated successfully",
            team: updatedTeam,
        });
    } catch (error) {
        console.error("Error updating team:", error);
        res.status(500).json({ message: "Failed to update team" });
    }
};

export const deleteTeam = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params; // Changed from teamId to id

        if (!id) {
            res.status(400).json({ message: "Team ID is required" });
            return;
        }

        // Check if team exists
        const existingTeam = await prisma.team.findUnique({
            where: { id }, // Changed from teamId to id
            include: {
                _count: {
                    select: {
                        players: true,
                        matchesAsTeamA: true,
                        matchesAsTeamB: true,
                    },
                },
            },
        });

        if (!existingTeam) {
            res.status(404).json({ message: "Team not found" });
            return;
        }

        // Check if team has active matches
        const totalMatches = existingTeam._count.matchesAsTeamA + existingTeam._count.matchesAsTeamB;
        if (totalMatches > 0) {
            res.status(400).json({ 
                message: "Cannot delete team with existing matches",
                matchCount: totalMatches,
            });
            return;
        }

        await prisma.team.delete({
            where: { id }, // Changed from teamId to id
        });

        res.status(200).json({
            message: "Team deleted successfully",
            deletedTeam: {
                id: existingTeam.id,
                name: existingTeam.name,
            },
        });
    } catch (error) {
        console.error("Error deleting team:", error);
        res.status(500).json({ message: "Failed to delete team" });
    }
};

// ========================
// PLAYER MANAGEMENT (Working with User model)
// ========================

export const getTeamPlayers = async (req: Request, res: Response) => {
    try {
        const { teamId } = req.params;

        if (!teamId) {
            res.status(400).json({ message: "Team ID is required" });
            return;
        }

        // Check if team exists
        const team = await prisma.team.findUnique({
            where: { id: teamId },
        });

        if (!team) {
            res.status(404).json({ message: "Team not found" });
            return;
        }

        // Get all users (players) in this team
        const players = await prisma.user.findMany({
            where: { teamId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                eligibility: true,
                createdAt: true,
            },
            orderBy: { name: 'asc' },
        });

        res.status(200).json({
            message: "Team players retrieved successfully",
            team: {
                id: team.id,
                name: team.name,
            },
            players,
        });
    } catch (error) {
        console.error("Error fetching team players:", error);
        res.status(500).json({ message: "Failed to fetch team players" });
    }
};

export const getTeamPlayer = async (req: Request, res: Response) => {
    try {
        const { teamId, playerId } = req.params;

        if (!teamId || !playerId) {
            res.status(400).json({ message: "Team ID and Player ID are required" });
            return;
        }

        const player = await prisma.user.findFirst({
            where: {
                id: parseInt(playerId), // User id is Int in your schema
                teamId,
            },
            include: {
                team: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                    },
                },
                batsman: true, // Include batting stats
                bowler: true,  // Include bowling stats
            },
        });

        if (!player) {
            res.status(404).json({ message: "Player not found in this team" });
            return;
        }

        res.status(200).json({
            message: "Player retrieved successfully",
            player,
        });
    } catch (error) {
        console.error("Error fetching player:", error);
        res.status(500).json({ message: "Failed to fetch player" });
    }
};

export const createTeamPlayers = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { teamId } = req.params;
        const { players } = req.body; // Array of player objects

        if (!teamId) {
            res.status(400).json({ message: "Team ID is required" });
            return;
        }

        if (!players || !Array.isArray(players) || players.length === 0) {
            res.status(400).json({ message: "Players array is required" });
            return;
        }

        // Check if team exists
        const team = await prisma.team.findUnique({
            where: { id: teamId },
        });

        if (!team) {
            res.status(404).json({ message: "Team not found" });
            return;
        }

        // Validate player data
        const validationErrors = [];
        const playerEmails = new Set();
        const playerPhones = new Set();

        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            if (!player.name || !player.email || !player.phone) {
                validationErrors.push(`Player ${i + 1}: Name, email and phone are required`);
            }
            if (playerEmails.has(player.email)) {
                validationErrors.push(`Player ${i + 1}: Duplicate email ${player.email}`);
            }
            if (playerPhones.has(player.phone)) {
                validationErrors.push(`Player ${i + 1}: Duplicate phone ${player.phone}`);
            }
            playerEmails.add(player.email);
            playerPhones.add(player.phone);
        }

        if (validationErrors.length > 0) {
            res.status(400).json({ 
                message: "Validation errors",
                errors: validationErrors,
            });
            return;
        }

        // Check for existing emails/phones
        const existingUsers = await prisma.user.findMany({
            where: {
                OR: [
                    { email: { in: Array.from(playerEmails) } },
                    { phone: { in: Array.from(playerPhones) } }
                ]
            },
            select: { email: true, phone: true },
        });

        if (existingUsers.length > 0) {
            res.status(400).json({
                message: "Some emails or phone numbers already exist",
                conflictingData: existingUsers,
            });
            return;
        }

        // Create players (users)
        const createdPlayers = await prisma.$transaction(
            players.map((player: any) => 
                prisma.user.create({
                    data: {
                        name: player.name,
                        email: player.email,
                        phone: player.phone,
                        password: player.password || 'defaultPassword123', // You should hash this
                        role: player.role || 'user',
                        teamId,
                        eligibility: player.eligibility || 0,
                    },
                })
            )
        );

        res.status(201).json({
            message: "Players created successfully",
            team: {
                id: team.id,
                name: team.name,
            },
            players: createdPlayers.map(p => ({
                id: p.id,
                name: p.name,
                email: p.email,
                phone: p.phone,
                role: p.role,
            })),
        });
    } catch (error) {
        console.error("Error creating players:", error);
        res.status(500).json({ message: "Failed to create players" });
    }
};

export const addTeamPlayer = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { teamId } = req.params;
        const { name, email, phone, password, role } = req.body;

        if (!teamId) {
            res.status(400).json({ message: "Team ID is required" });
            return;
        }

        if (!name || !email || !phone) {
            res.status(400).json({ message: "Player name, email and phone are required" });
            return;
        }

        // Check if team exists
        const team = await prisma.team.findUnique({
            where: { id: teamId },
        });

        if (!team) {
            res.status(404).json({ message: "Team not found" });
            return;
        }

        // Check if email or phone already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { phone }
                ]
            },
        });

        if (existingUser) {
            res.status(400).json({ 
                message: `User with this email or phone already exists`,
                existingUser: {
                    id: existingUser.id,
                    name: existingUser.name,
                    email: existingUser.email,
                },
            });
            return;
        }

        const player = await prisma.user.create({
            data: {
                name,
                email,
                phone,
                password: password || 'defaultPassword123', // Hash this in production
                role: role || 'user',
                teamId,
            },
            include: {
                team: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        res.status(201).json({
            message: "Player added successfully",
            player: {
                id: player.id,
                name: player.name,
                email: player.email,
                phone: player.phone,
                role: player.role,
                team: player.team,
            },
        });
    } catch (error) {
        console.error("Error adding player:", error);
        res.status(500).json({ message: "Failed to add player" });
    }
};

export const updateTeamPlayer = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { teamId, playerId } = req.params;
        const { name, email, phone, role } = req.body;

        if (!teamId || !playerId) {
            res.status(400).json({ message: "Team ID and Player ID are required" });
            return;
        }

        // Check if player exists in this team
        const existingPlayer = await prisma.user.findFirst({
            where: {
                id: parseInt(playerId),
                teamId,
            },
        });

        if (!existingPlayer) {
            res.status(404).json({ message: "Player not found in this team" });
            return;
        }

        // Check if new email/phone conflicts
        if ((email && email !== existingPlayer.email) || (phone && phone !== existingPlayer.phone)) {
            const conflict = await prisma.user.findFirst({
                where: {
                    OR: [
                        ...(email ? [{ email }] : []),
                        ...(phone ? [{ phone }] : [])
                    ],
                    id: { not: parseInt(playerId) },
                },
            });

            if (conflict) {
                res.status(400).json({ 
                    message: `Email or phone already exists`,
                    conflictingPlayer: {
                        id: conflict.id,
                        name: conflict.name,
                    },
                });
                return;
            }
        }

        const updatedPlayer = await prisma.user.update({
            where: { id: parseInt(playerId) },
            data: {
                ...(name && { name }),
                ...(email && { email }),
                ...(phone && { phone }),
                ...(role && { role }),
            },
            include: {
                team: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        res.status(200).json({
            message: "Player updated successfully",
            player: updatedPlayer,
        });
    } catch (error) {
        console.error("Error updating player:", error);
        res.status(500).json({ message: "Failed to update player" });
    }
};

export const deleteTeamPlayer = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { teamId, playerId } = req.params;

        if (!teamId || !playerId) {
            res.status(400).json({ message: "Team ID and Player ID are required" });
            return;
        }

        // Check if player exists in this team
        const existingPlayer = await prisma.user.findFirst({
            where: {
                id: parseInt(playerId),
                teamId,
            },
            include: {
                team: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!existingPlayer) {
            res.status(404).json({ message: "Player not found in this team" });
            return;
        }

        await prisma.user.delete({
            where: { id: parseInt(playerId) },
        });

        res.status(200).json({
            message: "Player deleted successfully",
            deletedPlayer: {
                id: existingPlayer.id,
                name: existingPlayer.name,
                email: existingPlayer.email,
                phone: existingPlayer.phone,
                team: existingPlayer.team,
            },
        });
    } catch (error) {
        console.error("Error deleting player:", error);
        res.status(500).json({ message: "Failed to delete player" });
    }
};