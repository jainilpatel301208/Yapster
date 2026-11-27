import express from 'express';
import { sendMessage, getRoomMessages } from '../controllers/messageController.js';
import { protect } from '../middlewares/authMiddleware.js';

// mergeParams: true allows accessing :roomId from parent room router
const router = express.Router({ mergeParams: true });

// Protect all message routes with JWT
router.use(protect);

router.route('/')
  .post(sendMessage)       // POST /api/rooms/:roomId/messages
  .get(getRoomMessages);   // GET  /api/rooms/:roomId/messages?page=1&limit=20&search=keyword

export default router;
