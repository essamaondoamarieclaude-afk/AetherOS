import { geminiClient } from '../gemini/geminiClient.js';
import { dynatraceMCP } from '../dynatrace/mcpClient.js';
import logger from '../../utils/logger.js';
import { generateId, now, formatAgentOutput } from '../../utils/helpers.js';
import { AGENT_STATUS, AGENT_NAMES } from '../../utils/constants.js';
import { AgentMemory } from '../database/models/agentMemory.js';

export class BaseAgent {
  constructor(name, systemPrompt, mcpTools = []) {
    this.name = name;
    this.systemPrompt = systemPrompt;
    this.mcpTools = mcpTools;
    this.status = AGENT_STATUS.IDLE;
    this.currentTask = null;
  }

  async analyze(input, context = {}) {
    const startTime = Date.now();
    this.status = AGENT_STATUS.ANALYZING;
    this.currentTask = { input, context };
    const taskId = generateId();

    logger.info(`Agent ${this.name} starting analysis`, { taskId });

    try {
      const dynatraceData = await this._gatherDynatraceData(context);
      const prompt = this._buildPrompt(input, dynatraceData, context);

      const { text } = await geminiClient.generate(prompt, {
        temperature: 0.2,
        maxOutputTokens: 4096,
      });

      const result = this._parseResult(text);
      const processingTimeMs = Date.now() - startTime;

      await this._recordMemory(taskId, input, result, processingTimeMs, context);

      this.status = AGENT_STATUS.COMPLETED;
      this.currentTask = null;

      return formatAgentOutput(this.name, {
        result,
        processingTimeMs,
        confidenceScore: result.confidenceScore || 0,
        toolsUsed: this.mcpTools,
      });
    } catch (err) {
      this.status = AGENT_STATUS.FAILED;
      logger.error(`Agent ${this.name} failed`, { error: err.message, taskId });
      this.currentTask = null;
      throw err;
    }
  }

  async _gatherDynatraceData(context) {
    const data = {};
    for (const tool of this.mcpTools) {
      try {
        data[tool] = await dynatraceMCP.callTool(tool, context[tool] || {});
      } catch (err) {
        logger.warn(`Agent ${this.name}: MCP tool ${tool} failed`, {
          error: err.message,
        });
        data[tool] = { error: err.message };
      }
    }
    return data;
  }

  _buildPrompt(input, dynatraceData, context) {
    return `
${this.systemPrompt}

=== Current Task ===
${input}

=== Dynatrace Context ===
${JSON.stringify(dynatraceData, null, 2)}

${context.additionalContext ? `=== Additional Context ===\n${context.additionalContext}` : ''}

Provide your structured analysis output.`;
  }

  _parseResult(text) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch {
      // not JSON, return raw text
    }
    return { analysis: text };
  }

  async _recordMemory(taskId, input, result, processingTimeMs, context) {
    try {
      await AgentMemory.create({
        agentId: this.name,
        sessionId: taskId,
        incidentId: context.incidentId,
        input,
        output: result,
        confidenceScore: result.confidenceScore || 0,
        processingTimeMs,
        toolsUsed: this.mcpTools,
        context: {
          dynatraceProblemId: context.dynatraceProblemId,
          relatedEntities: context.relatedEntities || [],
          metricsUsed: context.metricsUsed || [],
        },
      });
    } catch (err) {
      logger.warn('Failed to save agent memory', { error: err.message });
    }
  }

  getStatus() {
    return {
      name: this.name,
      status: this.status,
      currentTask: this.currentTask,
      lastActive: now(),
    };
  }
}
