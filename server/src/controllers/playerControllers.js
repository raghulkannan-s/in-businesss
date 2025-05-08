import Player from '../models/playerModel.js';
import User from '../models/userModel.js';

export const createPlayer = async (req, res) => {
    try {
        const { name, userId } = req.body;
        
        // Check if user exists
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Check if player already exists for this user
        const playerExists = await Player.findOne({ userId });
        if (playerExists) {
            return res.status(400).json({ message: 'Player already exists for this user' });
        }
        
        const player = await Player.create({
            name,
            userId
        });
        
        res.status(201).json(player);
    } catch (error) {
        console.error('Error creating player:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAllPlayers = async (req, res) => {
    try {
        const players = await Player.find();
        res.json(players);
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getPlayerById = async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);
        
        if (player) {
            res.json(player);
        } else {
            res.status(404).json({ message: 'Player not found' });
        }
    } catch (error) {
        console.error('Error fetching player:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updatePlayer = async (req, res) => {
    try {
        const { name, stats, earnings, eligibility } = req.body;
        
        const player = await Player.findById(req.params.id);
        
        if (player) {
            player.name = name || player.name;
            
            // Update stats if provided
            if (stats) {
                player.stats = {
                    ...player.stats,
                    ...stats
                };
            }
            
            if (earnings !== undefined) player.earnings = earnings;
            if (eligibility !== undefined) player.eligibility = eligibility;
            
            const updatedPlayer = await player.save();
            
            res.json(updatedPlayer);
        } else {
            res.status(404).json({ message: 'Player not found' });
        }
    } catch (error) {
        console.error('Error updating player:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deletePlayer = async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);
        
        if (player) {
            await Player.deleteOne({ _id: player._id });
            res.json({ message: 'Player removed' });
        } else {
            res.status(404).json({ message: 'Player not found' });
        }
    } catch (error) {
        console.error('Error deleting player:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const checkEligibility = async (req, res) => {
    try {
        const { playerId } = req.body;
        
        const player = await Player.findById(playerId);
        
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }

        res.json({
            playerId: player._id,
            name: player.name,
            eligibility: player.eligibility,
            earnings: player.earnings
        });
    } catch (error) {
        console.error('Error checking eligibility:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getPlayerRankings = async (req, res) => {
    try {
        // Get players sorted by earnings (highest first)
        const players = await Player.find()
            .sort({ earnings: -1 })
            .limit(50); // Limit to top 50 players
            
        res.json(players);
    } catch (error) {
        console.error('Error fetching player rankings:', error);
        res.status(500).json({ message: 'Server error' });
    }
};