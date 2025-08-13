
import express from "express";

const router = express.Router();
import {
    getAllMatchesController,
    getMatchByIdController,
    createMatchController,
    updateMatchController,
    deleteMatchController,
    updateMatchTossController,
    updateMatchOversController,
    updateMatchWinnerController,
    updateMatchScoreController,
    getMatchScoreboardController
} from "../controllers/matchController";
import { authMiddleware } from '../middlewares/authMiddleware';

router.get("/", getAllMatchesController)
router.get("/:id", getMatchByIdController)
router.get("/:id/scoreboard", getMatchScoreboardController)

router.post("/", createMatchController)
router.post("/:id/scores", authMiddleware, updateMatchScoreController)
router.put("/:id", updateMatchController)
router.delete("/:id", deleteMatchController)
router.patch("/:id/toss", updateMatchTossController)
router.patch("/:id/overs", updateMatchOversController)
router.patch("/:id/winner", updateMatchWinnerController)


export default router;
