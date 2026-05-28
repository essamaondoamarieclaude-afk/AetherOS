import { BaseAgent } from './agentBase.js';
import { SYSTEM_PROMPTS } from '../gemini/promptTemplates.js';
import { AGENT_NAMES, MCP_TOOLS } from '../../utils/constants.js';

export class SecurityAgent extends BaseAgent {
  constructor() {
    super(
      AGENT_NAMES.SECURITY,
      SYSTEM_PROMPTS.SECURITY,
      [
        MCP_TOOLS.GET_LOGS,
        MCP_TOOLS.GET_PROBLEMS,
        MCP_TOOLS.GET_METRICS,
      ],
    );
  }

  async analyzeLogs(query, from, to) {
    const context = {
      get_logs: { query, from, to },
      get_problems: {},
      get_metrics: {},
    };

    return this.analyze(
      `Perform security analysis on logs. Query: ${query}`,
      context,
    );
  }
}
