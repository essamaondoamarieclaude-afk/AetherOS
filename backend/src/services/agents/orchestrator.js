import { BaseAgent } from './agentBase.js';
import { RootCauseAgent } from './rootCauseAgent.js';
import { PredictiveAgent } from './predictiveAgent.js';
import { SecurityAgent } from './securityAgent.js';
import { InfrastructureAgent } from './infrastructureAgent.js';
import { ResponseAgent } from './responseAgent.js';
import { geminiClient } from '../gemini/geminiClient.js';
import { SYSTEM_PROMPTS } from '../gemini/promptTemplates.js';
import { dynatraceMCP } from '../dynatrace/mcpClient.js';
import logger from '../../utils/logger.js';
import { generateId, now } from '../../utils/helpers.js';
import { AGENT_NAMES, AGENT_STATUS, SOCKET_EVENTS, SEVERITY_LEVELS } from '../../utils/constants.js';

export class MasterOrchestrator extends BaseAgent {
  constructor() {
    super(AGENT_NAMES.ORCHESTRATOR, SYSTEM_PROMPTS.ORCHESTRATOR, []);
    this.agents = {
      [AGENT_NAMES.ROOT_CAUSE]: new RootCauseAgent(),
      [AGENT_NAMES.PREDICTIVE]: new PredictiveAgent(),
      [AGENT_NAMES.SECURITY]: new SecurityAgent(),
      [AGENT_NAMES.INFRASTRUCTURE]: new InfrastructureAgent(),
      [AGENT_NAMES.RESPONSE]: new ResponseAgent(),
    };
    this.socketIO = null;
  }

  setSocketIO(io) {
    this.socketIO = io;
  }

  async handleProblemEvent(problemData) {
    const correlationId = generateId();
    logger.info('Orchestrator processing problem event', {
      correlationId,
      problemId: problemData.problemId,
      severity: problemData.severityLevel,
    });

    this._emitEvent(SOCKET_EVENTS.INCIDENT_UPDATE, {
      correlationId,
      type: 'problem_received',
      problemData,
    });

    try {
      const rcaResult = await this.agents[AGENT_NAMES.ROOT_CAUSE].analyzeProblem(
        problemData.problemId,
        { correlationId },
      );
      this._emitEvent(SOCKET_EVENTS.AGENT_FINDING, rcaResult);

      const infraResult = await this.agents[AGENT_NAMES.INFRASTRUCTURE].assessHealth();
      this._emitEvent(SOCKET_EVENTS.AGENT_FINDING, infraResult);

      const remediationResult = await this.agents[AGENT_NAMES.RESPONSE].generateRemediation(
        {
          incidentId: correlationId,
          title: problemData.title,
          severity: problemData.severityLevel,
          dynatraceProblemId: problemData.problemId,
        },
        rcaResult.finding.result,
      );
      this._emitEvent(SOCKET_EVENTS.AGENT_FINDING, remediationResult);

      const synthesis = await this._synthesizeResults([
        rcaResult,
        infraResult,
        remediationResult,
      ]);
      this._emitEvent(SOCKET_EVENTS.INCIDENT_UPDATE, {
        correlationId,
        type: 'analysis_complete',
        synthesis,
      });

      return { correlationId, rcaResult, remediationResult, synthesis };
    } catch (err) {
      logger.error('Orchestrator pipeline failed', {
        correlationId,
        error: err.message,
      });
      this._emitEvent(SOCKET_EVENTS.INCIDENT_UPDATE, {
        correlationId,
        type: 'analysis_failed',
        error: err.message,
      });
      throw err;
    }
  }

  async runPredictiveAnalysis() {
    logger.info('Orchestrator running predictive analysis cycle');

    try {
      const result = await this.agents[AGENT_NAMES.PREDICTIVE].forecast('all');
      this._emitEvent(SOCKET_EVENTS.PREDICTION_UPDATE, result);
      return result;
    } catch (err) {
      logger.error('Predictive analysis cycle failed', { error: err.message });
    }
  }

  async runInfrastructureScan() {
    logger.info('Orchestrator running infrastructure scan');

    try {
      const result = await this.agents[AGENT_NAMES.INFRASTRUCTURE].assessHealth();
      this._emitEvent(SOCKET_EVENTS.TOPOLOGY_UPDATE, result);
      return result;
    } catch (err) {
      logger.error('Infrastructure scan failed', { error: err.message });
    }
  }

  async runSecurityAnalysis() {
    logger.info('Orchestrator running security analysis');

    try {
      const result = await this.agents[AGENT_NAMES.SECURITY].analyzeLogs(
        'severity>=warning OR source="security"',
      );
      this._emitEvent(SOCKET_EVENTS.SECURITY_ALERT, result);
      return result;
    } catch (err) {
      logger.error('Security analysis failed', { error: err.message });
    }
  }

  async _synthesizeResults(agentResults) {
    const prompt = `
${this.systemPrompt}

=== Agent Results to Synthesize ===
${agentResults.map((r) => `
--- ${r.agent} ---
${JSON.stringify(r.finding, null, 2)}
`).join('\n')}

Synthesize these findings into a unified operational intelligence report. Prioritize by severity and impact.`;

    try {
      const { text } = await geminiClient.generate(prompt, { temperature: 0.3 });
      return { synthesis: text, timestamp: now() };
    } catch (err) {
      logger.error('Synthesis failed', { error: err.message });
      return { synthesis: 'Synthesis unavailable', error: err.message };
    }
  }

  _emitEvent(event, data) {
    if (this.socketIO) {
      this.socketIO.emit(event, data);
    }
  }

  getAgentStatuses() {
    const statuses = {};
    for (const [name, agent] of Object.entries(this.agents)) {
      statuses[name] = agent.getStatus();
    }
    return statuses;
  }
}

export const orchestrator = new MasterOrchestrator();
