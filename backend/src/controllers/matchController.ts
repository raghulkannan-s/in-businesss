import { Request, Response } from 'express';
import { prisma } from '../database/db';
import { MatchStatus, OptedTo, Prisma } from '../types/prisma';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export const getAllMatchesController = async (req: AuthenticatedRequest, res: Response) => {
    try {
        let whereClause: any = {};
        
        // If regular user, only show live matches
        if (req.user?.role === 'user') {
            whereClause.status = MatchStatus.live;
        }
        
        // If status filter is forced (from middleware)
        if (req.query.status) {
            whereClause.status = req.query.status as MatchStatus;
        }

        const matches = await prisma.match.findMany({
            where: whereClause,
            include: {
                teamA: true,
                teamB: true,
                winner: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        
        res.status(200).json(matches);
    } catch (error) {
        console.error("Error fetching matches:", error);
        res.status(500).json({ message: 'Failed to fetch matches', error });
    }
};

export const getMatchByIdController = async (req: Request, res: Response) => {
    try {
        const match = await prisma.match.findUnique({
            where: { id: req.params.id },
            include: {
                teamA: true,
                teamB: true,
                winner: true,
                scores: true,
            },
        });
        
        if (!match) {
            res.status(404).json({ message: 'Match not found' });
            return;
        }
        
        res.status(200).json(match);
    } catch (error) {
        console.error("Error fetching match:", error);
        res.status(500).json({ message: 'Failed to fetch match', error });
    }
};

export const createMatchController = async (req: Request, res: Response) => {
    try {
        const { title, status, teamAId, teamBId, overs } = req.body;
        
        // Validate required fields
        if (!title || !teamAId || !teamBId) {
            res.status(400).json({ message: 'Title, teamAId, and teamBId are required' });
            return;
        }
        
        const newMatch = await prisma.match.create({
            data: {
                title,
                status: status as MatchStatus || MatchStatus.scheduled,
                teamAId,
                teamBId,
                overs: overs ? parseInt(overs) : null,
            },
            include: {
                teamA: true,
                teamB: true,
            },
        });
        
        res.status(201).json(newMatch);
    } catch (error) {
        console.error("Error creating match:", error);
        res.status(400).json({ message: 'Failed to create match', error });
    }
};

export const updateMatchController = async (req: Request, res: Response) => {
    try {
        const updatedMatch = await prisma.match.update({
            where: { id: req.params.id },
            data: req.body,
            include: {
                teamA: true,
                teamB: true,
                winner: true,
            },
        });
        
        res.status(200).json(updatedMatch);
    } catch (error) {
        console.error("Error updating match:", error);
        res.status(400).json({ message: 'Failed to update match', error });
    }
};

export const deleteMatchController = async (req: Request, res: Response) => {
    try {
        await prisma.match.delete({
            where: { id: req.params.id },
        });
        
        res.status(200).json({ message: 'Match deleted successfully' });
    } catch (error) {
        console.error("Error deleting match:", error);
        res.status(500).json({ message: 'Failed to delete match', error });
    }
};

export const updateMatchTossController = async (req: Request, res: Response) => {
    try {
        const { tossWonBy, optedTo } = req.body;
        
        const updatedMatch = await prisma.match.update({
            where: { id: req.params.id },
            data: { 
                tossWonBy, 
                optedTo: optedTo as OptedTo 
            },
            include: {
                teamA: true,
                teamB: true,
            },
        });
        
        res.status(200).json(updatedMatch);
    } catch (error) {
        console.error("Error updating toss details:", error);
        res.status(400).json({ message: 'Failed to update toss details', error });
    }
};

export const updateMatchOversController = async (req: Request, res: Response) => {
    try {
        const { overs } = req.body;
        
        const updatedMatch = await prisma.match.update({
            where: { id: req.params.id },
            data: { overs },
        });
        
        res.status(200).json(updatedMatch);
    } catch (error) {
        console.error("Error updating match overs:", error);
        res.status(400).json({ message: 'Failed to update match overs', error });
    }
};

export const updateMatchWinnerController = async (req: Request, res: Response) => {
    try {
        const { winnerId } = req.body;
        
        const updatedMatch = await prisma.match.update({
            where: { id: req.params.id },
            data: { 
                winnerId,
                status: MatchStatus.completed
            },
            include: {
                winner: true,
            },
        });
        
        res.status(200).json(updatedMatch);
    } catch (error) {
        console.error("Error updating match winner:", error);
        res.status(400).json({ message: 'Failed to update match winner', error });
    }
};

// ========================
// SCORE RECORDING ENDPOINTS
// ========================

export const addBallToMatch = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const matchId = req.params.id;
        const { playerId, runs, ballType, wicketType, extras } = req.body;

        // Validate required fields
        if (!playerId || runs === undefined) {
            res.status(400).json({ 
                message: 'playerId and runs are required' 
            });
            return;
        }

        // Use transaction to ensure data consistency
        const result = await prisma.$transaction(async (tx: any) => {
            // Get current match state
            const currentMatch = await tx.match.findUnique({
                where: { id: matchId },
                include: { scores: true }
            });

            if (!currentMatch) {
                throw new Error('Match not found');
            }

            if (currentMatch.status !== MatchStatus.live) {
                throw new Error('Can only update scores for live matches');
            }

            // Create the ball record with proper over calculation
            const existingScores = await tx.score.findMany({
                where: { matchId },
                orderBy: { createdAt: 'asc' }
            });

            // Calculate current over based on existing scores
            const ballsPlayed = existingScores.filter((s: any) => s.balls > 0).length;
            const currentOver = Math.floor(ballsPlayed / 6);
            
            const score = await tx.score.create({
                data: {
                    matchId,
                    playerId: parseInt(playerId),
                    runs: parseInt(runs),
                    balls: ballType === 'WIDE' || ballType === 'NO_BALL' ? 0 : 1,
                    fours: runs === 4 ? 1 : 0,
                    sixes: runs === 6 ? 1 : 0,
                    isOut: wicketType && wicketType !== 'NONE',
                    over: currentOver
                },
                include: {
                    player: { select: { id: true, name: true, teamId: true } }
                }
            });

            // Calculate match statistics from scores
            const allScores = [...existingScores, score];
            const totalRuns = allScores.reduce((sum, s) => sum + s.runs, 0);
            const totalWickets = allScores.filter(s => s.isOut).length;
            const totalBalls = allScores.filter(s => s.balls > 0).length;
            const completedOvers = Math.floor(totalBalls / 6);
            
            // Check if match should be completed
            const shouldComplete = totalWickets >= 10 || completedOvers >= (currentMatch.overs || 20);
            
            if (shouldComplete && currentMatch.status !== MatchStatus.completed) {
                await tx.match.update({
                    where: { id: matchId },
                    data: { 
                        status: MatchStatus.completed,
                        // Winner determination would need more complex logic based on innings
                    }
                });
            }

            // Update player stats
            const isWicket = wicketType && wicketType !== 'NONE';
            await updatePlayerStats(parseInt(playerId), {
                runs: parseInt(runs),
                fours: runs === 4 ? 1 : 0,
                sixes: runs === 6 ? 1 : 0,
                isOut: isWicket,
            });

            return { 
                score, 
                match: currentMatch,
                totalRuns,
                totalWickets,
                completedOvers
            };
        });

        res.status(201).json({
            message: 'Ball added successfully',
            ...result,
        });
    } catch (error) {
        console.error("Error adding ball to match:", error);
        res.status(500).json({ message: 'Failed to add ball to match', error: (error as Error).message });
    }
};

export const updateMatchScoreController = async (req: AuthenticatedRequest, res: Response) => {
    // Legacy endpoint - redirect to addBallToMatch
    return addBallToMatch(req, res);
};

type MatchWithRelations = any; // Simplified type for now

export const getMatchScoreboardController = async (req: Request, res: Response) => {
    try {
        const matchId = req.params.id;

        const match: MatchWithRelations | null = await prisma.match.findUnique({
            where: { id: matchId },
            include: {
                teamA: { select: { id: true, name: true, logo: true } },
                teamB: { select: { id: true, name: true, logo: true } },
                winner: { select: { id: true, name: true } },
                scores: {
                    include: {
                        player: { select: { id: true, name: true, teamId: true } },
                    },
                    orderBy: [{ over: 'asc' }, { createdAt: 'asc' }],
                },
            },
        });

        if (!match) {
            res.status(404).json({ message: 'Match not found' });
            return;
        }

        const calculateTeamTotal = (scores: any[]) => 
            scores.reduce((total: any, score: any) => ({
                runs: total.runs + score.runs,
                balls: total.balls + score.balls,
                fours: total.fours + score.fours,
                sixes: total.sixes + score.sixes,
                wickets: total.wickets + (score.isOut ? 1 : 0),
            }), { runs: 0, balls: 0, fours: 0, sixes: 0, wickets: 0 });

        const teamAScores = match.scores.filter((s: any) => s.player.teamId === match.teamAId);
        const teamBScores = match.scores.filter((s: any) => s.player.teamId === match.teamBId);

        const teamATotal = calculateTeamTotal(teamAScores);
        const teamBTotal = calculateTeamTotal(teamBScores);

        const currentOver = match.scores.length
            ? Math.max(...match.scores.map((s: any) => s.over))
            : 0;

        const scoreboard = {
            match: {
                id: match.id,
                title: match.title,
                status: match.status,
                currentOver,
                totalOvers: match.overs,
                tossWonBy: match.tossWonBy,
                optedTo: match.optedTo,
            },
            teamA: {
                ...match.teamA,
                score: teamATotal,
                isWinner: match.winnerId === match.teamAId,
            },
            teamB: {
                ...match.teamB,
                score: teamBTotal,
                isWinner: match.winnerId === match.teamBId,
            },
            recentBalls: match.scores
                .sort((a: any, b: any) => a.over - b.over || a.createdAt.getTime() - b.createdAt.getTime())
                .slice(-10),
            playerStats: await getPlayerStats(matchId), // keep or inline calc
        };

        res.status(200).json({
            message: 'Scoreboard retrieved successfully',
            scoreboard,
        });
        return;

    } catch (error) {
        console.error('Error fetching scoreboard:', error);
        res.status(500).json({ message: 'Failed to fetch scoreboard', error });
        return;
    }
}

async function updatePlayerStats(playerId: number, scoreData: any) {
    try {
        // Update or create batsman stats
        await prisma.batsman.upsert({
            where: { userId: playerId },
            update: {
                totalRuns: { increment: scoreData.runs },
                totalFours: { increment: scoreData.fours },
                totalSixes: { increment: scoreData.sixes },
            },
            create: {
                userId: playerId,
                totalRuns: scoreData.runs,
                totalFours: scoreData.fours,
                totalSixes: scoreData.sixes,
                totalMatches: 1,
            },
        });
    } catch (error) {
        console.error("Error updating player stats:", error);
    }
}

async function getPlayerStats(matchId: string) {
    const scores = await prisma.score.findMany({
        where: { matchId },
        include: {
            player: {
                select: {
                    id: true,
                    name: true,
                    teamId: true,
                },
            },
        },
    });

    const playerStats = new Map();

    scores.forEach((score: any) => {
        const playerId = score.playerId;
        if (!playerStats.has(playerId)) {
            playerStats.set(playerId, {
                player: score.player,
                runs: 0,
                balls: 0,
                fours: 0,
                sixes: 0,
                isOut: false,
                strikeRate: 0,
            });
        }

        const stats = playerStats.get(playerId);
        stats.runs += score.runs;
        stats.balls += score.balls;
        stats.fours += score.fours;
        stats.sixes += score.sixes;
        if (score.isOut) stats.isOut = true;
        stats.strikeRate = stats.balls > 0 ? (stats.runs / stats.balls) * 100 : 0;
    });

    return Array.from(playerStats.values());
}