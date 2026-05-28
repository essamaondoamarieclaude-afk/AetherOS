import { v4 as uuidv4 } from 'uuid';

export const generateId = () => uuidv4();

export const now = () => new Date().toISOString();

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const calculateConfidence = (factors) => {
  if (!factors.length) return 0;
  const sum = factors.reduce((acc, f) => acc + f, 0);
  return Math.min(Math.round((sum / factors.length) * 100), 100);
};

export const maskSensitive = (str) => {
  if (!str) return str;
  if (str.length <= 8) return '****';
  return `${str.slice(0, 4)}****${str.slice(-4)}`;
};

export const parseSeverity = (dynatraceSeverity) => {
  const map = {
    AVAILABILITY: 'high',
    ERROR: 'medium',
    PERFORMANCE: 'medium',
    RESOURCE_CONTENTION: 'medium',
    CUSTOM_ALERT: 'info',
    MONITORING_UNAVAILABLE: 'critical',
  };
  return map[dynatraceSeverity] || 'info';
};

export const formatAgentOutput = (agentName, finding) => ({
  agent: agentName,
  findingId: generateId(),
  timestamp: now(),
  ...finding,
});
