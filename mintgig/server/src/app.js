import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration supporting single origin, comma-separated list, or dynamic match
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim())
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes('*') ||
        /\.vercel\.app$/.test(origin) ||
        /\.onrender\.com$/.test(origin) ||
        /\.github\.io$/.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in deployment fallback
    },
    credentials: true,
  })
);

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'mintGig API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/certificates', certificateRoutes);
app.use('/api/v1/portfolio', portfolioRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/conversations', conversationRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/admin', adminRoutes);

// 404 and centralized error handling
app.use(notFound);
app.use(errorHandler);

export default app;
