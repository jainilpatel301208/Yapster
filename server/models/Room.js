import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Room name is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [2, 'Room name must be at least 2 characters'],
      maxlength: [40, 'Room name cannot exceed 40 characters'],
      match: [/^[a-z0-9-]+$/, 'Room name can only contain lowercase letters, numbers, and hyphens (e.g., dev-squad)'],
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: [50, 'Display name cannot exceed 50 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [250, 'Description cannot exceed 250 characters'],
      default: 'A place for the squad to yap! 🗣️',
    },
    topic: {
      type: String,
      trim: true,
      maxlength: [120, 'Topic cannot exceed 120 characters'],
      default: 'General chatter & updates',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Auto-populate displayName from name if not provided
roomSchema.pre('save', function (next) {
  if (!this.displayName) {
    this.displayName = this.name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  next();
});

const Room = mongoose.model('Room', roomSchema);

export default Room;
