import { dynatraceMCP } from '../../services/dynatrace/mcpClient.js';
import { orchestrator } from '../../services/agents/orchestrator.js';

export const getTopology = async (req, res, next) => {
  try {
    const { entityType } = req.query;
    const [smartscape, services] = await Promise.all([
      dynatraceMCP.getSmartscapeEntities({ entityType }),
      dynatraceMCP.getServiceTopology({}),
    ]);

    res.json({
      entities: smartscape,
      services,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
};

export const getEntityDetails = async (req, res, next) => {
  try {
    const { entityId } = req.params;
    const [metrics, problems] = await Promise.all([
      dynatraceMCP.getMetrics({ entitySelector: `entityId("${entityId}")` }),
      dynatraceMCP.getProblems({ status: 'OPEN' }),
    ]);

    res.json({
      entityId,
      metrics,
      activeProblems: problems,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
};

export const getHealthReport = async (req, res, next) => {
  try {
    const result = await orchestrator.runInfrastructureScan();
    res.json(result);
  } catch (err) {
    next(err);
  }
};
