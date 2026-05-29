import config from '../../config/index.js';
import logger from '../../utils/logger.js';
import { dynatraceMCP } from '../../services/dynatrace/mcpClient.js';
import { getSupabaseStatus } from '../../services/database/supabaseClient.js';
import { getRedisStatus } from '../../services/cache/redisClient.js';

const settingsStore = {
  supabase: {
    url: config.supabase.url,
  },
  dynatrace: {
    apiUrl: config.dynatrace.apiUrl,
    mcpEnabled: config.dynatrace.mcpEnabled,
  },
  gemini: {
    model: config.gemini.model,
  },
  analyses: {
    predictiveIntervalMs: 300000,
    infraIntervalMs: 60000,
    securityIntervalMs: 120000,
  },
  notifications: {
    email: true,
    webhook: false,
    slack: false,
    pagerDuty: false,
  },
};

export const getSettings = async (req, res) => {
  res.json({
    ...settingsStore,
    system: {
      supabaseStatus: await getSupabaseStatus(),
      redisStatus: getRedisStatus(),
      nodeEnv: config.env,
    },
  });
};

export const updateSettings = (req, res, next) => {
  try {
    const updates = req.body;
    Object.assign(settingsStore, updates);
    logger.info('Settings updated', { updates });
    res.json(settingsStore);
  } catch (err) {
    next(err);
  }
};

export const testIntegration = async (req, res, next) => {
  try {
    const { integration } = req.params;

    switch (integration) {
      case 'dynatrace': {
        const result = await dynatraceMCP.getProblems({ pageSize: 1 });
        res.json({ success: true, message: 'Dynatrace connection verified', result });
        break;
      }
      case 'supabase': {
        const status = await getSupabaseStatus();
        res.json({ success: status.isConnected, message: status.isConnected ? 'Supabase connected' : 'Supabase disconnected' });
        break;
      }
      case 'redis': {
        const status = getRedisStatus();
        res.json({ success: status.isConnected, message: status.isConnected ? 'Redis connected' : 'Redis disconnected' });
        break;
      }
      default:
        res.status(400).json({ error: `Unknown integration: ${integration}` });
    }
  } catch (err) {
    next(err);
  }
};
