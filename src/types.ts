/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ScreenType = 'landing' | 'command' | 'incidents' | 'orchestra' | 'galaxy' | 'executive';

export interface Incident {
  id: string;
  title: string;
  severity: 'critical' | 'warning' | 'info';
  service: string;
  timestamp: string;
  description: string;
  status: 'active' | 'remediating' | 'resolved';
  uptimeImpact: string;
  blastRadius: string;
  userImpact: string;
  dataIntegrity: string;
  confidence: number;
}

export interface AgentLog {
  id: string;
  time: string;
  agentName: string;
  category: string;
  message: string;
  type: 'info' | 'thought' | 'success' | 'warning';
}

export interface NodeMetrics {
  id: string;
  name: string;
  type: 'edge' | 'core' | 'neural';
  status: 'stable' | 'degraded' | 'maintenance';
  traffic: string;
  latency: string;
  cpu: number;
  memory: number;
  x: number;
  y: number;
}

export interface AgentMetric {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'scanning' | 'idle' | 'executing';
  latency: string;
  load: number;
}
