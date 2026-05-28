export const SEVERITY_LEVELS = {
  INFO: 'info',
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

export const AGENT_NAMES = {
  ROOT_CAUSE: 'root-cause-agent',
  PREDICTIVE: 'predictive-agent',
  SECURITY: 'security-agent',
  INFRASTRUCTURE: 'infrastructure-agent',
  RESPONSE: 'response-agent',
  ORCHESTRATOR: 'master-orchestrator',
};

export const AGENT_STATUS = {
  IDLE: 'idle',
  ANALYZING: 'analyzing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  BLOCKED: 'blocked',
};

export const INCIDENT_STATUS = {
  OPEN: 'open',
  ANALYZING: 'analyzing',
  REMEDIATING: 'remediating',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};

export const SOCKET_EVENTS = {
  TELEMETRY_UPDATE: 'telemetry:update',
  INCIDENT_UPDATE: 'incident:update',
  AGENT_STATUS: 'agent:status',
  AGENT_FINDING: 'agent:finding',
  PREDICTION_UPDATE: 'prediction:update',
  TOPOLOGY_UPDATE: 'topology:update',
  SECURITY_ALERT: 'security:alert',
  ANALYST_ACTION: 'analyst:action',
  CONNECTION_ACK: 'connection:ack',
};

export const MCP_TOOLS = {
  GET_PROBLEMS: 'get_problems',
  LIST_PROBLEMS: 'list_problems',
  GET_METRICS: 'get_metrics',
  GET_LOGS: 'get_logs',
  GET_SERVICE_TOPOLOGY: 'get_service_topology',
  GET_SMARTSCAPE_ENTITIES: 'get_smartscape_entities',
  RUN_USQL_QUERY: 'run_usql_query',
  GET_SYNTHETIC_MONITORS: 'get_synthetic_monitors',
};

export const ANALYSIS_INTERVALS = {
  PREDICTIVE: 5 * 60 * 1000,
  INFRASTRUCTURE: 60 * 1000,
  SECURITY: 2 * 60 * 1000,
};
