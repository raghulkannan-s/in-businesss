import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
            required: true
        },
        stats: {
            matches: { type: Number, default: 0 },
            runs: { type: Number, default: 0 },
            wickets: { type: Number, default: 0 },
            catches: { type: Number, default: 0 },
            strikeRate: { type: Number, default: 0 },
            economy: { type: Number, default: 0 }
        },
        earnings: { type: Number, default: 0 },
        eligibility: { type: Boolean, default: true }
    },
    { timestamps: true }
);

const Player = mongoose.model("Player", playerSchema);

export default Player;