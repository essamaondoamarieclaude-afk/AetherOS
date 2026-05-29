import supabase from '../../services/database/supabaseClient.js';
import { orchestrator } from '../../services/agents/orchestrator.js';
import { toCamelCase } from '../../utils/transform.js';
import logger from '../../utils/logger.js';

export const getIncidents = async (req, res, next) => {
  try {
    const { status, severity, limit = 50, offset = 0 } = req.query;
    let query = supabase.from('incidents').select('*', { count: 'exact' });
    if (status) query = query.eq('status', status);
    if (severity) query = query.eq('severity', severity);

    const { data: incidents, count: total, error } = await query
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) throw error;
    res.json({ incidents: incidents.map(toCamelCase), total, offset: Number(offset), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
};

export const getIncidentById = async (req, res, next) => {
  try {
    const { data: incident, error } = await supabase
      .from('incidents').select('*').eq('incident_id', req.params.id).single();

    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ error: 'Incident not found' });
      throw error;
    }
    res.json(toCamelCase(incident));
  } catch (err) {
    next(err);
  }
};

export const analyzeIncident = async (req, res, next) => {
  try {
    const { dynatraceProblemId } = req.body;
    if (!dynatraceProblemId) {
      return res.status(400).json({ error: 'dynatraceProblemId required' });
    }

    const result = await orchestrator.handleProblemEvent({
      problemId: dynatraceProblemId,
      title: req.body.title || 'Manual Analysis Request',
      severityLevel: req.body.severity || 'medium',
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const approveRemediation = async (req, res, next) => {
  try {
    const { data: incident, error: fetchErr } = await supabase
      .from('incidents').select('*').eq('incident_id', req.params.id).single();

    if (fetchErr) {
      if (fetchErr.code === 'PGRST116') return res.status(404).json({ error: 'Incident not found' });
      throw fetchErr;
    }

    const updatedTimeline = [...(incident.timeline || []), {
      timestamp: new Date().toISOString(),
      event: 'remediation_approved',
      actor: req.user?.email || 'analyst',
      details: 'Remediation plan approved',
    }];

    const { data: updated, error: updateErr } = await supabase
      .from('incidents').update({
        remediation: {
          ...(incident.remediation || {}),
          approved: true,
          approvedBy: req.user?.email || 'analyst',
          approvedAt: new Date().toISOString(),
        },
        status: 'remediating',
        timeline: updatedTimeline,
        updated_at: new Date().toISOString(),
      })
      .eq('incident_id', req.params.id)
      .select()
      .single();

    if (updateErr) throw updateErr;
    res.json(toCamelCase(updated));
  } catch (err) {
    next(err);
  }
};

export const closeIncident = async (req, res, next) => {
  try {
    const { data: incident, error: fetchErr } = await supabase
      .from('incidents').select('*').eq('incident_id', req.params.id).single();

    if (fetchErr) {
      if (fetchErr.code === 'PGRST116') return res.status(404).json({ error: 'Incident not found' });
      throw fetchErr;
    }

    const updatedTimeline = [...(incident.timeline || []), {
      timestamp: new Date().toISOString(),
      event: 'incident_closed',
      actor: req.user?.email || 'analyst',
      details: req.body.reason || 'Incident resolved',
    }];

    const { data: updated, error: updateErr } = await supabase
      .from('incidents').update({
        status: 'closed',
        remediation: {
          ...(incident.remediation || {}),
          resolvedAt: new Date().toISOString(),
        },
        timeline: updatedTimeline,
        updated_at: new Date().toISOString(),
      })
      .eq('incident_id', req.params.id)
      .select()
      .single();

    if (updateErr) throw updateErr;
    res.json(toCamelCase(updated));
  } catch (err) {
    next(err);
  }
};
