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
 * @desc   Get rooms with search, filter, and pagination
 * @route  GET /api/rooms?search=keyword&isPrivate=false&page=1&limit=10
 * @access Private (Requires JWT)
 */
export const getRooms = async (req, res, next) => {
  try {
    const { search, isPrivate, page: queryPage, limit: queryLimit } = req.query;

    // Base query: public rooms or rooms where current user is a member
    const query = {
      $and: [
        {
          $or: [{ isPrivate: false }, { members: req.user._id }],
        },
      ],
    };

    // Filter by privacy if specified
    if (isPrivate !== undefined) {
      query.$and.push({ isPrivate: isPrivate === 'true' });
    }

    // Search filter across name, displayName, description, and topic
    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      query.$and.push({
        $or: [
          { name: searchRegex },
          { displayName: searchRegex },
          { description: searchRegex },
          { topic: searchRegex },
        ],
      });
    }

    // Pagination calculations
    const page = Math.max(1, parseInt(queryPage, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(queryLimit, 10) || 10));
    const skip = (page - 1) * limit;

    const totalRooms = await Room.countDocuments(query);
    const totalPages = Math.ceil(totalRooms / limit) || 1;

    const rooms = await Room.find(query)
      .populate('createdBy', 'username email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: rooms.length,
      pagination: {
        page,
        limit,
        totalRooms,
        totalPages,
        hasMore: page < totalPages,
      },
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
