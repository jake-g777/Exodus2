import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';

import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { authRoutes } from './routes/auth';
import { tradingRoutes } from './routes/trading';
import { analyticsRoutes } from './routes/analytics';
import { dashboardRoutes } from './routes/dashboard';
import { initializeDatabase } from './database/init';
import { setupWebSocket } from './websocket/setup';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env['CORS_ORIGIN'] || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env['PORT'] || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env['CORS_ORIGIN'] || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000'), // 15 minutes
  max: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100'), // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env['NODE_ENV']
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/trading', tradingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Serve static files in production
if (process.env['NODE_ENV'] === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));
  
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
  });
}

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    logger.info('Database initialized successfully');
    
    setupWebSocket(io);
    logger.info('WebSocket setup completed');
    
    server.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📊 Environment: ${process.env['NODE_ENV']}`);
      logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

startServer(); 