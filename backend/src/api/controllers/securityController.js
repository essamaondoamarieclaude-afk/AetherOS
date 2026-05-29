import supabase from '../../services/database/supabaseClient.js';
import { orchestrator } from '../../services/agents/orchestrator.js';
import { toCamelCase } from '../../utils/transform.js';

export const getSecurityAlerts = async (req, res, next) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const { data: alerts, count: total, error } = await supabase
      .from('agent_memory')
      .select('*', { count: 'exact' })
      .eq('agent_id', 'security-agent')
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) throw error;
    res.json({ alerts: alerts.map(toCamelCase), total, offset: Number(offset), limit: Number(limit) });
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
