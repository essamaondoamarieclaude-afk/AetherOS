import { BaseAgent } from './agentBase.js';
import { SYSTEM_PROMPTS } from '../gemini/promptTemplates.js';
import { AGENT_NAMES, MCP_TOOLS } from '../../utils/constants.js';
import { Playbook } from '../database/models/playbooks.js';

export class ResponseAgent extends BaseAgent {
  constructor() {
    super(
      AGENT_NAMES.RESPONSE,
      SYSTEM_PROMPTS.RESPONSE,
      [
        MCP_TOOLS.GET_PROBLEMS,
        MCP_TOOLS.GET_SERVICE_TOPOLOGY,
        MCP_TOOLS.GET_METRICS,
        MCP_TOOLS.RUN_USQL_QUERY,
      ],
    );
  }

  async generateRemediation(incidentData, rootCauseReport, analystNotes = '') {
    const playbooks = await Playbook.find({
      'triggerConditions.severity': incidentData.severity,
    }).limit(5);

    const context = {
      get_problems: { problemId: incidentData.dynatraceProblemId },
      get_service_topology: {},
      get_metrics: {},
      run_usql_query: {},
      additionalContext: `
=== Root Cause Report ===
${JSON.stringify(rootCauseReport)}

${analystNotes ? `=== Analyst Notes ===\n${analystNotes}` : ''}

=== Available Playbooks ===
${JSON.stringify(playbooks.map((p) => ({
  name: p.name,
  steps: p.steps,
  successRate: p.successRate,
})), null, 2)}`,
      incidentId: incidentData.incidentId,
    };

    return this.analyze(
      `Generate remediation plan for incident: ${incidentData.title} (severity: ${incidentData.severity})`,
      context,
    );
  }
}
