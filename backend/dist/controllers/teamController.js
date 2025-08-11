"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTeam = exports.updateTeam = exports.getTeam = exports.createTeam = void 0;
const db_1 = require("../database/db");
const createTeam = async (req, res) => {
    try {
        const { name, logo } = req.body;
        if (!name) {
            res.status(400).json({ message: "Team name is required" });
            return;
        }
        const existingTeam = await db_1.prisma.team.findFirst({
            where: { name: name }
        });
        if (existingTeam) {
            res.status(400).json({ message: "Team with this name already exists" });
            return;
        }
        const team = await db_1.prisma.team.create({
            data: {
                name,
                logo: logo || null,
            },
        });
        res.status(201).json({
            message: "Team created successfully",
            team,
        });
    }
    catch (error) {
        console.error("Error creating team:", error);
        res.status(500).json({ message: "Failed to create team" });
    }
};
exports.createTeam = createTeam;
const getTeam = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            const teams = await db_1.prisma.team.findMany({
                include: {
                    players: {
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
        const team = await db_1.prisma.team.findUnique({
            where: { id }, // Changed from teamId to id
            include: {
                players: {
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
    }
    catch (error) {
        console.error("Error fetching team:", error);
        res.status(500).json({ message: "Failed to fetch team" });
    }
};
exports.getTeam = getTeam;
const updateTeam = async (req, res) => {
    try {
        const { id } = req.params; // Changed from teamId to id
        const { name, logo } = req.body;
        if (!id) {
            res.status(400).json({ message: "Team ID is required" });
            return;
        }
        // Check if team exists
        const existingTeam = await db_1.prisma.team.findUnique({
            where: { id },
        });
        if (!existingTeam) {
            res.status(404).json({ message: "Team not found" });
            return;
        }
        // Check if new name conflicts with existing team
        if (name && name !== existingTeam.name) {
            const nameConflict = await db_1.prisma.team.findFirst({
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
        const updatedTeam = await db_1.prisma.team.update({
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
    }
    catch (error) {
        console.error("Error updating team:", error);
        res.status(500).json({ message: "Failed to update team" });
    }
};
exports.updateTeam = updateTeam;
const deleteTeam = async (req, res) => {
    try {
        const { id } = req.params; // Changed from teamId to id
        if (!id) {
            res.status(400).json({ message: "Team ID is required" });
            return;
        }
        // Check if team exists
        const existingTeam = await db_1.prisma.team.findUnique({
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
        await db_1.prisma.team.delete({
            where: { id }, // Changed from teamId to id
        });
        res.status(200).json({
            message: "Team deleted successfully",
            deletedTeam: {
                id: existingTeam.id,
                name: existingTeam.name,
            },
        });
    }
    catch (error) {
        console.error("Error deleting team:", error);
        res.status(500).json({ message: "Failed to delete team" });
    }
};
exports.deleteTeam = deleteTeam;
