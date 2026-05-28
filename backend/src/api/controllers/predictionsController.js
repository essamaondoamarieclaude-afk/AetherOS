import { orchestrator } from '../../services/agents/orchestrator.js';
import { AgentMemory } from '../../services/database/models/agentMemory.js';

export const getPredictions = async (req, res, next) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const [predictions, total] = await Promise.all([
      AgentMemory.find({ agentId: 'predictive-agent' })
        .sort({ createdAt: -1 })
        .skip(Number(offset))
        .limit(Number(limit)),
      AgentMemory.countDocuments({ agentId: 'predictive-agent' }),
    ]);

    res.json({ predictions, total, offset: Number(offset), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
};

export const getPredictionById = async (req, res, next) => {
  try {
    const prediction = await AgentMemory.findOne({
      agentId: 'predictive-agent',
      sessionId: req.params.id,
    });

    if (!prediction) {
      return res.status(404).json({ error: 'Prediction not found' });
    }

    res.json(prediction);
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
