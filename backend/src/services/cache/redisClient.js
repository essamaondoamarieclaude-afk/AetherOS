import { Redis } from 'ioredis';
import config from '../../config/index.js';
import logger from '../../utils/logger.js';

let redis = null;
const DEFAULT_TTL = 300;

export const connectRedis = async () => {
  if (redis) return;

  try {
    redis = new Redis(config.redis.url, {
      password: config.redis.password,
      retryStrategy: (times) => Math.min(times * 50, 2000),
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    await redis.connect();
    logger.info('Connected to Redis');
  } catch (err) {
    logger.warn('Redis connection failed, running without cache', { error: err.message });
    redis = null;
  }

  if (redis) {
    redis.on('error', (err) => {
      logger.error('Redis error', { error: err.message });
    });
  }
};

export const getCache = async (key) => {
  if (!redis) return null;
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const setCache = async (key, value, ttl = DEFAULT_TTL) => {
  if (!redis) return;
  try {
    await redis.setex(key, ttl, JSON.stringify(value));
  } catch {
    // silently fail
  }
};

export const invalidateCache = async (pattern) => {
  if (!redis) return;
  try {
    const keys = await redis.keys(pattern);
    if (keys.length) {
      await redis.del(...keys);
    }
  } catch {
    // silently fail
  }
};

export const getRedisStatus = () => ({
  isConnected: redis?.status === 'ready' || false,
});
