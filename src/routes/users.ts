import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getCurrentUser 
} from '../controllers/usersController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', (req, res, next) => {
  registerUser(req, res).catch(next);
});

router.post('/login', (req, res, next) => {
  loginUser(req, res).catch(next);
});

router.get('/me', authenticateToken, (req, res, next) => {
  getCurrentUser(req, res).catch(next);
});

export default router;