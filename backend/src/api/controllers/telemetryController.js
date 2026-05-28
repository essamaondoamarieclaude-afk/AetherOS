import { dynatraceMCP } from '../../services/dynatrace/mcpClient.js';
import logger from '../../utils/logger.js';

export const queryMetrics = async (req, res, next) => {
  try {
    const { metricSelector, entitySelector, resolution, from, to } = req.query;
    if (!metricSelector) {
      return res.status(400).json({ error: 'metricSelector query parameter required' });
    }

    const data = await dynatraceMCP.getMetrics({ metricSelector, entitySelector, resolution, from, to });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const queryLogs = async (req, res, next) => {
  try {
    const { query, from, to, pageSize } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'query parameter required' });
    }

    const data = await dynatraceMCP.getLogs({ query, from, to, pageSize: Number(pageSize) || 100 });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const runUsql = async (req, res, next) => {
  try {
    const { query, pageSize } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'query field required in body' });
    }

    const data = await dynatraceMCP.runUsqlQuery({ query, pageSize: Number(pageSize) || 100 });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getTelemetrySnapshot = async (req, res, next) => {
  try {
    const { entityId } = req.params;
    const [metrics, problems] = await Promise.all([
      dynatraceMCP.getMetrics({ entitySelector: `entityId("${entityId}")` }),
      dynatraceMCP.getProblems({ status: 'OPEN' }),
    ]);

    res.json({
      entityId,
      metrics,
      problems,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
};
