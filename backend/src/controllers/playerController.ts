import { Request, Response } from 'express';
import { prisma } from '../database/db';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export const getTeamPlayers = async (req: Request, res: Response) => {
    try {
        const { teamId } = req.params;

        if (!teamId) {
            res.status(400).json({ message: "Team ID is required" });
            return;
        }

        const team = await prisma.team.findUnique({
            where: { id: teamId },
        });

        if (!team) {
            res.status(404).json({ message: "Team not found" });
            return;
        }

        const players = await prisma.user.findMany({
            where: { teamId : teamId },
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
                    { email: { in: Array.from(playerEmails) as string[] } },
                    { phone: { in: Array.from(playerPhones) as string[] } }
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
            players: createdPlayers.map((p: any) => ({
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

export const getPlayerRankings = async (req: AuthenticatedRequest, res: Response) => {
    try {
        // Get all player performance data
        const playerStats = await prisma.score.groupBy({
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
        const rankings = await Promise.all(
            playerStats.map(async (stat: any) => {
                const player = await prisma.user.findUnique({
                    where: { id: stat.playerId },
                    select: { id: true, name: true, email: true }
                });

                if (!player) return null;

                const runs = stat._sum.runs || 0;
                const fours = stat._sum.fours || 0;
                const sixes = stat._sum.sixes || 0;
                const balls = stat._sum.balls || 0;
                const totalBalls = stat._count.playerId || 0;

                // Calculate dot balls (balls with 0 runs, excluding extras)
                const dotBalls = await prisma.score.count({
                    where: {
                        playerId: stat.playerId,
                        runs: 0,
                        balls: { gt: 0 },
                        ballType: 'NORMAL'
                    }
                });

                // Calculate wickets taken (as bowler) - this would require a bowlerId field in Score table
                // For now, we'll calculate wickets as a batsman (times out)
                const wicketsAsOut = await prisma.score.count({
                    where: {
                        playerId: stat.playerId,
                        isOut: true
                    }
                });

                // Get unique matches played
                const matchesPlayed = await prisma.score.findMany({
                    where: { playerId: stat.playerId },
                    select: { matchId: true },
                    distinct: ['matchId']
                });

                const matches = matchesPlayed.length;

                // Enhanced earnings calculation based on comprehensive cricket performance:
                // Batting: +₹5 per run, +₹50 per four, +₹100 per six, -₹5 per dot ball, -₹50 per dismissal
                const batsmanEarnings = (runs * 5) + (fours * 50) + (sixes * 100) - (dotBalls * 5) - (wicketsAsOut * 50);
                const totalEarnings = batsmanEarnings;

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
                        wicketsAsOut,
                        matches,
                        strikeRate: Number(strikeRate.toFixed(2)),
                        average: Number(average.toFixed(2)),
                        economy: Number(economy.toFixed(2)),
                        batsmanEarnings,
                        totalEarnings
                    }
                };
            })
        );

        // Filter out null entries and sort by total earnings
        const validRankings = rankings
            .filter(ranking => ranking !== null)
            .sort((a, b) => b!.stats.totalEarnings - a!.stats.totalEarnings);

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
    } catch (error) {
        console.error('Error fetching player rankings:', error);
        res.status(500).json({ message: 'Failed to fetch player rankings', error: (error as Error).message });
    }
};

export const getPlayerProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const playerId = parseInt(req.params.id);
        
        const player = await prisma.user.findUnique({
            where: { id: playerId },
            select: { id: true, name: true, email: true, role: true }
        });

        if (!player) {
            res.status(404).json({ message: 'Player not found' });
            return;
        }

        // Get player's detailed stats
        const scores = await prisma.score.findMany({
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

        const totalRuns = scores.reduce((sum: number, score: any) => sum + score.runs, 0);
        const totalBalls = scores.reduce((sum: number, score: any) => sum + score.balls, 0);
        const totalFours = scores.reduce((sum: number, score: any) => sum + score.fours, 0);
        const totalSixes = scores.reduce((sum: number, score: any) => sum + score.sixes, 0);
        const matchesPlayed = new Set(scores.map((s: any) => s.matchId)).size;

        const dotBalls = scores.filter((s: any) => s.runs === 0 && s.balls > 0).length;
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
            recentMatches: scores.slice(0, 10).map((score: any) => ({
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
    } catch (error) {
        console.error('Error fetching player profile:', error);
        res.status(500).json({ message: 'Failed to fetch player profile', error });
    }
};