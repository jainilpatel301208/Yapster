import express from 'express';
import { signup } from '../controllers/authController.js';

const router = express.Router();

// Signup / Register route
router.post('/signup', signup);
router.post('/register', signup); // Alias for convenience

export default router;
