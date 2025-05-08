import mongoose from "mongoose";

const ballByBallSchema = new mongoose.Schema({
    striker: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Player',
        required: true 
    },
    nonStriker: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Player'
    },
    bowler: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Player',
        required: true 
    },
    runs: { type: Number, default: 0 },
    extras: { 
        type: String, 
        enum: ['none', 'wide', 'no-ball', 'bye', 'leg-bye'],
        default: 'none'
    },
    extrasRun: { type: Number, default: 0 },
    isWicket: { type: Boolean, default: false },
    wicketType: { 
        type: String, 
        enum: ['none', 'bowled', 'caught', 'lbw', 'run-out', 'stumped', 'hit-wicket'],
        default: 'none'
    },
    fielder: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Player'
    },
    over: { type: Number, required: true },
    ball: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

const matchSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        status: { 
            type: String, 
            enum: ['upcoming', 'live', 'completed'],
            default: 'upcoming'
        },
        teamA: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player'
        }],
        teamB: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player'
        }],
        toss: {
            wonBy: { 
                type: String,
                enum: ['teamA', 'teamB']
            },
            opted: {
                type: String,
                enum: ['bat', 'bowl']
            }
        },
        overs: { type: Number, required: true },
        ballByBall: [ballByBallSchema],
        scoreBoard: {
            teamA: {
                total: { type: Number, default: 0 },
                wickets: { type: Number, default: 0 },
                overs: { type: Number, default: 0 }
            },
            teamB: {
                total: { type: Number, default: 0 },
                wickets: { type: Number, default: 0 },
                overs: { type: Number, default: 0 }
            }
        },
        currentBattingTeam: {
            type: String,
            enum: ['teamA', 'teamB'],
            default: 'teamA'
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true }
);

const Match = mongoose.model("Match", matchSchema);

export default Match;