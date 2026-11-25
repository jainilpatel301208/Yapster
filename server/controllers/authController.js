import mongoose from 'mongoose';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

/**
 * @desc   Register a new user with hashed password & return JWT
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

    // 7. Generate JWT token
    const token = generateToken(newUser._id);

    // 8. Return safe user data with token
    res.status(201).json({
      success: true,
      message: 'User registered successfully! Welcome to Yapster 🗣️⚡',
      token,
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

/**
 * @desc   Authenticate user & get JWT token
 * @route  POST /api/auth/login
 * @access Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const identifier = email || username;

    // 1. Validation: Required fields
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email/username and password.',
      });
    }

    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database is not connected yet. Please set a valid MONGODB_URI in your server/.env file.',
      });
    }

    const trimmedIdentifier = identifier.trim().toLowerCase();

    // 2. Find user by email or username (explicitly select password field)
    const user = await User.findOne({
      $or: [{ email: trimmedIdentifier }, { username: trimmedIdentifier }],
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/username or password.',
      });
    }

    // 3. Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/username or password.',
      });
    }

    // 4. Generate JWT token
    const token = generateToken(user._id);

    // 5. Return success with token and user data
    res.status(200).json({
      success: true,
      message: 'Login successful! Good to see you back 🗣️⚡',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        status: user.status,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get current logged-in user profile (Protected Route)
 * @route  GET /api/auth/me
 * @access Private (Requires JWT token)
 */
export const getMe = async (req, res, next) => {
  try {
    // req.user is set by the protect middleware
    res.status(200).json({
      success: true,
      message: 'Authenticated user profile retrieved successfully.',
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};
