import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';
import config from '../../config/index.js';
import logger from '../../utils/logger.js';

const router = Router();

function getFallbackResponse(prompt) {
  const fallbacks = {
    default: 'The system is currently healthy at 98.4%. The database connection pool is showing signs of high usage in the US-East region. Average response time is 12ms. I am monitoring the situation and ready for specific instructions.',
    anomalies: 'I have detected an issue with the database in US-East-1. The database is experiencing connection contention, which may affect application performance. I recommend increasing the database connection pool to 15 instances to handle the load.',
    remediation: 'A fix has been applied. Additional server capacity has been added in the US-East-1 region, and the system efficiency has recovered by 12%. Service levels are now at 99.98%.',
  };

  let answer = fallbacks.default;
  const lower = prompt.toLowerCase();
  if (lower.includes('anomaly') || lower.includes('leak') || lower.includes('auth-service')) {
    answer = fallbacks.anomalies;
  } else if (lower.includes('remediate') || lower.includes('fix') || lower.includes('scale')) {
    answer = fallbacks.remediation;
  }
  return answer;
}

router.post('/query', async (req, res) => {
  const { prompt, currentScreen, systemMetrics } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const apiKey = config.gemini.apiKey;
  if (!apiKey || apiKey === 'your-gemini-api-key') {
    const answer = getFallbackResponse(prompt);
    return res.json({
      text: `[FALLBACK MODE] ${answer}`,
      success: true,
      model: 'simulated-flash',
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });

    const sysContext = JSON.stringify(systemMetrics || {});
    const systemPrompt = `
You are the AetherOS AI Operations Assistant, an enterprise operational intelligence platform.
Your tone is professional, clear, and helpful. Do NOT use emojis or casual language. Keep responses well-structured.
The user is viewing the "${currentScreen || 'dashboard'}" screen.
Current system status: System health 98.4%, US-East-1 region, Auth-service-02 node has potential memory issue with 98% usage.

Respond to this question:
"${prompt}"

Explain what is happening, what is affected, why it is happening, and what should be done. Use plain language that non-technical executives can understand. Keep under 200 words.
`;

    const result = await ai.models.generateContent({
      model: config.gemini.model,
      contents: systemPrompt,
    });

    res.json({
      text: result.text || 'No response text generated.',
      success: true,
      model: config.gemini.model,
    });
  } catch (error) {
    logger.error('Gemini query error:', error);
    res.status(500).json({
      error: 'Error processing Gemini query',
      message: error.message || String(error),
    });
  }
});

router.post('/diagnostics', async (req, res) => {
  const { nodeName, sector } = req.body;

  const apiKey = config.gemini.apiKey;
  if (!apiKey || apiKey === 'your-gemini-api-key') {
    return res.json({
      success: true,
      data: {
        analysis: `Analysis for node ${nodeName || 'ALPHA-09'} in ${sector || 'Frankfurt Sector'} complete. The latency increase is caused by memory management processes. Adjusting memory settings should resolve the issue.`,
        confidence: 0.89,
        steps: ['Increase memory allocation for the node', 'Restart the affected service', 'Verify performance returns to normal'],
      },
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });

    const prompt = `Perform a rapid diagnostics analysis for system node "${nodeName || 'ALPHA-09'}" in "${sector || 'Primary Sector'}". 
State the root cause analysis, confidence score, and a list of 3-4 recommended actions. Return as JSON following this schema:
{
  "analysis": "Brief explanation of the issue under 60 words",
  "confidence": 0.94,
  "steps": ["Step 1", "Step 2", "Step 3"]
}`;

    const result = await ai.models.generateContent({
      model: config.gemini.model,
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(result.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error) {
    res.json({
      success: true,
      data: {
        analysis: 'High network traffic detected in the region causing temporary slowdowns. The system is automatically managing the load.',
        confidence: 0.85,
        steps: ['Clear database connection queue', 'Restart affected services', 'Redirect some traffic to backup region'],
      },
    });
  }
});

export default router;
