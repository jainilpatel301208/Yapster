import express from 'express';
import {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
} from '../controllers/roomController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply auth protection middleware to all room routes
router.use(protect);

// CRUD Routes for Yap Rooms (Main Entity)
router.route('/')
  .get(getRooms)       // READ: Get all rooms
  .post(createRoom);   // CREATE: Create new room

router.route('/:id')
  .get(getRoomById)    // READ: Get single room details
  .put(updateRoom)     // UPDATE: Update room topic/details (creator only)
  .delete(deleteRoom); // DELETE: Delete room (creator only)

export default router;
