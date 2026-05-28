import logger from '../utils/logger.js';
import { orchestrator } from '../services/agents/orchestrator.js';
import { Incident } from '../services/database/models/incidents.js';
import { generateId, parseSeverity } from '../utils/helpers.js';

export const handleDynatraceWebhook = async (req, res, next) => {
  try {
    const payload = req.body;
    logger.info('Dynatrace webhook received', {
      problemId: payload.ProblemID || payload.problemId,
      state: payload.State || payload.state,
    });

    const problemId = payload.ProblemID || payload.problemId;
    const state = payload.State || payload.state;
    const title = payload.ProblemTitle || payload.title;
    const severity = parseSeverity(payload.ImpactLevel || payload.severityLevel);

    if (state === 'OPEN') {
      const incidentId = generateId();

      const incident = new Incident({
        incidentId,
        dynatraceProblemId: problemId,
        title,
        severity,
        status: 'open',
        affectedEntities: (payload.ImpactedEntities || payload.affectedEntities || []).map((e) => ({
          entityId: e.entityId || e.id,
          displayName: e.displayName || e.name,
          type: e.type,
        })),
        timeline: [{
          event: 'problem_detected',
          actor: 'dynatrace',
          details: `Problem ${problemId} received via webhook`,
        }],
      });
      await incident.save();

      orchestrator.handleProblemEvent({
        problemId,
        title,
        severityLevel: severity,
        affectedEntities: payload.ImpactedEntities || payload.affectedEntities,
      }).catch((err) => {
        logger.error('Webhook-triggered analysis failed', { problemId, error: err.message });
      });

      res.status(202).json({
        received: true,
        incidentId,
        problemId,
        message: 'Problem event received, analysis initiated',
      });
    } else if (state === 'RESOLVED' || state === 'CLOSED') {
      await Incident.findOneAndUpdate(
        { dynatraceProblemId: problemId },
        {
          status: 'resolved',
          'remediation.resolvedAt': new Date(),
          $push: {
            timeline: {
              event: 'problem_resolved',
              actor: 'dynatrace',
              details: `Problem ${problemId} resolved`,
            },
          },
        },
      );

      res.status(200).json({ received: true, problemId, message: 'Problem resolved' });
    } else {
      res.status(200).json({ received: true, problemId, state });
    }
  } catch (err) {
    next(err);
  }
};
