import express from "express";
import { 
    storeLogController, 
    getLogsByMatchController, 
    getBallByBallCommentary 
} from "../controllers/logsController";
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// Store log
router.post("/", authMiddleware, storeLogController);

// Get logs by match ID
router.get("/:matchId", getLogsByMatchController);

// Get ball-by-ball commentary
router.get("/:matchId/commentary", getBallByBallCommentary);

export default router;