// src/models/log.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface LogDocument extends Document {
  matchId: string;
  playerId: string;
  action: string;
  runs: number;
  over: number;
  ball: number;
  commentary: string;
  metadata: {
    filename: string;
    originalname: string;
    mimetype: string;
    size: number;
    uploadedBy: string;
    uploadedAt: Date;
  };
  timestamp: Date;
}

const logSchema = new Schema<LogDocument>({
  matchId: { type: String, required: true },
  playerId: { type: String, required: true },
  action: { type: String, required: true },
  runs: { type: Number, default: 0 },
  over: { type: Number, default: 0 },
  ball: { type: Number, default: 0 },
  commentary: { type: String, default: "" },
  metadata: {
    filename: String,
    originalname: String,
    mimetype: String,
    size: Number,
    uploadedBy: String,
    uploadedAt: Date,
  },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<LogDocument>("Log", logSchema);
