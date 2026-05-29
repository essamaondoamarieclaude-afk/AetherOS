import config from '../../config/index.js';
import logger from '../../utils/logger.js';

class GeminiClient {
  constructor() {
    this.apiKey = config.gemini.apiKey;
    this.model = config.gemini.model;
    this.baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}`;
    this.ready = Boolean(this.apiKey);
    if (!this.ready) {
      logger.warn('Gemini API key not configured. AI agent features will be unavailable.');
    }
  }

  _checkReady() {
    if (!this.ready) {
      throw new Error('Gemini API key not configured. Set GEMINI_API_KEY in .env');
    }
  }

  async generate(prompt, options = {}) {
    this._checkReady();
    const { temperature = 0.2, maxOutputTokens = 4096, tools = [] } = options;
    const maxRetries = 3;

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

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
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
          if (response.status === 429 && attempt < maxRetries) {
            const delayMs = this._parseRetryDelay(errorBody);
            logger.warn(`Gemini rate limited (attempt ${attempt}/${maxRetries}). Retrying in ${delayMs}ms`);
            await this._sleep(delayMs);
            continue;
          }
          throw new Error(`Gemini API error ${response.status}: ${errorBody}`);
        }

        const data = await response.json();
        return this._parseResponse(data);
      } catch (err) {
        if (attempt >= maxRetries) {
          logger.error('Gemini API call failed', { error: err.message });
          throw err;
        }
        throw err;
      }
    }
  }

  async generateStream(prompt, onChunk, options = {}) {
    this._checkReady();
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

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  _parseRetryDelay(errorBody) {
    try {
      const parsed = JSON.parse(errorBody);
      const retryInfo = parsed.error?.details?.find(d => d['@type']?.includes('RetryInfo'));
      if (retryInfo?.retryDelay) {
        const match = retryInfo.retryDelay.match(/^(\d+(?:\.\d+)?)s/);
        if (match) {
          return Math.ceil(parseFloat(match[1]) * 1000) + 1000;
        }
      }
    } catch {}
    return 5000;
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
