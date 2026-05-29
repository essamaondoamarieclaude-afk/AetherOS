const API_BASE = '/api';

let authToken: string | null = null;

async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T | null> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  try {
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    if (!res.ok) return null;
    return await res.json() as T;
  } catch {
    return null;
  }
}

export async function login(email = 'admin@aetheros.io', password = 'admin') {
  const data = await apiFetch<{ token: string; user: { email: string; role: string } }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data?.token) {
    authToken = data.token;
  }
  return data;
}

export function getToken() {
  return authToken;
}

export const api = {
  getIncidents: () =>
    apiFetch<{ incidents: unknown[]; total: number }>('/incidents'),

  getAgentStatuses: () =>
    apiFetch<Record<string, { name: string; status: string; currentTask: string | null }>>('/agents'),

  getPredictions: () =>
    apiFetch<{ predictions: unknown[]; total: number }>('/predictions'),

  getHealth: () =>
    apiFetch<{ status: string; services: Record<string, boolean> }>('/health'),

  triggerAnalysis: (agentName: string, input: string, context = {}) =>
    apiFetch(`/agents/${agentName}/analyze`, {
      method: 'POST',
      body: JSON.stringify({ input, context }),
    }),

  analyzeIncident: (dynatraceProblemId: string, title?: string) =>
    apiFetch('/incidents/analyze', {
      method: 'POST',
      body: JSON.stringify({ dynatraceProblemId, title }),
    }),

  queryMetrics: (metricSelector: string, entitySelector?: string) =>
    apiFetch(`/telemetry/metrics?metricSelector=${encodeURIComponent(metricSelector)}${entitySelector ? `&entitySelector=${encodeURIComponent(entitySelector)}` : ''}`),
};
