import supabase from '../../services/database/supabaseClient.js';
import { orchestrator } from '../../services/agents/orchestrator.js';
import { toCamelCase } from '../../utils/transform.js';

export const getPredictions = async (req, res, next) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const { data: predictions, count: total, error } = await supabase
      .from('agent_memory')
      .select('*', { count: 'exact' })
      .eq('agent_id', 'predictive-agent')
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) throw error;
    res.json({ predictions: predictions.map(toCamelCase), total, offset: Number(offset), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
};

export const getPredictionById = async (req, res, next) => {
  try {
    const { data: prediction, error } = await supabase
      .from('agent_memory')
      .select('*')
      .eq('agent_id', 'predictive-agent')
      .eq('session_id', req.params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ error: 'Prediction not found' });
      throw error;
    }
    res.json(toCamelCase(prediction));
  } catch (err) {
    next(err);
  }
};

export const triggerPrediction = async (req, res, next) => {
  try {
    const result = await orchestrator.runPredictiveAnalysis();
    res.json(result);
  } catch (err) {
    next(err);
  }
};
