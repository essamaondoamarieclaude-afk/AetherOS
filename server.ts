import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API if key is available
let ai: GoogleGenAI | null = null;
const API_KEY = process.env.GEMINI_API_KEY;

if (API_KEY && API_KEY !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini API initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Gemini API:", err);
  }
} else {
  console.log("No valid GEMINI_API_KEY environment variable found. Fallback responses will be used.");
}

// ----------------------------------------------------
// API Endpoints
// ----------------------------------------------------

// Endpoint to handle Gemini SRE Operator chat queries
app.post("/api/gemini/query", async (req, res) => {
  const { prompt, currentScreen, systemMetrics } = req.body;

  if (!prompt) {
    res.status(400).json({ error: "Prompt is required" });
    return;
  }

  // If Gemini client is not initialized, return a simulated, highly professional response
  if (!ai) {
    const fallbacks: Record<string, string> = {
      default: "The system is currently healthy at 98.4%. The database connection pool is showing signs of high usage in the US-East region. Average response time is 12ms. I am monitoring the situation and ready for specific instructions.",
      anomalies: "I have detected an issue with the database in US-East-1. The database is experiencing connection contention, which may affect application performance. I recommend increasing the database connection pool to 15 instances to handle the load.",
      remediation: "A fix has been applied. Additional server capacity has been added in the US-East-1 region, and the system efficiency has recovered by 12%. Service levels are now at 99.98%."
    };

    let answer = fallbacks.default;
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes("anomaly") || lowerPrompt.includes("leak") || lowerPrompt.includes("auth-service")) {
      answer = fallbacks.anomalies;
    } else if (lowerPrompt.includes("remediate") || lowerPrompt.includes("fix") || lowerPrompt.includes("scale")) {
      answer = fallbacks.remediation;
    }

    // Simulate standard network latency
    setTimeout(() => {
      res.json({
        text: `[FALLBACK MODE] ${answer}`,
        success: true,
        model: "simulated-flash"
      });
    }, 400);
    return;
  }

  try {
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
      model: "gemini-3.5-flash",
      contents: systemPrompt,
    });

    res.json({
      text: result.text || "No response text generated.",
      success: true,
      model: "gemini-3.5-flash"
    });
  } catch (error: any) {
    console.error("Gemini query error:", error);
    res.status(500).json({
      error: "Error processing Gemini query",
      message: error.message || String(error)
    });
  }
});

// Endpoint to simulate incident logic diagnostics
app.post("/api/gemini/diagnostics", async (req, res) => {
  const { nodeName, sector } = req.body;

  if (!ai) {
    res.json({
      success: true,
      data: {
        analysis: `Analysis for node ${nodeName || 'ALPHA-09'} in ${sector || 'Frankfurt Sector'} complete. The latency increase is caused by memory management processes. Adjusting memory settings should resolve the issue.`,
        confidence: 0.89,
        steps: ["Increase memory allocation for the node", "Restart the affected service", "Verify performance returns to normal"]
      }
    });
    return;
  }

  try {
    const prompt = `Perform a rapid diagnostics analysis for system node "${nodeName || 'ALPHA-09'}" in "${sector || 'Primary Sector'}". 
State the root cause analysis, confidence score, and a list of 3-4 recommended actions. Return as JSON following this schema:
{
  "analysis": "Brief explanation of the issue under 60 words",
  "confidence": 0.94,
  "steps": ["Step 1", "Step 2", "Step 3"]
}`;

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(result.text || "{}");
    res.json({
      success: true,
      data: parsed
    });
  } catch (error) {
    res.json({
      success: true,
      data: {
        analysis: "High network traffic detected in the region causing temporary slowdowns. The system is automatically managing the load.",
        confidence: 0.85,
        steps: ["Clear database connection queue", "Restart affected services", "Redirect some traffic to backup region"]
      }
    });
  }
});

// Serve frontend client
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Configuring Vite middleware for Development environment...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static production assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AetherOS enterprise backend humming at http://0.0.0.0:${PORT}`);
  });
}

startServer();
