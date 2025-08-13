"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logsController_1 = require("../controllers/logsController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// Store log
router.post("/", authMiddleware_1.authMiddleware, logsController_1.storeLogController);
// Get logs by match ID
router.get("/:matchId", logsController_1.getLogsByMatchController);
// Get ball-by-ball commentary
router.get("/:matchId/commentary", logsController_1.getBallByBallCommentary);
exports.default = router;
