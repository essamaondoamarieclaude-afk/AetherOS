import axios from 'axios';
import config from '../../config/index.js';
import logger from '../../utils/logger.js';
import { getCache, setCache } from '../cache/redisClient.js';
import { setServiceHealth } from '../health.js';

class DynatraceMCPClient {
  constructor() {
    this.ready = Boolean(config.dynatrace.apiUrl && config.dynatrace.apiToken);
    setServiceHealth('dynatrace', this.ready);
    if (!this.ready) {
      logger.warn('Dynatrace not configured. MCP features will be unavailable.');
      this.client = null;
      return;
    }
    this.client = axios.create({
      baseURL: config.dynatrace.apiUrl.replace(/\/+$/, ''),
      headers: {
        Authorization: `Api-Token ${config.dynatrace.apiToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  async callTool(toolName, params = {}) {
    if (!this.ready || !this.client) {
      throw new Error('Dynatrace MCP not configured — set DT_API_URL and DT_API_TOKEN');
    }

    const cacheKey = `dt:mcp:${toolName}:${JSON.stringify(params)}`;
    const cached = await getCache(cacheKey);
    if (cached) return cached;

    try {
      let result;
      switch (toolName) {
        case 'get_problems':
        case 'list_problems':
          result = await this.getProblems(params);
          break;
        case 'get_metrics':
          result = await this.getMetrics(params);
          break;
        case 'get_logs':
          result = await this.getLogs(params);
          break;
        case 'get_service_topology':
          result = await this.getServiceTopology(params);
          break;
        case 'get_smartscape_entities':
          result = await this.getSmartscapeEntities(params);
          break;
        case 'run_usql_query':
          result = await this.runUsqlQuery(params);
          break;
        case 'get_synthetic_monitors':
          result = await this.getSyntheticMonitors(params);
          break;
        default:
          throw new Error(`Unknown MCP tool: ${toolName}`);
      }

      await setCache(cacheKey, result, 30);
      return result;
    } catch (err) {
      logger.error(`Dynatrace MCP tool call failed: ${toolName}`, {
        error: err.message,
        params,
      });
      throw new Error(`Dynatrace MCP error: ${err.message}`);
    }
  }

  async getProblems({ status = 'OPEN', severity, pageSize = 50 } = {}) {
    const params = { pageSize, problemStatus: status };
    if (severity) params.severityLevel = severity;
    const { data } = await this.client.get('/problems', { params });
    return data;
  }

  async getProblemDetails(problemId) {
    const { data } = await this.client.get(`/problems/${problemId}`);
    return data;
  }

  async getMetrics({ metricSelector, entitySelector, resolution, from, to } = {}) {
    const params = {
      metricSelector,
      entitySelector,
      resolution,
      from,
      to,
    };
    const { data } = await this.client.get('/metrics/query', { params });
    return data;
  }

  async getLogs({ query, from, to, pageSize = 100 } = {}) {
    const params = { query, from, to, pageSize };
    const { data } = await this.client.get('/logs/query', { params });
    return data;
  }

  async getServiceTopology({ entityId, from, to } = {}) {
    const params = { from, to };
    if (entityId) params.entityId = entityId;
    const { data } = await this.client.get('/entity/services', { params });
    return data;
  }

  async getSmartscapeEntities({ entityType, pageSize = 200 } = {}) {
    const params = { pageSize };
    if (entityType) params.entityType = entityType;
    const { data } = await this.client.get('/entity/infrastructure', { params });
    return data;
  }

  async runUsqlQuery({ query, pageSize = 100 } = {}) {
    const { data } = await this.client.post('/logs/query/table', { query, pageSize });
    return data;
  }

  async getSyntheticMonitors({ location, enabled } = {}) {
    const params = {};
    if (location) params.locationId = location;
    if (enabled !== undefined) params.enabled = enabled;
    const { data } = await this.client.get('/synthetic/monitors', { params });
    return data;
  }
}

export const dynatraceMCP = new DynatraceMCPClient();
