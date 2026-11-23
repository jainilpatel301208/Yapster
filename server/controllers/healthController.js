import mongoose from 'mongoose';

/**
 * @desc   Check server and database health status
 * @route  GET /health
 * @access Public
 */
export const checkHealth = (req, res) => {
  const dbStateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const dbStateCode = mongoose.connection.readyState;
  const dbStatus = dbStateMap[dbStateCode] || 'unknown';

  res.status(200).json({
    status: 'OK',
    message: 'Yapster backend server is healthy and running smoothly 🗣️⚡',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStatus,
      code: dbStateCode,
    },
  });
};
