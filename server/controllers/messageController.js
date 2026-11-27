import Message from '../models/Message.js';
import Room from '../models/Room.js';

/**
 * @desc   Send a message to a room (Related entity creation)
 * @route  POST /api/rooms/:roomId/messages
 * @access Private (Requires JWT)
 */
export const sendMessage = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { content, messageType } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content cannot be empty.',
      });
    }

    // Verify target room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found.',
      });
    }

    // If private room, verify user is a member
    if (room.isPrivate && !room.members.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You must be a member of this private room to send messages.',
      });
    }

    // Create the message
    const newMessage = await Message.create({
      roomId,
      senderId: req.user._id,
      content: content.trim(),
      messageType: messageType || 'text',
    });

    // Populate sender info for immediate UI rendering
    const populatedMessage = await Message.findById(newMessage._id).populate(
      'senderId',
      'username email avatar status'
    );

    res.status(201).json({
      success: true,
      message: 'Message sent successfully! 💬',
      data: populatedMessage,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Invalid Room ID format.' });
    }
    next(error);
  }
};

/**
 * @desc   Get paginated messages for a room with search support
 * @route  GET /api/rooms/:roomId/messages
 * @access Private (Requires JWT)
 */
export const getRoomMessages = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { search } = req.query;

    // Verify target room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found.',
      });
    }

    // If private room, verify user is a member
    if (room.isPrivate && !room.members.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You do not have access to messages in this private room.',
      });
    }

    // Query builder
    const query = { roomId };

    // Search filter within messages
    if (search && search.trim()) {
      query.content = { $regex: search.trim(), $options: 'i' };
    }

    // Pagination setup
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const totalMessages = await Message.countDocuments(query);
    const totalPages = Math.ceil(totalMessages / limit) || 1;

    // Fetch messages sorted newest first or chronological
    const messages = await Message.find(query)
      .populate('senderId', 'username email avatar status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      roomId,
      count: messages.length,
      pagination: {
        page,
        limit,
        totalMessages,
        totalPages,
        hasMore: page < totalPages,
      },
      messages: messages.reverse(), // Reverse so earliest in current batch appears first for chat timeline
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Invalid Room ID format.' });
    }
    next(error);
  }
};
