"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatchScoreboardController = exports.updateMatchScoreController = exports.addBallToMatch = exports.updateMatchWinnerController = exports.updateMatchOversController = exports.updateMatchTossController = exports.deleteMatchController = exports.updateMatchController = exports.createMatchController = exports.getMatchByIdController = exports.getAllMatchesController = void 0;
const db_1 = require("../database/db");
const client_1 = require("@prisma/client");
const getAllMatchesController = async (req, res) => {
    try {
        let whereClause = {};
        // If regular user, only show live matches
        if (req.user?.role === 'USER') {
            whereClause.status = client_1.MatchStatus.live;
        }
        // If status filter is forced (from middleware)
        if (req.query.status) {
            whereClause.status = req.query.status;
        }
        const matches = await db_1.prisma.match.findMany({
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
    }
    catch (error) {
        console.error("Error fetching matches:", error);
        res.status(500).json({ message: 'Failed to fetch matches', error });
    }
};
exports.getAllMatchesController = getAllMatchesController;
const getMatchByIdController = async (req, res) => {
    try {
        const match = await db_1.prisma.match.findUnique({
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
    }
    catch (error) {
        console.error("Error fetching match:", error);
        res.status(500).json({ message: 'Failed to fetch match', error });
    }
};
exports.getMatchByIdController = getMatchByIdController;
const createMatchController = async (req, res) => {
    try {
        const { title, status, teamAId, teamBId, overs } = req.body;
        // Validate required fields
        if (!title || !teamAId || !teamBId) {
            res.status(400).json({ message: 'Title, teamAId, and teamBId are required' });
            return;
        }
        const newMatch = await db_1.prisma.match.create({
            data: {
                title,
                status: status || client_1.MatchStatus.scheduled,
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
    }
    catch (error) {
        console.error("Error creating match:", error);
        res.status(400).json({ message: 'Failed to create match', error });
    }
};
exports.createMatchController = createMatchController;
const updateMatchController = async (req, res) => {
    try {
        const updatedMatch = await db_1.prisma.match.update({
            where: { id: req.params.id },
            data: req.body,
            include: {
                teamA: true,
                teamB: true,
                winner: true,
            },
        });
        res.status(200).json(updatedMatch);
    }
    catch (error) {
        console.error("Error updating match:", error);
        res.status(400).json({ message: 'Failed to update match', error });
    }
};
exports.updateMatchController = updateMatchController;
const deleteMatchController = async (req, res) => {
    try {
        await db_1.prisma.match.delete({
            where: { id: req.params.id },
        });
        res.status(200).json({ message: 'Match deleted successfully' });
    }
    catch (error) {
        console.error("Error deleting match:", error);
        res.status(500).json({ message: 'Failed to delete match', error });
    }
};
exports.deleteMatchController = deleteMatchController;
const updateMatchTossController = async (req, res) => {
    try {
        const { tossWonBy, optedTo } = req.body;
        const updatedMatch = await db_1.prisma.match.update({
            where: { id: req.params.id },
            data: {
                tossWonBy,
                optedTo: optedTo
            },
            include: {
                teamA: true,
                teamB: true,
            },
        });
        res.status(200).json(updatedMatch);
    }
    catch (error) {
        console.error("Error updating toss details:", error);
        res.status(400).json({ message: 'Failed to update toss details', error });
    }
};
exports.updateMatchTossController = updateMatchTossController;
const updateMatchOversController = async (req, res) => {
    try {
        const { overs } = req.body;
        const updatedMatch = await db_1.prisma.match.update({
            where: { id: req.params.id },
            data: { overs },
        });
        res.status(200).json(updatedMatch);
    }
    catch (error) {
        console.error("Error updating match overs:", error);
        res.status(400).json({ message: 'Failed to update match overs', error });
    }
};
exports.updateMatchOversController = updateMatchOversController;
const updateMatchWinnerController = async (req, res) => {
    try {
        const { winnerId } = req.body;
        const updatedMatch = await db_1.prisma.match.update({
            where: { id: req.params.id },
            data: {
                winnerId,
                status: client_1.MatchStatus.completed
            },
            include: {
                winner: true,
            },
        });
        res.status(200).json(updatedMatch);
    }
    catch (error) {
        console.error("Error updating match winner:", error);
        res.status(400).json({ message: 'Failed to update match winner', error });
    }
};
exports.updateMatchWinnerController = updateMatchWinnerController;
// ========================
// SCORE RECORDING ENDPOINTS
// ========================
const addBallToMatch = async (req, res) => {
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
        const result = await db_1.prisma.$transaction(async (tx) => {
            // Get current match state
            const currentMatch = await tx.match.findUnique({
                where: { id: matchId },
                include: { scores: true }
            });
            if (!currentMatch) {
                throw new Error('Match not found');
            }
            if (currentMatch.status !== client_1.MatchStatus.live) {
                throw new Error('Can only update scores for live matches');
            }
            // Create the ball record
            const score = await tx.score.create({
                data: {
                    matchId,
                    playerId: parseInt(playerId),
                    runs: parseInt(runs),
                    balls: ballType === 'WIDE' || ballType === 'NO_BALL' ? 0 : 1,
                    fours: runs === 4 ? 1 : 0,
                    sixes: runs === 6 ? 1 : 0,
                    isOut: wicketType && wicketType !== 'NONE',
                    over: currentMatch.currentOver || 0,
                    ballType: ballType || 'NORMAL',
                    wicketType: wicketType || null,
                    extras: extras || 0
                },
                include: {
                    player: { select: { id: true, name: true, teamId: true } }
                }
            });
            // Calculate new match state
            const isWicket = wicketType && wicketType !== 'NONE';
            const actualRuns = ballType === 'WIDE' || ballType === 'NO_BALL' ? 1 + parseInt(runs) : parseInt(runs);
            const ballsToAdd = ballType === 'WIDE' || ballType === 'NO_BALL' ? 0 : 1;
            const newBallCount = (currentMatch.currentBall || 0) + ballsToAdd;
            const newOverCount = Math.floor(newBallCount / 6);
            const updatedMatch = {
                team1Score: currentMatch.currentInning === 1 ? (currentMatch.team1Score || 0) + actualRuns : currentMatch.team1Score,
                team2Score: currentMatch.currentInning === 2 ? (currentMatch.team2Score || 0) + actualRuns : currentMatch.team2Score,
                team1Wickets: currentMatch.currentInning === 1 && isWicket ? (currentMatch.team1Wickets || 0) + 1 : currentMatch.team1Wickets,
                team2Wickets: currentMatch.currentInning === 2 && isWicket ? (currentMatch.team2Wickets || 0) + 1 : currentMatch.team2Wickets,
                currentBall: newBallCount,
                currentOver: newOverCount,
                status: client_1.MatchStatus.live
            };
            // Check if innings should end (10 wickets or overs completed)
            const wickets = currentMatch.currentInning === 1 ? updatedMatch.team1Wickets : updatedMatch.team2Wickets;
            const oversCompleted = newOverCount >= (currentMatch.overs || 20);
            if ((wickets && wickets >= 10) || oversCompleted) {
                if (currentMatch.currentInning === 1) {
                    updatedMatch.currentInning = 2;
                    updatedMatch.currentBall = 0;
                    updatedMatch.currentOver = 0;
                }
                else {
                    updatedMatch.status = client_1.MatchStatus.completed;
                    // Determine winner
                    if (updatedMatch.team2Score && updatedMatch.team1Score) {
                        updatedMatch.winnerId = updatedMatch.team2Score > updatedMatch.team1Score ? currentMatch.teamBId : currentMatch.teamAId;
                    }
                }
            }
            await tx.match.update({
                where: { id: matchId },
                data: updatedMatch
            });
            // Update player stats
            await updatePlayerStats(parseInt(playerId), {
                runs: parseInt(runs),
                fours: runs === 4 ? 1 : 0,
                sixes: runs === 6 ? 1 : 0,
                isOut: isWicket,
            });
            return { score, match: { ...currentMatch, ...updatedMatch } };
        });
        res.status(201).json({
            message: 'Ball added successfully',
            ...result,
        });
    }
    catch (error) {
        console.error("Error adding ball to match:", error);
        res.status(500).json({ message: 'Failed to add ball to match', error: error.message });
    }
};
exports.addBallToMatch = addBallToMatch;
const updateMatchScoreController = async (req, res) => {
    // Legacy endpoint - redirect to addBallToMatch
    return (0, exports.addBallToMatch)(req, res);
};
exports.updateMatchScoreController = updateMatchScoreController;
const getMatchScoreboardController = async (req, res) => {
    try {
        const matchId = req.params.id;
        const match = await db_1.prisma.match.findUnique({
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
        const calculateTeamTotal = (scores) => scores.reduce((total, score) => ({
            runs: total.runs + score.runs,
            balls: total.balls + score.balls,
            fours: total.fours + score.fours,
            sixes: total.sixes + score.sixes,
            wickets: total.wickets + (score.isOut ? 1 : 0),
        }), { runs: 0, balls: 0, fours: 0, sixes: 0, wickets: 0 });
        const teamAScores = match.scores.filter(s => s.player.teamId === match.teamAId);
        const teamBScores = match.scores.filter(s => s.player.teamId === match.teamBId);
        const teamATotal = calculateTeamTotal(teamAScores);
        const teamBTotal = calculateTeamTotal(teamBScores);
        const currentOver = match.scores.length
            ? Math.max(...match.scores.map(s => s.over))
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
                .sort((a, b) => a.over - b.over || a.createdAt.getTime() - b.createdAt.getTime())
                .slice(-10),
            playerStats: await getPlayerStats(matchId), // keep or inline calc
        };
        res.status(200).json({
            message: 'Scoreboard retrieved successfully',
            scoreboard,
        });
        return;
    }
    catch (error) {
        console.error('Error fetching scoreboard:', error);
        res.status(500).json({ message: 'Failed to fetch scoreboard', error });
        return;
    }
};
exports.getMatchScoreboardController = getMatchScoreboardController;
async function updatePlayerStats(playerId, scoreData) {
    try {
        // Update or create batsman stats
        await db_1.prisma.batsman.upsert({
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
    }
    catch (error) {
        console.error("Error updating player stats:", error);
    }
}
async function getPlayerStats(matchId) {
    const scores = await db_1.prisma.score.findMany({
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
    scores.forEach(score => {
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
        if (score.isOut)
            stats.isOut = true;
        stats.strikeRate = stats.balls > 0 ? (stats.runs / stats.balls) * 100 : 0;
    });
    return Array.from(playerStats.values());
}
