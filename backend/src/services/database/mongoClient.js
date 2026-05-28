import mongoose from 'mongoose';
import config from '../../config/index.js';
import logger from '../../utils/logger.js';

let isConnected = false;

export const connectMongo = async () => {
  if (isConnected) return;

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(config.mongodb.uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    logger.info('Connected to MongoDB Atlas');
  } catch (err) {
    logger.error('MongoDB connection failed', { error: err.message });
    throw err;
  }

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB runtime error', { error: err.message });
    isConnected = false;
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
    isConnected = false;
  });
};

export const getMongoStatus = () => ({
  isConnected,
  readyState: mongoose.connection.readyState,
});
