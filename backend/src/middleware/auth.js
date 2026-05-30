import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import logger from '../utils/logger.js';

const PUBLIC_ROUTES = [
  { path: '/health', method: 'GET' },
  { path: '/auth/login', method: 'POST' },
  { path: '/auth/register', method: 'POST' },
  { path: '/gemini/query', method: 'POST' },
  { path: '/gemini/diagnostics', method: 'POST' },
];

export const authenticate = (req, res, next) => {
  const isPublic = PUBLIC_ROUTES.some(
    (route) => req.path === route.path && req.method === route.method,
  );
  if (isPublic) return next();

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (err) {
    logger.warn('Authentication failed', { path: req.path, error: err.message });
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
