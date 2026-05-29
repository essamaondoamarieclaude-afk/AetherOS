import supabase from '../../services/database/supabaseClient.js';
import { orchestrator } from '../../services/agents/orchestrator.js';
import { toCamelCase } from '../../utils/transform.js';
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

    const { data: entries, count: total, error } = await supabase
      .from('agent_memory')
      .select('*', { count: 'exact' })
      .eq('agent_id', agentName)
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) throw error;
    res.json({ entries: entries.map(toCamelCase), total, offset: Number(offset), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
};
