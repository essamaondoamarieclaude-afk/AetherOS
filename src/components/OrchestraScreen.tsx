/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Terminal, 
  Cpu, 
  Zap, 
  Layers, 
  RefreshCw, 
  ShieldAlert, 
  Activity, 
  Play, 
  Network
} from 'lucide-react';
import { AgentLog, AgentMetric } from '../types';

interface OrchestraScreenProps {
  logs: AgentLog[];
  onAddLog: (log: AgentLog) => void;
}

export default function OrchestraScreen({ logs, onAddLog }: OrchestraScreenProps) {
  const [selectedAgent, setSelectedAgent] = useState<string>('core');
  const [activeAgentsCount, setActiveAgentsCount] = useState(24);
  const [gatewayThroughput, setGatewayThroughput] = useState(84);
  const [neuralLoad, setNeuralLoad] = useState(32);
  const [isSyncing, setIsSyncing] = useState(false);

  // Invoke manual AI diagnostic routing
  const handleInvokeAgent = () => {
    setIsSyncing(true);
    const id = String(Math.random());
    const logTimes = new Date().toLocaleTimeString('en-GB', { hour12: false });
    
    const newLog: AgentLog = {
      id,
      time: logTimes,
      agentName: 'AI Orchestrator',
      category: 'Manual Analysis',
      message: 'Running analysis on system topology and service dependencies...',
      type: 'thought'
    };

    onAddLog(newLog);

    setTimeout(() => {
      onAddLog({
        id: String(Math.random()),
        time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
        agentName: 'Root Cause Analyzer',
        category: 'Analysis',
        message: 'All systems operating normally. No issues detected.',
        type: 'success'
      });
      setIsSyncing(false);
    }, 1500);
  };

  // Agent profiles
  const agentDetails: Record<string, { role: string; latency: string; load: string; status: string; info: string }> = {
    core: {
      role: 'AI Orchestrator',
      latency: '2ms',
      load: '45%',
      status: 'Nominal',
      info: 'Coordinates all AI assistants to analyze system health and resolve issues automatically.'
    },
    root_cause: {
      role: 'Root Cause Analyzer',
      latency: '12ms',
      load: '28%',
      status: 'Active',
      info: 'Analyzes system data to find the underlying cause of performance issues and incidents.'
    },
    predictive: {
      role: 'Predictive Analyzer',
      latency: '15ms',
      load: '15%',
      status: 'Idle',
      info: 'Forecasts potential issues by analyzing trends in system metrics and usage patterns.'
    },
    security: {
      role: 'Security Monitor',
      latency: '5ms',
      load: '18%',
      status: 'Scanning',
      info: 'Monitors for security threats, verifies access controls, and protects against unauthorized activity.'
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left section: Visual Orchestration microservices tree */}
      <section className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        <div className="bg-[#131315]/70 backdrop-blur-3xl rounded-2xl p-6 border-t border-l border-white/10 shadow-2xl relative overflow-hidden">
          {/* Top light glow bar */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00eefc] to-transparent" />
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <span className="font-mono text-[9px] text-[#00dbe9] uppercase tracking-widest font-bold">Active AI Cluster</span>
              <h2 className="font-sans font-bold text-xl md:text-2xl text-white tracking-tight mt-1">AI Orchestration Core</h2>
            </div>
            <button
              onClick={handleInvokeAgent}
              disabled={isSyncing}
              className="bg-[#00eefc] hover:bg-[#00dbe9] disabled:bg-opacity-40 text-[#002022] font-mono text-xs font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer active:scale-95 flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Processing...' : 'Run Analysis'}
            </button>
          </div>

          {/* Interactive Agent vector map */}
          <div className="relative h-[320px] sm:h-[480px] w-full bg-black/40 rounded-xl border border-white/5 flex items-center justify-center overflow-hidden">
            {/* Connector lines visual map */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="#00eefc" strokeWidth="1.5" />
              <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="#00eefc" strokeWidth="1.5" />
              <line x1="50%" y1="50%" x2="50%" y2="78%" stroke="#a4c8ff" strokeWidth="1.5" />
              <line x1="25%" y1="25%" x2="75%" y2="25%" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
            </svg>

            {/* Root Cause agent */}
            <div 
              onClick={() => setSelectedAgent('root_cause')}
              className={`absolute top-[25%] left-[25%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer hover:scale-105 transition-all`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center relative ${
                selectedAgent === 'root_cause' ? 'bg-[#00eefc]/15 border-[#00eefc] shadow-[0_0_15px_#00eefc]' : 'bg-[#1f1f21]/80 border-white/10'
              } border`}>
                <Cpu className="text-[#00eefc] w-6 h-6 animate-pulse" />
                <span className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center text-[8px] font-bold text-white">✓</span>
              </div>
              <span className="font-mono text-[10px] text-white mt-3 font-semibold">Root Cause Analyzer</span>
              <span className="text-[9px] font-mono text-[#c7c6ca]/50 font-medium">12ms</span>
            </div>

            {/* Outage Predictor Agent */}
            <div 
              onClick={() => setSelectedAgent('predictive')}
              className={`absolute top-[25%] left-[75%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer hover:scale-105 transition-all`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center relative ${
                selectedAgent === 'predictive' ? 'bg-[#00eefc]/15 border-[#00eefc] shadow-[0_0_15px_#00eefc]' : 'bg-[#1f1f21]/80 border-white/10'
              } border`}>
                <Network className="text-[#00eefc] p-0.5 w-6 h-6" />
              </div>
              <span className="font-mono text-[10px] text-white mt-3">Predictive Analyzer</span>
              <span className="text-[9px] font-mono text-[#c7c6ca]/50 font-medium">Status: Idle</span>
            </div>

            {/* Security Compliance Sentinel */}
            <div 
              onClick={() => setSelectedAgent('security')}
              className={`absolute bottom-[18%] left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer hover:scale-105 transition-all`}
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center relative ${
                selectedAgent === 'security' ? 'bg-blue-500/15 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-[#1f1f21]/80 border-white/10'
              } border`}>
                <Layers className="text-blue-400 w-8 h-8 animate-pulse" />
              </div>
              <span className="font-mono text-[10px] text-white mt-3 font-bold uppercase tracking-wider">Security Monitor</span>
              <span className="text-[9px] font-mono text-blue-400 uppercase tracking-widest font-bold tracking-tight">Status: Scanning</span>
            </div>

            {/* Central Master Orchestrator logic */}
            <div 
              onClick={() => setSelectedAgent('core')}
              className="relative z-10 flex flex-col items-center cursor-pointer hover:scale-105 transition-all"
            >
              <div className={`w-32 h-32 rounded-full border bg-[#131315]/90 backdrop-blur-3xl flex items-center justify-center shadow-[0_0_50px_rgba(0,238,252,0.15)] ${
                selectedAgent === 'core' ? 'border-[#00eefc]' : 'border-white/15'
              }`}>
                <div className="w-24 h-24 rounded-full border border-[#00eefc]/10 animate-spin flex items-center justify-center" style={{ animationDuration: '10s' }}>
                  <div className="w-2 h-2 bg-[#00eefc] rounded-full absolute top-1" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Activity className="text-[#00eefc] w-10 h-10 animate-pulse" />
                </div>
              </div>
              <span className="font-sans font-semibold text-sm text-white mt-4 uppercase tracking-widest text-[#00dbe9]">
                AI Core
              </span>
            </div>
          </div>
        </div>

        {/* Workflow execution timeline */}
        <div className="bg-[#131315]/70 backdrop-blur-3xl rounded-2xl p-6 border-t border-l border-white/10 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="text-[#00eefc] w-5 h-5" />
            <h3 className="font-sans font-semibold text-white text-base">Workflow Timeline</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 group">
              <span className="font-mono text-xs text-[#c7c6ca]/40 w-20">14:22:01</span>
              <div className="w-2 h-2 rounded-full bg-[#00eefc] shadow-[0_0_8px_#00eefc]" />
              <div className="flex-1 h-[1px] bg-white/10" />
              <span className="text-xs font-mono text-[#c8c6c7] font-medium uppercase tracking-wider">Connecting to Monitoring Systems</span>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold">
                COMPLETE
              </span>
            </div>

            <div className="flex items-center gap-4 group">
              <span className="font-mono text-xs text-[#c7c6ca]/40 w-20">14:22:15</span>
              <div className="w-2 h-2 rounded-full bg-[#00eefc] animate-ping" />
              <div className="flex-1 h-[1px] bg-white/10" />
              <span className="text-xs font-mono text-[#c8c6c7] font-medium uppercase tracking-wider">Running Security Analysis</span>
              <span className="bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold animate-pulse">
                PROCESSING
              </span>
            </div>

            <div className="flex items-center gap-4 group opacity-40">
              <span className="font-mono text-xs text-[#c7c6ca]/40 w-20">14:23:00</span>
              <div className="w-2 h-2 rounded-full bg-[#c7c6ca]/20" />
              <div className="flex-1 h-[1px] bg-white/10" />
              <span className="text-xs font-mono text-[#c8c6c7] uppercase">Completing Analysis</span>
              <span className="border border-white/15 text-[9px] font-mono px-2 py-0.5 rounded uppercase">
                PENDING
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Right side widgets: Reasoning Stream Terminal & Task stats */}
      <aside className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        
        {/* Selected agent detail card */}
        <div className="bg-[#131315]/70 backdrop-blur-3xl rounded-2xl p-6 border-t border-l border-white/10 shadow-2xl">
          <div className="flex items-center gap-3.5 mb-4 pb-4 border-b border-white/5">
            <Cpu className="text-[#00eefc] w-6 h-6 animate-pulse" />
            <div>
              <h4 className="font-sans font-bold text-white text-sm uppercase leading-none tracking-tight">Agent Details</h4>
              <span className="font-mono text-[9px] text-[#00dbe9] uppercase tracking-wider">Current Status</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white/[0.01] rounded-xl border border-white/5">
                <span className="text-[#c7c6ca]/50 font-mono text-[9px] uppercase tracking-wider block">Agent Name</span>
                <span className="font-mono text-xs text-white font-semibold uppercase">{selectedAgent.replace('_', ' ')}</span>
              </div>
              <div className="p-3 bg-white/[0.01] rounded-xl border border-white/5">
                <span className="text-[#c7c6ca]/50 font-mono text-[9px] uppercase tracking-wider block">Function</span>
                <span className="font-mono text-xs text-[#00eefc] font-semibold">{agentDetails[selectedAgent]?.role || 'Specialist Agent'}</span>
              </div>
            </div>

            <p className="font-sans text-xs text-[#c7c6ca] leading-relaxed">
              {agentDetails[selectedAgent]?.info || 'Analyzes metrics telemetry streams.'}
            </p>

            <div className="border-t border-white/5 pt-4 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#c7c6ca]/50">Response Time</span>
                <span className="text-white font-semibold">{agentDetails[selectedAgent]?.latency || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#c7c6ca]/50">Processing Load</span>
                <span className="text-[#00dbe9] font-semibold">{agentDetails[selectedAgent]?.load || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Task routing load indicators */}
        <div className="bg-[#131315]/70 backdrop-blur-3xl rounded-2xl p-6 border-t border-l border-white/10 shadow-2xl flex-1">
          <h3 className="font-sans font-semibold text-white text-base mb-6 uppercase tracking-wider">System Load</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-[#c7c6ca]/70 uppercase font-bold tracking-wider">Gateway Throughput</span>
                <span className="text-[#00eefc] font-semibold">84%</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#00eefc] h-full w-[84%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-[#c7c6ca]/70 uppercase font-bold tracking-wider">Processing Load</span>
                <span className="text-blue-400 font-semibold">32%</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-400 h-full w-[32%]" />
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/5 pt-6 grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#0e0e10] rounded-xl border border-white/5">
              <span className="font-mono text-[9px] text-[#c7c6ca]/40 block uppercase">Requests/Sec</span>
              <span className="font-mono text-xl text-white font-bold tracking-wider">1.2M</span>
            </div>
            <div className="p-4 bg-[#0e0e10] rounded-xl border border-white/5">
              <span className="font-mono text-[9px] text-[#c7c6ca]/40 block uppercase">Active Agents</span>
              <span className="font-mono text-xl text-[#00eefc] font-bold">24</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
