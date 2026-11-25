import mongoose from 'mongoose';
import User from '../models/User.js';

/**
 * @desc   Register a new user with hashed password
 * @route  POST /api/auth/signup
 * @access Public
 */
export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // 1. Validation: Required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: username, email, and password.',
      });
    }

    // 2. Validation: Username length & characters
    const trimmedUsername = username.trim().toLowerCase();
    if (trimmedUsername.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Username must be at least 3 characters long.',
      });
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(trimmedUsername)) {
      return res.status(400).json({
        success: false,
        message: 'Username can only contain alphanumeric characters and underscores.',
      });
    }

    // 3. Validation: Email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const trimmedEmail = email.trim().toLowerCase();
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    // 4. Validation: Password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database is not connected yet. Please set a valid MONGODB_URI in your server/.env file.',
        hint: 'Use a free MongoDB Atlas URI or run local mongod to persist users.',
      });
    }

    // 5. Check if user already exists (by email or username)
    const existingUser = await User.findOne({
      $or: [{ email: trimmedEmail }, { username: trimmedUsername }],
    });

    if (existingUser) {
      const field = existingUser.email === trimmedEmail ? 'Email' : 'Username';
      return res.status(400).json({
        success: false,
        message: `${field} is already taken. Please choose another one.`,
      });
    }

    // 6. Create User (password hashing is automatically handled in User pre-save hook)
    const newUser = await User.create({
      username: trimmedUsername,
      email: trimmedEmail,
      password,
    });

    // 7. Return safe user data (exclude password)
    res.status(201).json({
      success: true,
      message: 'User registered successfully! Welcome to Yapster 🗣️⚡',
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
        bio: newUser.bio,
        status: newUser.status,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
