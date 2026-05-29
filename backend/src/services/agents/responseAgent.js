import { BaseAgent } from './agentBase.js';
import { SYSTEM_PROMPTS } from '../gemini/promptTemplates.js';
import { AGENT_NAMES, MCP_TOOLS } from '../../utils/constants.js';
import supabase from '../database/supabaseClient.js';

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
    const { data: playbooks } = await supabase
      .from('playbooks')
      .select('*')
      .limit(5);

    const matched = (playbooks || []).filter((p) =>
      (p.trigger_conditions || []).some((tc) => tc.severity === incidentData.severity),
    );

    const context = {
      get_problems: { problemId: incidentData.dynatraceProblemId },
      get_service_topology: {},
      get_metrics: {},
      run_usql_query: {},
      additionalContext: `
=== Root Cause Analysis ===
${JSON.stringify(rootCauseReport)}

${analystNotes ? `=== Analyst Notes ===\n${analystNotes}` : ''}

=== Available Playbooks ===
${JSON.stringify(matched.map((p) => ({
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
