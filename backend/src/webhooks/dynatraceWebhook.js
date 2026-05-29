import supabase from '../services/database/supabaseClient.js';
import logger from '../utils/logger.js';
import { orchestrator } from '../services/agents/orchestrator.js';
import { generateId, parseSeverity } from '../utils/helpers.js';
import { toCamelCase } from '../utils/transform.js';

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

      const affectedEntities = (payload.ImpactedEntities || payload.affectedEntities || []).map((e) => ({
        entityId: e.entityId || e.id,
        displayName: e.displayName || e.name,
        type: e.type,
      }));

      const { error } = await supabase.from('incidents').insert({
        incident_id: incidentId,
        dynatrace_problem_id: problemId,
        title,
        severity,
        status: 'open',
        affected_entities: affectedEntities,
        timeline: [{
          event: 'problem_detected',
          actor: 'dynatrace',
          details: `Problem ${problemId} received via webhook`,
        }],
      });

      if (error) throw error;

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
      const { data: incident } = await supabase
        .from('incidents').select('*').eq('dynatrace_problem_id', problemId).single();

      if (incident) {
        const updatedTimeline = [...(incident.timeline || []), {
          timestamp: new Date().toISOString(),
          event: 'problem_resolved',
          actor: 'dynatrace',
          details: `Problem ${problemId} resolved`,
        }];

        const { error } = await supabase
          .from('incidents').update({
            status: 'resolved',
            remediation: {
              ...(incident.remediation || {}),
              resolvedAt: new Date().toISOString(),
            },
            timeline: updatedTimeline,
            updated_at: new Date().toISOString(),
          })
          .eq('dynatrace_problem_id', problemId);

        if (error) throw error;
      }

      res.status(200).json({ received: true, problemId, message: 'Problem resolved' });
    } else {
      res.status(200).json({ received: true, problemId, state });
    }
  } catch (err) {
    next(err);
  }
};
