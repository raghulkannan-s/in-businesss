import Match from '../models/matchModel.js';
import Player from '../models/playerModel.js';

export const getAllMatches = async (req, res) => {
    try {
        const status = req.query.status;
        const query = status ? { status } : {};
        
        const matches = await Match.find(query)
            .sort({ createdAt: -1 })
            .populate('teamA', 'name')
            .populate('teamB', 'name')
            .populate('createdBy', 'name');
            
        res.json(matches);
    } catch (error) {
        console.error('Error fetching matches:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMatchById = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id)
            .populate('teamA', 'name stats')
            .populate('teamB', 'name stats')
            .populate('createdBy', 'name')
            .populate('ballByBall.striker', 'name')
            .populate('ballByBall.bowler', 'name')
            .populate('ballByBall.fielder', 'name');
        
        if (match) {
            res.json(match);
        } else {
            res.status(404).json({ message: 'Match not found' });
        }
    } catch (error) {
        console.error('Error fetching match:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createMatch = async (req, res) => {
    try {
        const { title, overs } = req.body;
        
        if (!title || !overs) {
            return res.status(400).json({ message: 'Title and overs are required' });
        }
        
        // Get top 30 players based on earnings (or some other criteria)
        const players = await Player.find({ eligibility: true })
            .sort({ earnings: -1 })
            .limit(30);
        
        if (players.length < 22) {
            return res.status(400).json({ 
                message: `Not enough eligible players. Found ${players.length}, need at least 22` 
            });
        }
        
        // Split players into two teams
        const teamSize = Math.floor(players.length / 2);
        const teamA = players.slice(0, teamSize).map(player => player._id);
        const teamB = players.slice(teamSize).map(player => player._id);
        
        const match = await Match.create({
            title,
            overs: Number(overs),
            teamA,
            teamB,
            createdBy: req.user._id,
            status: 'upcoming'
        });
        
        const populatedMatch = await Match.findById(match._id)
            .populate('teamA', 'name')
            .populate('teamB', 'name')
            .populate('createdBy', 'name');
        
        res.status(201).json(populatedMatch);
    } catch (error) {
        console.error('Error creating match:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateMatch = async (req, res) => {
    try {
        const { title, teamA, teamB, status, overs } = req.body;
        
        const match = await Match.findById(req.params.id);
        
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }
        
        // Only allow updates to upcoming matches
        if (match.status !== 'upcoming' && status !== 'completed') {
            return res.status(400).json({ message: 'Can only update upcoming matches' });
        }
        
        if (title) match.title = title;
        if (overs) match.overs = overs;
        if (status) match.status = status;
        
        if (teamA && Array.isArray(teamA) && teamA.length > 0) {
            match.teamA = teamA;
        }
        
        if (teamB && Array.isArray(teamB) && teamB.length > 0) {
            match.teamB = teamB;
        }
        
        const updatedMatch = await match.save();
        
        res.json(updatedMatch);
    } catch (error) {
        console.error('Error updating match:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteMatch = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);
        
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }
        
        // Only allow deletion of upcoming matches
        if (match.status !== 'upcoming') {
            return res.status(400).json({ message: 'Can only delete upcoming matches' });
        }
        
        await Match.deleteOne({ _id: match._id });
        
        res.json({ message: 'Match deleted successfully' });
    } catch (error) {
        console.error('Error deleting match:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const setToss = async (req, res) => {
    try {
        const { wonBy, opted } = req.body;
        
        if (!wonBy || !opted) {
            return res.status(400).json({ message: 'Both wonBy and opted fields are required' });
        }
        
        if (!['teamA', 'teamB'].includes(wonBy)) {
            return res.status(400).json({ message: 'wonBy must be either "teamA" or "teamB"' });
        }
        
        if (!['bat', 'bowl'].includes(opted)) {
            return res.status(400).json({ message: 'opted must be either "bat" or "bowl"' });
        }
        
        const match = await Match.findById(req.params.id);
        
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }
        
        if (match.status !== 'upcoming') {
            return res.status(400).json({ message: 'Toss can only be set for upcoming matches' });
        }
        
        match.toss = { wonBy, opted };
        
        // Set currentBattingTeam based on toss result
        if ((wonBy === 'teamA' && opted === 'bat') || (wonBy === 'teamB' && opted === 'bowl')) {
            match.currentBattingTeam = 'teamA';
        } else {
            match.currentBattingTeam = 'teamB';
        }
        
        await match.save();
        
        res.json({ message: 'Toss set successfully', toss: match.toss, currentBattingTeam: match.currentBattingTeam });
    } catch (error) {
        console.error('Error setting toss:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const startMatch = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);
        
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }
        
        if (match.status !== 'upcoming') {
            return res.status(400).json({ message: 'Match is not in upcoming status' });
        }
        
        if (!match.toss || !match.toss.wonBy) {
            return res.status(400).json({ message: 'Toss must be completed before starting match' });
        }
        
        match.status = 'live';
        await match.save();
        
        res.json({ message: 'Match started successfully' });
    } catch (error) {
        console.error('Error starting match:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const addBallEntry = async (req, res) => {
    try {
        const {
            striker,
            nonStriker,
            bowler,
            runs,
            extras,
            extrasRun,
            isWicket,
            wicketType,
            fielder,
            over,
            ball
        } = req.body;
        
        if (!striker || !bowler || over === undefined || ball === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        const match = await Match.findById(req.params.id);
        
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }
        
        if (match.status !== 'live') {
            return res.status(400).json({ message: 'Match is not live' });
        }
        
        // Create the ball entry
        const ballEntry = {
            striker,
            nonStriker: nonStriker || null,
            bowler,
            runs: runs || 0,
            extras: extras || 'none',
            extrasRun: extrasRun || 0,
            isWicket: isWicket || false,
            wicketType: wicketType || 'none',
            fielder: fielder || null,
            over,
            ball,
            timestamp: new Date()
        };
        
        // Add to ball-by-ball array
        match.ballByBall.push(ballEntry);
        
        // Update scoreboard
        const totalRuns = (runs || 0) + (extrasRun || 0);
        const currentTeam = match.currentBattingTeam; // 'teamA' or 'teamB'
        
        match.scoreBoard[currentTeam].total += totalRuns;
        
        if (isWicket) {
            match.scoreBoard[currentTeam].wickets += 1;
        }
        
        // Update overs
        const completedOver = Math.floor(match.ballByBall.filter(b => 
            b.extras !== 'wide' && b.extras !== 'no-ball'
        ).length / 6);
        
        const balls = match.ballByBall.filter(b => 
            b.extras !== 'wide' && b.extras !== 'no-ball'
        ).length % 6;
        
        match.scoreBoard[currentTeam].overs = completedOver + (balls / 10);
        
        // Save changes
        await match.save();
        
        // Update player stats (this is a simplified version)
        if (runs) {
            await Player.findByIdAndUpdate(striker, {
                $inc: {
                    'stats.runs': runs,
                    'earnings': runs * 5 // +₹5 per run
                }
            });
        } else if (!extras || extras === 'none') {
            // For dot ball (no run), deduct ₹5 from striker
            await Player.findByIdAndUpdate(striker, {
                $inc: { 'earnings': -5 } // -₹5 per dot ball
            });
            
            // For dot ball (no run), add ₹5 to bowler
            await Player.findByIdAndUpdate(bowler, {
                $inc: { 'earnings': 5 } // +₹5 per dot ball bowled
            });
        }
        
        // For runs conceded, deduct ₹5 from bowler
        if (runs || (extras && extras !== 'none')) {
            await Player.findByIdAndUpdate(bowler, {
                $inc: { 'earnings': -5 * (runs || 0) } // -₹5 per run conceded
            });
        }
        
        // For wicket, add ₹50 (split between bowler and fielder)
        if (isWicket) {
            if (fielder && wicketType === 'caught') {
                // Split between bowler and fielder
                await Player.findByIdAndUpdate(bowler, {
                    $inc: {
                        'stats.wickets': 1,
                        'earnings': 25 // ₹25 for bowler
                    }
                });
                
                await Player.findByIdAndUpdate(fielder, {
                    $inc: {
                        'stats.catches': 1,
                        'earnings': 25 // ₹25 for fielder
                    }
                });
            } else {
                // Full ₹50 to bowler for other wicket types
                await Player.findByIdAndUpdate(bowler, {
                    $inc: {
                        'stats.wickets': 1,
                        'earnings': 50 // ₹50 for bowler
                    }
                });
            }
        }
        
        res.status(201).json({ 
            message: 'Ball entry added successfully',
            currentScore: match.scoreBoard[currentTeam]
        });
    } catch (error) {
        console.error('Error adding ball entry:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getScoreboard = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id)
            .populate('teamA', 'name stats')
            .populate('teamB', 'name stats');
        
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }
        
        // Get detailed player stats from ball-by-ball data
        const playerStats = {};
        
        // Initialize player stats for all players
        [...match.teamA, ...match.teamB].forEach(player => {
            playerStats[player._id] = {
                batting: {
                    runs: 0,
                    balls: 0,
                    fours: 0,
                    sixes: 0,
                    strikeRate: 0
                },
                bowling: {
                    overs: 0,
                    maidens: 0,
                    runs: 0,
                    wickets: 0,
                    economy: 0
                }
            };
        });
        
        // Calculate stats from ball-by-ball data
        match.ballByBall.forEach(ball => {
            // Batting stats
            if (playerStats[ball.striker]) {
                const batStats = playerStats[ball.striker].batting;
                batStats.runs += ball.runs || 0;
                
                if (ball.extras !== 'wide' && ball.extras !== 'no-ball') {
                    batStats.balls += 1;
                }
                
                if (ball.runs === 4) batStats.fours += 1;
                if (ball.runs === 6) batStats.sixes += 1;
                
                batStats.strikeRate = batStats.balls > 0 
                    ? ((batStats.runs / batStats.balls) * 100).toFixed(2) 
                    : 0;
            }
            
            // Bowling stats
            if (playerStats[ball.bowler]) {
                const bowlStats = playerStats[ball.bowler].bowling;
                
                if (ball.extras !== 'wide' && ball.extras !== 'no-ball') {
                    // Count legal deliveries for overs
                    const currentBalls = (bowlStats.overs % 1) * 10 + 1;
                    if (currentBalls >= 6) {
                        bowlStats.overs = Math.floor(bowlStats.overs) + 1;
                    } else {
                        bowlStats.overs = Math.floor(bowlStats.overs) + (currentBalls / 10);
                    }
                }
                
                bowlStats.runs += (ball.runs || 0) + (ball.extrasRun || 0);
                
                if (ball.isWicket) {
                    bowlStats.wickets += 1;
                }
                
                bowlStats.economy = bowlStats.overs > 0 
                    ? (bowlStats.runs / Number(bowlStats.overs.toFixed(1))).toFixed(2) 
                    : 0;
            }
        });
        
        const scoreboard = {
            match: {
                _id: match._id,
                title: match.title,
                status: match.status,
                toss: match.toss,
                currentBattingTeam: match.currentBattingTeam,
                overs: match.overs
            },
            teamA: {
                info: match.teamA,
                score: match.scoreBoard.teamA,
                players: match.teamA.map(player => ({
                    player: player._id,
                    name: player.name,
                    stats: playerStats[player._id]
                }))
            },
            teamB: {
                info: match.teamB,
                score: match.scoreBoard.teamB,
                players: match.teamB.map(player => ({
                    player: player._id,
                    name: player.name,
                    stats: playerStats[player._id]
                }))
            }
        };
        
        res.json(scoreboard);
    } catch (error) {
        console.error('Error getting scoreboard:', error);
        res.status(500).json({ message: 'Server error' });
    }
};