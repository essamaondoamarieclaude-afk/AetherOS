import config from '../../config/index.js';
import logger from '../../utils/logger.js';

class GeminiClient {
  constructor() {
    this.apiKey = config.gemini.apiKey;
    this.model = config.gemini.model;
    this.baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}`;
  }

  async generate(prompt, options = {}) {
    const { temperature = 0.2, maxOutputTokens = 4096, tools = [] } = options;

    const requestBody = {
      contents: [{
        parts: [{ text: prompt }],
      }],
      generationConfig: {
        temperature,
        maxOutputTokens,
        topP: 0.95,
        topK: 40,
      },
    };

    if (tools.length > 0) {
      requestBody.tools = tools;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        },
      );

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Gemini API error ${response.status}: ${errorBody}`);
      }

      const data = await response.json();
      return this._parseResponse(data);
    } catch (err) {
      logger.error('Gemini API call failed', { error: err.message });
      throw err;
    }
  }

  async generateStream(prompt, onChunk, options = {}) {
    const { temperature = 0.2, maxOutputTokens = 4096 } = options;

    const requestBody = {
      contents: [{
        parts: [{ text: prompt }],
      }],
      generationConfig: {
        temperature,
        maxOutputTokens,
        topP: 0.95,
        topK: 40,
      },
    };

    try {
      const response = await fetch(
        `${this.baseUrl}:streamGenerateContent?alt=sse&key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        },
      );

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Gemini stream error ${response.status}: ${errorBody}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const parsed = JSON.parse(line.slice(6));
              const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
              if (text && onChunk) onChunk(text);
            } catch {
              // skip malformed chunks
            }
          }
        }
      }
    } catch (err) {
      logger.error('Gemini stream failed', { error: err.message });
      throw err;
    }
  }

  _parseResponse(data) {
    const candidate = data.candidates?.[0];
    if (!candidate) {
      throw new Error('No candidates in Gemini response');
    }

    const text = candidate.content?.parts?.map((p) => p.text).join('') || '';
    const finishReason = candidate.finishReason;

    return {
      text,
      finishReason,
      safetyRatings: candidate.safetyRatings || [],
      usageMetadata: data.usageMetadata || {},
    };
  }
}

export const geminiClient = new GeminiClient();
