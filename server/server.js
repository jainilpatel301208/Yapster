import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Standard Middlewares
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Root Route
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Yapster API',
    tagline: 'Real-Time Squad & Community Chat Platform 🗣️⚡',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: {
        signup: 'POST /api/auth/signup',
        login: 'POST /api/auth/login',
        protectedProfile: 'GET /api/auth/me (Requires Bearer JWT)',
      },
      rooms: {
        list: 'GET /api/rooms (Requires Auth)',
        create: 'POST /api/rooms (Requires Auth)',
        getOne: 'GET /api/rooms/:id (Requires Auth)',
        update: 'PUT /api/rooms/:id (Requires Auth, Creator only)',
        delete: 'DELETE /api/rooms/:id (Requires Auth, Creator only)',
      },
    },
  });
});

// Routes
app.use('/', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`🚀 [Yapster Server] Running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

export default app;
