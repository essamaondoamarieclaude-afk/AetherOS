import { BaseAgent } from './agentBase.js';
import { SYSTEM_PROMPTS } from '../gemini/promptTemplates.js';
import { AGENT_NAMES, MCP_TOOLS } from '../../utils/constants.js';

export class RootCauseAgent extends BaseAgent {
  constructor() {
    super(
      AGENT_NAMES.ROOT_CAUSE,
      SYSTEM_PROMPTS.ROOT_CAUSE,
      [
        MCP_TOOLS.GET_PROBLEMS,
        MCP_TOOLS.GET_SERVICE_TOPOLOGY,
        MCP_TOOLS.GET_METRICS,
        MCP_TOOLS.RUN_USQL_QUERY,
      ],
    );
  }

  async analyzeProblem(problemId, additionalContext = {}) {
    const context = {
      get_problems: { problemId },
      get_service_topology: {},
      get_metrics: {},
      run_usql_query: {},
      dynatraceProblemId: problemId,
      ...additionalContext,
    };

    return this.analyze(`Perform root cause analysis on problem ID: ${problemId}`, context);
  }
}
