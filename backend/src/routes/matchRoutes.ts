import { Router } from 'express';
import { 
    getAllMatchesController, 
    getMatchByIdController, 
    createMatchController, 
    updateMatchController, 
    deleteMatchController,
    updateMatchTossController,
    updateMatchOversController,
    updateMatchWinnerController,
    addBallToMatch,
    getMatchScoreboardController
} from '../controllers/matchController';
import { 
    uploadMatchScreenshot, 
    uploadScreenshotMiddleware 
} from '../controllers/uploadController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { 
    requireAdminOrManager, 
    requireAdmin,
    requireSportsHallAccess 
} from '../middlewares/roleMiddleware';

const router = Router();

// Public/Sports Hall Routes (Live matches only for regular users)
router.get('/', authMiddleware, requireSportsHallAccess, getAllMatchesController);
router.get('/:id', authMiddleware, requireSportsHallAccess, getMatchByIdController);
router.get('/:id/scoreboard', authMiddleware, requireSportsHallAccess, getMatchScoreboardController);

// Management Only Routes
router.post('/', authMiddleware, requireAdminOrManager, createMatchController);
router.put('/:id', authMiddleware, requireAdminOrManager, updateMatchController);
router.delete('/:id', authMiddleware, requireAdmin, deleteMatchController);

// Match Setup Routes (Manager/Admin)
router.put('/:id/toss', authMiddleware, requireAdminOrManager, updateMatchTossController);
router.put('/:id/overs', authMiddleware, requireAdminOrManager, updateMatchOversController);
router.put('/:id/winner', authMiddleware, requireAdminOrManager, updateMatchWinnerController);

// Live Scoring Routes (Manager/Admin only)
router.post('/:id/ball', authMiddleware, requireAdminOrManager, addBallToMatch);

// Screenshot Upload (Manager/Admin only)
router.post('/:id/screenshot', authMiddleware, requireAdminOrManager, uploadScreenshotMiddleware, uploadMatchScreenshot);

export default router;