import jwt from 'jsonwebtoken';

/**
 * Generate a JSON Web Token (JWT)
 * @param {string} userId - User ID to encode in token payload
 * @returns {string} - Signed JWT
 */
export const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'super_secret_yapster_jwt_key_2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign({ id: userId }, secret, {
    expiresIn,
  });
};
