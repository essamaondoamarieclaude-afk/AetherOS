import { useState, useEffect } from 'react';
import { Bot, Brain, Shield, Activity, Zap, CheckCircle2, Server, Play, Pause, ChevronDown, ChevronUp, Wrench, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';

interface Agent {
  id: number;
  name: string;
  icon: any;
  status: 'active' | 'idle';
  tasksCompleted: number;
  accuracy: number;
  description: string;
  currentTask: string;
  idleTask: string;
  color: string;
  tools: string[];
  reasoningSteps: string[];
}

export function AIAgentsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [agentsState, setAgentsState] = useState<Agent[]>([
    {
      id: 1,
      name: 'Root Cause Agent',
      icon: Brain,
      status: 'active',
      tasksCompleted: 342,
      accuracy: 94,
      description: 'Analyzes infrastructure failures and correlates telemetry anomalies',
      currentTask: 'Analyzing payment-api postgresql pool limits...',
      idleTask: 'Awaiting anomaly trigger',
      color: 'from-[#0ea5e9] to-[#06b6d4]',
      tools: ['dynatrace.get_problems', 'dynatrace.get_metrics', 'gemini.analyze_anomaly'],
      reasoningSteps: [
        'Fetch active problems list from Dynatrace MCP',
        'Filter by high-severity host events',
        'Compare database connection charts with rate metrics',
        'Isolate connections pool exhaustion as root cause'
      ]
    },
    {
      id: 2,
      name: 'Predictive Intelligence',
      icon: Zap,
      status: 'active',
      tasksCompleted: 1247,
      accuracy: 89,
      description: 'Forecasts outages and scaling risks before customer impact',
      currentTask: 'Running database connection forecasting...',
      idleTask: 'Standby monitoring',
      color: 'from-[#8b5cf6] to-[#a78bfa]',
      tools: ['dynatrace.get_forecasts', 'dynatrace.detect_anomaly_trends'],
      reasoningSteps: [
        'Analyze historical CPU utilization trends (last 7d)',
        'Compute future resource consumption boundaries',
        'Identify risk threshold breaches within next 60m'
      ]
    },
    {
      id: 3,
      name: 'Security Intelligence',
      icon: Shield,
      status: 'idle',
      tasksCompleted: 156,
      accuracy: 91,
      description: 'Correlates operational anomalies with security threats',
      currentTask: 'Standby mode',
      idleTask: 'Monitoring background audit log entries...',
      color: 'from-[#22c55e] to-[#4ade80]',
      tools: ['dynatrace.get_security_events', 'gemini.correlate_security_logs'],
      reasoningSteps: [
        'Fetch security vulnerability lists from hosts',
        'Correlate system port scans with request volume spikes',
        'Audit RBAC admin access logs for unauthorized writes'
      ]
    },
    {
      id: 4,
      name: 'Infrastructure Agent',
      icon: Activity,
      status: 'active',
      tasksCompleted: 2891,
      accuracy: 96,
      description: 'Maintains system health and topology intelligence',
      currentTask: 'Updating service topology nodes mapping...',
      idleTask: 'Awaiting topology shifts',
      color: 'from-[#f59e0b] to-[#fbbf24]',
      tools: ['dynatrace.get_topology', 'dynatrace.get_hosts'],
      reasoningSteps: [
        'Scan active cluster services list',
        'Re-build graph dependencies mapping in real-time',
        'Verify host connection lines are healthy and reporting'
      ]
    },
    {
      id: 5,
      name: 'Response Orchestrator',
      icon: CheckCircle2,
      status: 'active',
      tasksCompleted: 523,
      accuracy: 92,
      description: 'Coordinates remediation workflows across teams',
      currentTask: 'Executing db connection pool scale script...',
      idleTask: 'Idle awaiting remediation trigger',
      color: 'from-[#0ea5e9] to-[#8b5cf6]',
      tools: ['dynatrace.execute_problem_remediation', 'gcp.rebuild_service_pod'],
      reasoningSteps: [
        'Receive root cause verification from Root Cause Agent',
        'Confirm approval criteria for self-healing script execution',
        'Dispatch GCP agent scale action rules to targets'
      ]
    },
  ]);

  const [expandedReasoning, setExpandedReasoning] = useState<Record<number, boolean>>({ 1: true });

  // Simulate active agent task strings changes
  useEffect(() => {
    const taskUpdates: Record<number, string[]> = {
      1: [
        'Analyzing payment-api postgresql pool limits...',
        'Correlating postgres-db metrics with CPU spikes...',
        'Querying active connection count histograms...'
      ],
      2: [
        'Running database connection forecasting...',
        'Predicting resource exhaustion limits for checkout-service...',
        'Computing 95% confidence interval bounds...'
      ],
      4: [
        'Updating service topology nodes mapping...',
        'Re-building dependency pathways graph...',
        'Resolving network links latency profiles...'
      ],
      5: [
        'Executing db connection pool scale script...',
        'Applying Kubernetes replica scaling overrides...',
        'Verifying target pod status reporting...'
      ],
    };

    const timer = setInterval(() => {
      setAgentsState((prev) =>
        prev.map((agent) => {
          if (agent.status === 'active' && taskUpdates[agent.id]) {
            const list = taskUpdates[agent.id];
            const nextIdx = Math.floor(Math.random() * list.length);
            return { ...agent, currentTask: list[nextIdx] };
          }
          return agent;
        })
      );
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const toggleAgentStatus = (id: number) => {
    setAgentsState((prev) =>
      prev.map((agent) => {
        if (agent.id === id) {
          const nextStatus = agent.status === 'active' ? 'idle' : 'active';
          return {
            ...agent,
            status: nextStatus,
            currentTask: nextStatus === 'active' ? agent.currentTask : 'Standby mode'
          };
        }
        return agent;
      })
    );
  };

  const toggleReasoning = (id: number) => {
    setExpandedReasoning((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activeCount = agentsState.filter((a) => a.status === 'active').length;
  const filteredAgents = agentsState.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full w-full custom-scrollbar">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bot className="text-[#8b5cf6] w-6 h-6" />
            AI Agent Orchestration
          </h2>
          <p className="text-xs text-white/50">Autonomous Gemini reasoning loops using Dynatrace MCP tools</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-white/10 bg-white/5 text-white/70">
            {activeCount} / {agentsState.length} Agents Running
          </Badge>
        </div>
      </div>

      {/* Agent workflow graph */}
      <div className="bg-[#13151c]/60 backdrop-blur-md rounded-xl p-5 border border-white/5">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
          Agent Coordination Workflow
        </h3>
        
        {/* Responsive Workflow SVG Canvas */}
        <div className="w-full overflow-x-auto py-2">
          <div className="min-w-[600px] relative h-28 flex items-center justify-between px-6 bg-[#0a0b0f]/50 border border-white/5 rounded-lg">
            
            {/* SVG connector lines mapping */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <linearGradient id="wfGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              {/* Connected pathways with animated dashed arrays */}
              <path
                d="M 120,56 C 200,56 160,56 240,56"
                stroke="url(#wfGrad)"
                strokeWidth="2"
                fill="none"
                className="animate-flow-line"
              />
              <path
                d="M 280,56 Q 340,20 400,56"
                stroke="#0ea5e9"
                strokeWidth="2"
                fill="none"
                className="animate-flow-line"
              />
              <path
                d="M 280,56 Q 340,92 400,56"
                stroke="#8b5cf6"
                strokeWidth="2"
                fill="none"
                className="animate-flow-line"
              />
              <path
                d="M 440,56 C 490,56 510,56 560,56"
                stroke="#22c55e"
                strokeWidth="2"
                fill="none"
                className="animate-flow-line"
              />
            </svg>

            {/* Nodes */}
            <div className="z-10 flex flex-col items-center">
              <div className="w-9 h-9 rounded-lg bg-[#f59e0b]/15 border border-f59e0b/30 flex items-center justify-center text-[#f59e0b]">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-white/50 mt-1">1. Topology Mapping</span>
            </div>

            <div className="z-10 flex flex-col items-center">
              <div className="w-9 h-9 rounded-lg bg-[#0ea5e9]/15 border border-[#0ea5e9]/30 flex items-center justify-center text-[#0ea5e9]">
                <Brain className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-white/50 mt-1">2. Root Cause Isolation</span>
            </div>

            <div className="z-10 flex flex-col items-center space-y-4">
              <div className="flex gap-12">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/15 border border-[#8b5cf6]/30 flex items-center justify-center text-[#8b5cf6]">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[8px] font-semibold text-white/40 mt-1">Predictive Logs</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-lg bg-[#22c55e]/15 border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e]">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[8px] font-semibold text-white/40 mt-1">Security Audit</span>
                </div>
              </div>
              <span className="text-[9px] font-bold text-white/50">3. Verification Loops</span>
            </div>

            <div className="z-10 flex flex-col items-center">
              <div className="w-9 h-9 rounded-lg bg-success/15 border border-success/30 flex items-center justify-center text-success">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-white/50 mt-1">4. Remediation Orchestration</span>
            </div>

          </div>
        </div>
      </div>

      {/* Agent Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search agents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-white/5 border border-white/5 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none focus:border-electric-blue pl-10"
        />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {filteredAgents.map((agent) => {
          const Icon = agent.icon;
          const isCollapsedReason = !expandedReasoning[agent.id];
          const isActive = agent.status === 'active';

          return (
            <motion.div
              key={agent.id}
              layout
              className={`bg-[#13151c]/60 backdrop-blur-md rounded-xl p-5 border transition-all flex flex-col justify-between ${
                isActive ? 'border-white/5 hover:border-[#0ea5e9]/20' : 'opacity-55 border-white/5 bg-[#13151c]/30'
              }`}
            >
              <div>
                
                {/* Agent Header toggler switch */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center shadow-md`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">{agent.status}</span>
                    <Switch
                      checked={isActive}
                      onCheckedChange={() => toggleAgentStatus(agent.id)}
                      aria-label={`Toggle active state of ${agent.name}`}
                    />
                  </div>
                </div>

                {/* Info titles */}
                <h3 className="text-sm font-bold text-white mb-1.5">{agent.name}</h3>
                <p className="text-xs text-white/50 leading-relaxed mb-4">{agent.description}</p>

                {/* Current Tasks streaming effect */}
                <div className="bg-[#0a0b0f]/50 border border-white/5 rounded-lg p-3 mb-4">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block mb-1">Execution Log</span>
                  <div className="flex items-center gap-2">
                    {isActive && (
                      <div className="flex gap-0.5">
                        <span className="w-1 h-1 rounded-full bg-[#0ea5e9] typing-dot" />
                        <span className="w-1 h-1 rounded-full bg-[#0ea5e9] typing-dot" />
                        <span className="w-1 h-1 rounded-full bg-[#0ea5e9] typing-dot" />
                      </div>
                    )}
                    <p className={`text-xs font-mono truncate ${isActive ? 'text-[#0ea5e9]' : 'text-white/30'}`}>
                      {isActive ? agent.currentTask : agent.idleTask}
                    </p>
                  </div>
                </div>

                {/* Dynatrace MCP Tools */}
                <div className="mb-4">
                  <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <Wrench className="w-3 h-3 text-[#0ea5e9]" /> Registered MCP Tools
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {agent.tools.map((t) => (
                      <code key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-white/60">
                        {t}
                      </code>
                    ))}
                  </div>
                </div>

                {/* Agent Reasoning accordion */}
                <div className="border-t border-white/5 pt-3">
                  <button
                    onClick={() => toggleReasoning(agent.id)}
                    className="w-full flex items-center justify-between text-xs text-white/60 hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="font-semibold">Reasoning Steps</span>
                    {isCollapsedReason ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                  </button>
                  
                  <AnimatePresence>
                    {!isCollapsedReason && (
                      <motion.ol
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden list-decimal pl-4 space-y-1.5 mt-2.5 text-[10px] text-white/40"
                      >
                        {agent.reasoningSteps.map((step, sIdx) => (
                          <li key={sIdx} className="leading-normal">
                            {step}
                          </li>
                        ))}
                      </motion.ol>
                    )}
                  </AnimatePresence>
                </div>

              </div>

              {/* Stats Footer bar */}
              <div className="flex items-center justify-between mt-5 pt-3 border-t border-white/5 text-[11px]">
                <div>
                  <span className="text-white/40 font-semibold">Total Completed</span>
                  <p className="font-bold text-white">{agent.tasksCompleted}</p>
                </div>
                <div className="text-right">
                  <span className="text-white/40 font-semibold">Evaluated Accuracy</span>
                  <p className="font-bold text-success">{agent.accuracy}%</p>
                </div>
              </div>

            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
