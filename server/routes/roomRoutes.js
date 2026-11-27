import express from 'express';
import {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
} from '../controllers/roomController.js';
import messageRoutes from './messageRoutes.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply auth protection middleware to all room routes
router.use(protect);

// Re-route into other resource routers (Nested related entity)
router.use('/:roomId/messages', messageRoutes);

// CRUD Routes for Yap Rooms (Main Entity with Search & Pagination)
router.route('/')
  .get(getRooms)       // READ: Get all rooms (supports ?search=&isPrivate=&page=&limit=)
  .post(createRoom);   // CREATE: Create new room

router.route('/:id')
  .get(getRoomById)    // READ: Get single room details
  .put(updateRoom)     // UPDATE: Update room topic/details (creator only)
  .delete(deleteRoom); // DELETE: Delete room (creator only)

export default router;
