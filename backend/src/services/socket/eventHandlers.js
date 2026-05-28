import { SOCKET_EVENTS } from '../../utils/constants.js';

export const emitTelemetryUpdate = (io, data) => {
  io.emit(SOCKET_EVENTS.TELEMETRY_UPDATE, {
    type: 'telemetry_update',
    ...data,
    timestamp: new Date().toISOString(),
  });
};

export const emitIncidentUpdate = (io, incidentId, data) => {
  io.to(`incident:${incidentId}`).emit(SOCKET_EVENTS.INCIDENT_UPDATE, {
    incidentId,
    ...data,
    timestamp: new Date().toISOString(),
  });
  io.emit(SOCKET_EVENTS.INCIDENT_UPDATE, {
    incidentId,
    ...data,
    broadcast: true,
    timestamp: new Date().toISOString(),
  });
};

export const emitAgentStatus = (io, agentName, status) => {
  io.emit(SOCKET_EVENTS.AGENT_STATUS, {
    agentName,
    status,
    timestamp: new Date().toISOString(),
  });
};

export const emitPredictionUpdate = (io, data) => {
  io.emit(SOCKET_EVENTS.PREDICTION_UPDATE, {
    type: 'prediction_update',
    ...data,
    timestamp: new Date().toISOString(),
  });
};

export const emitSecurityAlert = (io, data) => {
  io.emit(SOCKET_EVENTS.SECURITY_ALERT, {
    type: 'security_alert',
    ...data,
    timestamp: new Date().toISOString(),
  });
};
