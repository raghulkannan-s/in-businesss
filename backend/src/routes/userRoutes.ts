import { Router } from 'express';
import { 
    getAll, 
    getUserById, 
    updateUser, 
    deleteUser 
} from '../controllers/userController';
import { 
    getPlayerRankings, 
    getPlayerProfile 
} from '../controllers/playerController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { 
    requireManagementLevel,
    requireAdmin 
} from '../middlewares/roleMiddleware';

const router = Router();

// User Management Routes (Admin/Owner only)
router.get('/', authMiddleware, requireManagementLevel, getAll);
router.get('/:id', authMiddleware, getUserById); // Users can see their own profile
router.put('/:id', authMiddleware, updateUser); // Users can update their own profile
router.delete('/:id', authMiddleware, requireAdmin, deleteUser);

// Player Rankings and Stats (All authenticated users can see)
router.get('/rankings/leaderboard', authMiddleware, getPlayerRankings);
router.get('/profile/:id', authMiddleware, getPlayerProfile);

export default router;