
import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  matchId: { type: String, required: true },
  over: { type: Number, required: true },
  ball: { type: Number, required: true },
  batsman: { type: String, required: true },
  bowler: { type: String, required: true },
  event: { type: String, required: true },
  screenshot: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Log = mongoose.model("Log", logSchema);

export default Log;
