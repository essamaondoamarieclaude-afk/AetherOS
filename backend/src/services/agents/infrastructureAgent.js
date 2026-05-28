import { BaseAgent } from './agentBase.js';
import { SYSTEM_PROMPTS } from '../gemini/promptTemplates.js';
import { AGENT_NAMES, MCP_TOOLS } from '../../utils/constants.js';

export class InfrastructureAgent extends BaseAgent {
  constructor() {
    super(
      AGENT_NAMES.INFRASTRUCTURE,
      SYSTEM_PROMPTS.INFRASTRUCTURE,
      [
        MCP_TOOLS.GET_SMARTSCAPE_ENTITIES,
        MCP_TOOLS.GET_SERVICE_TOPOLOGY,
        MCP_TOOLS.GET_METRICS,
      ],
    );
  }

  async assessHealth(entityType) {
    const context = {
      get_smartscape_entities: { entityType },
      get_service_topology: {},
      get_metrics: {},
    };

    return this.analyze(
      `Perform infrastructure health assessment. Entity type: ${entityType || 'all'}`,
      context,
    );
  }
}
