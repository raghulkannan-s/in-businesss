"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayerProfile = exports.getPlayerRankings = exports.deleteTeamPlayer = exports.updateTeamPlayer = exports.addTeamPlayer = exports.createTeamPlayers = exports.getTeamPlayer = exports.getTeamPlayers = void 0;
const db_1 = require("../database/db");
const getTeamPlayers = async (req, res) => {
    try {
        const { teamId } = req.params;
        if (!teamId) {
            res.status(400).json({ message: "Team ID is required" });
            return;
        }
        const team = await db_1.prisma.team.findUnique({
            where: { id: teamId },
        });
        if (!team) {
            res.status(404).json({ message: "Team not found" });
            return;
        }
        const players = await db_1.prisma.user.findMany({
            where: { teamId: teamId },
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
    }
    catch (error) {
        console.error("Error fetching team players:", error);
        res.status(500).json({ message: "Failed to fetch team players" });
    }
};
exports.getTeamPlayers = getTeamPlayers;
const getTeamPlayer = async (req, res) => {
    try {
        const { teamId, playerId } = req.params;
        if (!teamId || !playerId) {
            res.status(400).json({ message: "Team ID and Player ID are required" });
            return;
        }
        const player = await db_1.prisma.user.findFirst({
            where: {
                id: parseInt(playerId),
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
                batsman: true,
                bowler: true,
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
    }
    catch (error) {
        console.error("Error fetching player:", error);
        res.status(500).json({ message: "Failed to fetch player" });
    }
};
exports.getTeamPlayer = getTeamPlayer;
const createTeamPlayers = async (req, res) => {
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
        const team = await db_1.prisma.team.findUnique({
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
        const existingUsers = await db_1.prisma.user.findMany({
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
        const createdPlayers = await db_1.prisma.$transaction(players.map((player) => db_1.prisma.user.create({
            data: {
                name: player.name,
                email: player.email,
                phone: player.phone,
                password: player.password || 'defaultPassword123', // You should hash this
                role: player.role || 'user',
                teamId,
                eligibility: player.eligibility || 0,
            },
        })));
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
    }
    catch (error) {
        console.error("Error creating players:", error);
        res.status(500).json({ message: "Failed to create players" });
    }
};
exports.createTeamPlayers = createTeamPlayers;
const addTeamPlayer = async (req, res) => {
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
        const team = await db_1.prisma.team.findUnique({
            where: { id: teamId },
        });
        if (!team) {
            res.status(404).json({ message: "Team not found" });
            return;
        }
        // Check if email or phone already exists
        const existingUser = await db_1.prisma.user.findFirst({
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
        const player = await db_1.prisma.user.create({
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
    }
    catch (error) {
        console.error("Error adding player:", error);
        res.status(500).json({ message: "Failed to add player" });
    }
};
exports.addTeamPlayer = addTeamPlayer;
const updateTeamPlayer = async (req, res) => {
    try {
        const { teamId, playerId } = req.params;
        const { name, email, phone, role } = req.body;
        if (!teamId || !playerId) {
            res.status(400).json({ message: "Team ID and Player ID are required" });
            return;
        }
        // Check if player exists in this team
        const existingPlayer = await db_1.prisma.user.findFirst({
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
            const conflict = await db_1.prisma.user.findFirst({
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
        const updatedPlayer = await db_1.prisma.user.update({
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
    }
    catch (error) {
        console.error("Error updating player:", error);
        res.status(500).json({ message: "Failed to update player" });
    }
};
exports.updateTeamPlayer = updateTeamPlayer;
const deleteTeamPlayer = async (req, res) => {
    try {
        const { teamId, playerId } = req.params;
        if (!teamId || !playerId) {
            res.status(400).json({ message: "Team ID and Player ID are required" });
            return;
        }
        // Check if player exists in this team
        const existingPlayer = await db_1.prisma.user.findFirst({
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
        await db_1.prisma.user.delete({
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
    }
    catch (error) {
        console.error("Error deleting player:", error);
        res.status(500).json({ message: "Failed to delete player" });
    }
};
exports.deleteTeamPlayer = deleteTeamPlayer;
const getPlayerRankings = async (req, res) => {
    try {
        // Get all player performance data
        const playerStats = await db_1.prisma.score.groupBy({
            by: ['playerId'],
            _sum: {
                runs: true,
                fours: true,
                sixes: true,
                balls: true,
                extras: true,
            },
            _count: {
                playerId: true,
            },
        });
        // Calculate detailed rankings with proper earnings formula
        const rankings = await Promise.all(playerStats.map(async (stat) => {
            const player = await db_1.prisma.user.findUnique({
                where: { id: stat.playerId },
                select: { id: true, name: true, email: true }
            });
            if (!player)
                return null;
            const runs = stat._sum.runs || 0;
            const fours = stat._sum.fours || 0;
            const sixes = stat._sum.sixes || 0;
            const balls = stat._sum.balls || 0;
            const totalBalls = stat._count.playerId || 0;
            // Calculate dot balls (balls with 0 runs, excluding extras)
            const dotBalls = await db_1.prisma.score.count({
                where: {
                    playerId: stat.playerId,
                    runs: 0,
                    balls: { gt: 0 },
                    ballType: 'NORMAL'
                }
            });
            // Calculate wickets taken (as bowler)
            const wicketsTaken = await db_1.prisma.score.count({
                where: {
                    playerId: stat.playerId,
                    isOut: true,
                    wicketType: { not: null }
                }
            });
            // Get unique matches played
            const matchesPlayed = await db_1.prisma.score.findMany({
                where: { playerId: stat.playerId },
                select: { matchId: true },
                distinct: ['matchId']
            });
            const matches = matchesPlayed.length;
            // Earnings calculation based on requirements:
            // +₹5 per run, -₹5 per dot, +₹50 per wicket (shared), +₹5 per dot bowled, -₹5 per run conceded
            const batsmanEarnings = (runs * 5) - (dotBalls * 5);
            const bowlerEarnings = (wicketsTaken * 50); // Simplified for now
            const totalEarnings = batsmanEarnings + bowlerEarnings;
            // Performance metrics
            const strikeRate = balls > 0 ? ((runs / balls) * 100) : 0;
            const average = matches > 0 ? (runs / matches) : 0;
            const economy = balls > 0 ? ((stat._sum.extras || 0) / (balls / 6)) : 0;
            return {
                player,
                stats: {
                    runs,
                    fours,
                    sixes,
                    balls,
                    dotBalls,
                    wicketsTaken,
                    matches,
                    strikeRate: Number(strikeRate.toFixed(2)),
                    average: Number(average.toFixed(2)),
                    economy: Number(economy.toFixed(2)),
                    batsmanEarnings,
                    bowlerEarnings,
                    totalEarnings
                }
            };
        }));
        // Filter out null entries and sort by total earnings
        const validRankings = rankings
            .filter(ranking => ranking !== null)
            .sort((a, b) => b.stats.totalEarnings - a.stats.totalEarnings);
        res.status(200).json({
            message: 'Player rankings retrieved successfully',
            rankings: validRankings,
            earningsFormula: {
                runs: '+₹5 per run',
                dots: '-₹5 per dot ball',
                wickets: '+₹50 per wicket',
                bowlingDots: '+₹5 per dot bowled',
                runsConceded: '-₹5 per run conceded'
            }
        });
    }
    catch (error) {
        console.error('Error fetching player rankings:', error);
        res.status(500).json({ message: 'Failed to fetch player rankings', error: error.message });
    }
};
exports.getPlayerRankings = getPlayerRankings;
const getPlayerProfile = async (req, res) => {
    try {
        const playerId = parseInt(req.params.id);
        const player = await db_1.prisma.user.findUnique({
            where: { id: playerId },
            select: { id: true, name: true, email: true, role: true }
        });
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        // Get player's detailed stats
        const scores = await db_1.prisma.score.findMany({
            where: { playerId },
            include: {
                match: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        createdAt: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        const totalRuns = scores.reduce((sum, score) => sum + score.runs, 0);
        const totalBalls = scores.reduce((sum, score) => sum + score.balls, 0);
        const totalFours = scores.reduce((sum, score) => sum + score.fours, 0);
        const totalSixes = scores.reduce((sum, score) => sum + score.sixes, 0);
        const matchesPlayed = new Set(scores.map(s => s.matchId)).size;
        const dotBalls = scores.filter(s => s.runs === 0 && s.balls > 0).length;
        const earnings = (totalRuns * 5) + (totalFours * 50) + (totalSixes * 100) - (dotBalls * 5);
        const strikeRate = totalBalls > 0 ? ((totalRuns / totalBalls) * 100) : 0;
        const average = matchesPlayed > 0 ? (totalRuns / matchesPlayed) : 0;
        res.status(200).json({
            player,
            stats: {
                totalRuns,
                totalFours,
                totalSixes,
                totalBalls,
                dotBalls,
                matchesPlayed,
                strikeRate: Number(strikeRate.toFixed(2)),
                average: Number(average.toFixed(2)),
                earnings
            },
            recentMatches: scores.slice(0, 10).map(score => ({
                match: score.match,
                performance: {
                    runs: score.runs,
                    balls: score.balls,
                    fours: score.fours,
                    sixes: score.sixes,
                    isOut: score.isOut
                }
            }))
        });
    }
    catch (error) {
        console.error('Error fetching player profile:', error);
        res.status(500).json({ message: 'Failed to fetch player profile', error });
    }
};
exports.getPlayerProfile = getPlayerProfile;
