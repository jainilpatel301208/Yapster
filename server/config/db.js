import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️ [Yapster DB] MONGODB_URI not provided in .env. Running without active database connection.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ [Yapster DB] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ [Yapster DB] Connection Error: ${error.message}`);
    // Do not exit process in development to allow /health endpoint to report DB status
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};
