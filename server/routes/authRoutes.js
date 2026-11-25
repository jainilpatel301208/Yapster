import express from 'express';
import { signup, login, getMe } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public Authentication Routes
router.post('/signup', signup);
router.post('/register', signup); // Alias
router.post('/login', login);

// Protected Routes (Require valid JWT Bearer token)
router.get('/me', protect, getMe);
router.get('/profile', protect, getMe); // Alias

export default router;
