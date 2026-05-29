import dotenv from 'dotenv';
dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3001,
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'aetheros-dev-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  dynatrace: {
    apiUrl: process.env.DT_API_URL,
    apiToken: process.env.DT_API_TOKEN,
    mcpEnabled: process.env.DT_MCP_ENABLED === 'true',
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-001',
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD || undefined,
  },
  googleCloud: {
    project: process.env.GOOGLE_CLOUD_PROJECT,
    credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    agentBuilder: {
      location: process.env.AGENT_BUILDER_LOCATION || 'global',
      dataStore: process.env.AGENT_BUILDER_DATA_STORE,
    },
  },
  socket: {
    pingInterval: parseInt(process.env.SOCKET_PING_INTERVAL, 10) || 25000,
    pingTimeout: parseInt(process.env.SOCKET_PING_TIMEOUT, 10) || 20000,
  },
};

export default config;
