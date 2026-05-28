import { BaseAgent } from './agentBase.js';
import { SYSTEM_PROMPTS } from '../gemini/promptTemplates.js';
import { AGENT_NAMES, MCP_TOOLS } from '../../utils/constants.js';

export class PredictiveAgent extends BaseAgent {
  constructor() {
    super(
      AGENT_NAMES.PREDICTIVE,
      SYSTEM_PROMPTS.PREDICTIVE,
      [
        MCP_TOOLS.GET_METRICS,
        MCP_TOOLS.RUN_USQL_QUERY,
        MCP_TOOLS.GET_SYNTHETIC_MONITORS,
      ],
    );
  }

  async forecast(entityId, metricSelectors = []) {
    const context = {
      get_metrics: {
        metricSelector: metricSelectors.join(','),
        entitySelector: `entityId("${entityId}")`,
      },
      run_usql_query: {},
      get_synthetic_monitors: {},
    };

    return this.analyze(
      `Perform predictive analysis for entity: ${entityId}. Metrics: ${metricSelectors.join(', ')}`,
      context,
    );
  }
}
