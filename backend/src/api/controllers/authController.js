import jwt from 'jsonwebtoken';
import config from '../../config/index.js';
import logger from '../../utils/logger.js';

export const login = (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const token = jwt.sign(
      { email, role: 'analyst', userId: 'dev-user' },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn },
    );

    res.json({
      token,
      user: { email, role: 'analyst' },
      expiresIn: config.jwt.expiresIn,
    });
  } catch (err) {
    next(err);
  }
};

export const register = (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name required' });
    }

    const token = jwt.sign(
      { email, role: 'analyst', userId: `user-${Date.now()}` },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn },
    );

    res.status(201).json({
      token,
      user: { email, name, role: 'analyst' },
      expiresIn: config.jwt.expiresIn,
    });
  } catch (err) {
    next(err);
  }
};

export const verifyToken = (req, res) => {
  res.json({ valid: true, user: req.user });
};
