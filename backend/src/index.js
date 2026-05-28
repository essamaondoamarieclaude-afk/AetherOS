import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { Server } from 'socket.io';

import config from './config/index.js';
import logger from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { authenticate } from './middleware/auth.js';
import apiRoutes from './api/routes/index.js';
import webhookRoutes from './webhooks/index.js';
import { socketManager } from './services/socket/socketManager.js';
import { connectMongo } from './services/database/mongoClient.js';
import { connectRedis } from './services/cache/redisClient.js';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: config.cors.origin,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingInterval: config.socket.pingInterval,
  pingTimeout: config.socket.pingTimeout,
});

app.use(helmet());
app.use(cors({ origin: config.cors.origin, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('short'));

app.use('/webhooks', webhookRoutes);
app.use('/api', rateLimiter);
app.use('/api', authenticate);
app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'aetheros-backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use(errorHandler);

socketManager(io);

const start = async () => {
  try {
    await connectMongo();
    await connectRedis();

    httpServer.listen(config.port, () => {
      logger.info(`AetherOS backend running on port ${config.port}`);
      logger.info(`Environment: ${config.env}`);
      logger.info(`Dynatrace MCP: ${config.dynatrace.mcpEnabled ? 'enabled' : 'disabled'}`);
    });
  } catch (err) {
    logger.error('Failed to start server', { error: err.message });
    process.exit(1);
  }
};

start();

export { app, httpServer, io };
