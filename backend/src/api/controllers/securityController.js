import { orchestrator } from '../../services/agents/orchestrator.js';
import { AgentMemory } from '../../services/database/models/agentMemory.js';

export const getSecurityAlerts = async (req, res, next) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const [alerts, total] = await Promise.all([
      AgentMemory.find({ agentId: 'security-agent' })
        .sort({ createdAt: -1 })
        .skip(Number(offset))
        .limit(Number(limit)),
      AgentMemory.countDocuments({ agentId: 'security-agent' }),
    ]);

    res.json({ alerts, total, offset: Number(offset), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
};

export const runSecurityAnalysis = async (req, res, next) => {
  try {
    const result = await orchestrator.runSecurityAnalysis();
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getComplianceStatus = async (req, res, next) => {
  try {
    const result = await orchestrator.agents['security-agent'].analyze(
      'Assess current compliance status based on available security telemetry',
      {},
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};
