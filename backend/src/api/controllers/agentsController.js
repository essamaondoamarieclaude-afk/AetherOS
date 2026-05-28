import { orchestrator } from '../../services/agents/orchestrator.js';
import { AgentMemory } from '../../services/database/models/agentMemory.js';
import { AGENT_NAMES } from '../../utils/constants.js';

export const getAgentStatuses = (req, res) => {
  const statuses = orchestrator.getAgentStatuses();
  res.json(statuses);
};

export const triggerAgentAnalysis = async (req, res, next) => {
  try {
    const { agentName } = req.params;
    const { input, context } = req.body;

    const agent = orchestrator.agents[agentName];
    if (!agent) {
      return res.status(400).json({
        error: `Unknown agent: ${agentName}`,
        availableAgents: Object.values(AGENT_NAMES),
      });
    }

    const result = await agent.analyze(input || 'Manual analysis request', context || {});
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getAgentHistory = async (req, res, next) => {
  try {
    const { agentName } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const [entries, total] = await Promise.all([
      AgentMemory.find({ agentId: agentName })
        .sort({ createdAt: -1 })
        .skip(Number(offset))
        .limit(Number(limit)),
      AgentMemory.countDocuments({ agentId: agentName }),
    ]);

    res.json({ entries, total, offset: Number(offset), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
};
