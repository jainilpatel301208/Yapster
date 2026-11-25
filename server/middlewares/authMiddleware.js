import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to protect private routes
 * Verifies JWT token in Authorization header
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from 'Bearer <token>'
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const secret = process.env.JWT_SECRET || 'super_secret_yapster_jwt_key_2026';
      const decoded = jwt.verify(token, secret);

      // Attach user object to request (excluding password)
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized: User belonging to this token no longer exists.',
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized: Invalid or expired token.',
      });
    }
  }

  // If no Bearer token provided in header
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: Access denied, no token provided.',
    });
  }
};
