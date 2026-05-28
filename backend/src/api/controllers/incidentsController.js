import { Incident } from '../../services/database/models/incidents.js';
import { orchestrator } from '../../services/agents/orchestrator.js';
import logger from '../../utils/logger.js';
import { generateId } from '../../utils/helpers.js';

export const getIncidents = async (req, res, next) => {
  try {
    const { status, severity, limit = 50, offset = 0 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (severity) filter.severity = severity;

    const [incidents, total] = await Promise.all([
      Incident.find(filter).sort({ createdAt: -1 }).skip(Number(offset)).limit(Number(limit)),
      Incident.countDocuments(filter),
    ]);

    res.json({ incidents, total, offset: Number(offset), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
};

export const getIncidentById = async (req, res, next) => {
  try {
    const incident = await Incident.findOne({ incidentId: req.params.id });
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    res.json(incident);
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
    const incident = await Incident.findOne({ incidentId: req.params.id });
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    incident.remediation.approved = true;
    incident.remediation.approvedBy = req.user?.email || 'analyst';
    incident.remediation.approvedAt = new Date();
    incident.status = 'remediating';
    incident.timeline.push({
      event: 'remediation_approved',
      actor: req.user?.email || 'analyst',
      details: 'Remediation plan approved',
    });

    await incident.save();
    res.json(incident);
  } catch (err) {
    next(err);
  }
};

export const closeIncident = async (req, res, next) => {
  try {
    const incident = await Incident.findOne({ incidentId: req.params.id });
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    incident.status = 'closed';
    incident.remediation.resolvedAt = new Date();
    incident.timeline.push({
      event: 'incident_closed',
      actor: req.user?.email || 'analyst',
      details: req.body.reason || 'Incident resolved',
    });

    await incident.save();
    res.json(incident);
  } catch (err) {
    next(err);
  }
};
