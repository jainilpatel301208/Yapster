import Room from '../models/Room.js';

/**
 * @desc   Create a new Yap room
 * @route  POST /api/rooms
 * @access Private (Requires JWT)
 */
export const createRoom = async (req, res, next) => {
  try {
    const { name, displayName, description, topic, isPrivate } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Room name is required (e.g. dev-squad, campus-memes).',
      });
    }

    const cleanName = name.trim().toLowerCase().replace(/\s+/g, '-');

    // Check for name format
    if (!/^[a-z0-9-]+$/.test(cleanName)) {
      return res.status(400).json({
        success: false,
        message: 'Room name can only contain lowercase alphanumeric characters and hyphens.',
      });
    }

    // Check for duplicate room name
    const existingRoom = await Room.findOne({ name: cleanName });
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: `Room '#${cleanName}' already exists. Please choose a different name.`,
      });
    }

    // Create room with current user as creator and first member
    const room = await Room.create({
      name: cleanName,
      displayName: displayName || cleanName,
      description: description || 'A place for the squad to yap! 🗣️',
      topic: topic || 'General chatter & updates',
      createdBy: req.user._id,
      isPrivate: Boolean(isPrivate),
      members: [req.user._id],
    });

    res.status(201).json({
      success: true,
      message: `Room '#${room.name}' created successfully! ⚡`,
      room,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get all available rooms
 * @route  GET /api/rooms
 * @access Private (Requires JWT)
 */
export const getRooms = async (req, res, next) => {
  try {
    // Return all public rooms OR rooms where user is a member
    const rooms = await Room.find({
      $or: [{ isPrivate: false }, { members: req.user._id }],
    })
      .populate('createdBy', 'username email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get single room by ID
 * @route  GET /api/rooms/:id
 * @access Private (Requires JWT)
 */
export const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('createdBy', 'username email avatar')
      .populate('members', 'username avatar status');

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found.',
      });
    }

    // Check privacy access
    if (room.isPrivate && !room.members.some((m) => m._id.equals(req.user._id))) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: This room is private to squad members only.',
      });
    }

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Invalid Room ID format.',
      });
    }
    next(error);
  }
};

/**
 * @desc   Update a room (details, topic, privacy)
 * @route  PUT /api/rooms/:id
 * @access Private (Only room creator / admin)
 */
export const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found.',
      });
    }

    // Authorization: Only room creator can update settings
    if (!room.createdBy.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access forbidden: Only the room creator can update room settings.',
      });
    }

    const { displayName, description, topic, isPrivate } = req.body;

    if (displayName !== undefined) room.displayName = displayName;
    if (description !== undefined) room.description = description;
    if (topic !== undefined) room.topic = topic;
    if (isPrivate !== undefined) room.isPrivate = Boolean(isPrivate);

    const updatedRoom = await room.save();

    res.status(200).json({
      success: true,
      message: 'Room details updated successfully.',
      room: updatedRoom,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Invalid Room ID format.',
      });
    }
    next(error);
  }
};

/**
 * @desc   Delete a room
 * @route  DELETE /api/rooms/:id
 * @access Private (Only room creator / admin)
 */
export const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found.',
      });
    }

    // Authorization: Only room creator can delete
    if (!room.createdBy.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access forbidden: Only the room creator can delete this room.',
      });
    }

    await room.deleteOne();

    res.status(200).json({
      success: true,
      message: `Room '#${room.name}' has been permanently deleted.`,
      deletedRoomId: req.params.id,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Invalid Room ID format.',
      });
    }
    next(error);
  }
};
