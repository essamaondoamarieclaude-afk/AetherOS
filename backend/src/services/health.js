import config from '../config/index.js';
import logger from '../utils/logger.js';

const health = {
  gemini: false,
  redis: false,
  supabase: false,
  dynatrace: false,
};

export const setServiceHealth = (service, status) => {
  health[service] = status;
};

export const isServiceReady = (service) => health[service] === true;

export const areCriticalServicesReady = () => {
  return health.gemini || true;
};

export const getServiceHealth = () => ({ ...health });

export const initializeHealth = () => {
  health.gemini = Boolean(config.gemini.apiKey);
  health.supabase = Boolean(config.supabase.url && config.supabase.serviceKey);
  health.dynatrace = Boolean(config.dynatrace.apiUrl && config.dynatrace.apiToken);
  if (!health.gemini) {
    logger.warn('Gemini API key missing — AI agent features disabled');
  }
  if (!health.supabase) {
    logger.warn('Supabase credentials missing — database features disabled');
  }
  if (!health.dynatrace) {
    logger.warn('Dynatrace credentials missing — MCP features disabled');
  }
};
