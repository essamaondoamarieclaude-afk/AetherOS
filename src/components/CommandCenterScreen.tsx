/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Activity as ActivityIcon, 
  Send as SendIcon, 
  RefreshCw as RefreshIcon, 
  AlertTriangle,
  Zap,
  Terminal,
  Cpu,
  Layers,
  Compass
} from 'lucide-react';
import { Incident, AgentLog } from '../types';

interface CommandCenterScreenProps {
  incidents: Incident[];
  onSelectIncident: (id: string) => void;
  onScaleUp: () => void;
  logs: AgentLog[];
  onAddLog: (log: AgentLog) => void;
  onNavigateTo: (screenName: any) => void;
  isScalingUp: boolean;
}

export default function CommandCenterScreen({
  incidents,
  onSelectIncident,
  onScaleUp,
  logs,
  onAddLog,
  onNavigateTo,
  isScalingUp
}: CommandCenterScreenProps) {
  const [geminiQuery, setGeminiQuery] = useState('');
  const [chatAnswer, setChatAnswer] = useState<string | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);

  // Handle server-side Gemini SRE Query
  const handleGeminiQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!geminiQuery.trim()) return;

    setIsQuerying(true);
    setChatAnswer(null);

    try {
      const response = await fetch('/api/gemini/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: geminiQuery,
          currentScreen: 'Command Center',
          systemMetrics: {
            healthScore: 98.4,
            activeIncidents: incidents.filter(i => i.status !== 'resolved').length
          }
        })
      });

      const data = await response.json();
      if (data.success) {
        setChatAnswer(data.text);
      } else {
        setChatAnswer("Unable to get a response from the AI service. Please check your API configuration.");
      }
    } catch (err) {
      setChatAnswer("An error occurred processing your request. Using local analysis mode.");
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Bento grid panels */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* State / Health Panel */}
        <section className="md:col-span-4 lg:col-span-3 bg-[#131315]/70 backdrop-blur-3xl rounded-2xl p-6 border-t border-l border-white/10 shadow-2xl flex flex-col justify-between min-h-[220px]">
          <div className="flex justify-between items-start">
            <h3 className="font-sans text-sm font-medium text-[#c7c6ca] uppercase tracking-wider flex items-center gap-2">
              <ActivityIcon className="text-[#00dbe9] w-4 h-4" />
              System Health
            </h3>
            <span className="font-mono text-[10px] text-[#00dbe9] bg-[#00eefc]/10 px-2 py-0.5 rounded font-bold uppercase">
              Stable
            </span>
          </div>

          <div className="py-4">
            <span className="font-sans text-5xl md:text-6xl lg:text-7xl font-bold text-[#e4e2e4] block tracking-tighter">
              98.4<span className="text-2xl text-[#00dbe9] font-semibold">%</span>
            </span>
            <p className="font-mono text-xs text-[#c7c6ca]/60 mt-1 uppercase tracking-wider">
              Overall System Health
            </p>
          </div>

          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#00eefc] h-full w-[98.4%]" />
          </div>
        </section>

        {/* Global Topology Panel */}
        <section className="md:col-span-8 lg:col-span-6 bg-[#131315]/40 rounded-2xl border border-white/10 overflow-hidden relative group min-h-[220px] shadow-2xl">
          {/* Animated node blueprint background */}
          <div className="absolute inset-0 z-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBKkbYhoHeketijJWpgUZH58jK3e16cFElfdnUN5TDFnhX2zRp5r5J1mfb5q_vrkbJr2Wo4T6kE2K1zYU1_0zprXY8r9I4BrXv7KyiDwSNi4UoL_hdOikCe4eJyjcfBKlO2UQqcNp4tjJquvja1IJSuFLaxjcXA_1lkQ7H66OB--HcUVYjiIKff6cGkDo34kEfroaFDV6Gqdi3DUT9mLA5Z0G2Qd7gWYrOIYBxasO1LgH0zNmsUMUMUiCxuzB8i6p-6m7h1Cs0L8Y5F')` }} />
          
          <div className="relative z-10 p-6 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-sans font-semibold text-[#e4e2e4] text-lg">Service Topology</h3>
                <p className="font-mono text-[10px] text-[#c7c6ca]/70 tracking-wider">Traffic Overview</p>
              </div>
              <button 
                onClick={() => onNavigateTo('galaxy')} 
                className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center hover:bg-white/[0.1] active:scale-95 transition-all cursor-pointer"
                title="Open System Map"
              >
                <Compass className="text-[#00eefc] w-4.5 h-4.5" />
              </button>
            </div>

            <div className="flex gap-4 items-end mt-4">
              <div className="flex-1 bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/5">
                <p className="font-mono text-[9px] text-[#c7c6ca]/50 uppercase tracking-widest">Incoming Traffic</p>
                <p className="font-sans font-bold text-[#e4e2e4] text-xl mt-1">42.8 GB/s</p>
              </div>
              <div className="flex-1 bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/5">
                <p className="font-mono text-[9px] text-[#c7c6ca]/50 uppercase tracking-widest">Average Latency</p>
                <p className="font-sans font-bold text-[#00dbe9] text-xl mt-1">12ms</p>
              </div>
            </div>
          </div>
        </section>

        {/* Predictive Agent Trigger */}
        <section className="md:col-span-12 lg:col-span-3 bg-[#131315]/70 backdrop-blur-3xl rounded-2xl p-6 border-l-2 border-[#00dbe9] shadow-2xl flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="text-[#00eefc] w-5 h-5 animate-pulse" />
            <h3 className="font-sans font-semibold text-[#e4e2e4] text-sm uppercase tracking-wider">AI Risk Analysis</h3>
          </div>

          <div className="pb-4">
            <div className="p-3.5 bg-white/[0.03] border border-white/10 rounded-xl">
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-mono text-[9px] text-[#00dbe9] uppercase tracking-widest font-bold">Prediction</span>
                <span className="font-mono text-[9px] text-[#c7c6ca]/50 uppercase font-bold">ETA: 12m</span>
              </div>
              <p className="font-sans text-xs text-[#c7c6ca] leading-relaxed">
                The database connection pool is likely to <span className="text-[#00dbe9] font-semibold">run out of capacity</span> within 12 minutes.
              </p>
            </div>
          </div>

          <button
            onClick={onScaleUp}
            disabled={isScalingUp}
            className={`w-full py-3 ${isScalingUp ? 'bg-[#00eefc]/40 cursor-not-allowed' : 'bg-[#00eefc] hover:bg-[#00dbe9] active:scale-95'} text-[#002022] font-mono text-xs font-bold uppercase rounded-xl transition-all cursor-pointer shadow-[0_4px_15px_rgba(0,238,252,0.15)]`}
          >
            {isScalingUp ? 'Scaling Resources (15)...' : 'Scale Up Resources'}
          </button>
        </section>
      </div>

      {/* Main split: AI live reasoning log stream AND active incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Live Swarm feed */}
        <section className="lg:col-span-8 bg-[#131315]/70 backdrop-blur-3xl rounded-2xl p-6 border-t border-l border-white/10 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-sans font-semibold text-[#e4e2e4] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00dbe9] animate-pulse shadow-[0_0_8px_#00eefc]" />
              AI Activity Stream
            </h3>
            <span className="font-mono text-[10px] text-[#c7c6ca]/60 uppercase tracking-wider font-semibold">
              Live updates
            </span>
          </div>

          <div className="space-y-3 h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {logs.map((log) => (
              <div 
                key={log.id} 
                className="p-4 bg-white/[0.02] border-l-2 border-white/10 hover:border-[#00eefc]/50 rounded-r-xl transition-all"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-[10px] text-[#00dbe9] uppercase tracking-wider font-bold">
                    {log.agentName} / {log.category}
                  </span>
                  <span className="font-mono text-[10px] text-[#c7c6ca]/40">
                    {log.time}
                  </span>
                </div>
                <p className="font-mono text-xs text-[#c8c6c7] leading-relaxed">
                  {log.message}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Incidents stream panel */}
        <section className="lg:col-span-4 bg-[#131315]/70 backdrop-blur-3xl rounded-2xl p-6 border-t border-l border-white/10 shadow-2xl">
          <h3 className="font-sans font-semibold text-[#e4e2e4] mb-6 flex items-center gap-2">
            <AlertTriangle className="text-red-400 w-5 h-5" />
            Active Alerts
          </h3>

          <div className="space-y-4">
            {incidents.map((incident) => (
              <div
                key={incident.id}
                onClick={() => onSelectIncident(incident.id)}
                className={`p-4 bg-white/[0.02] border-l-4 ${
                  incident.severity === 'critical' ? 'border-red-500' : 'border-amber-500'
                } rounded-r-xl relative overflow-hidden group cursor-pointer hover:bg-white/[0.05] transition-all`}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className={`font-mono text-[9px] font-bold uppercase ${
                    incident.severity === 'critical' ? 'text-red-400' : 'text-amber-400'
                  }`}>
                    {incident.severity.toUpperCase()} • AI Analysis
                  </span>
                  <span className="font-mono text-[10px] text-[#c7c6ca]/40 group-hover:text-white transition-colors uppercase">
                    View Details
                  </span>
                </div>
                <h4 className="font-sans font-semibold text-[#e4e2e4] mb-1 group-hover:text-[#00eefc] transition-colors">
                  {incident.title}
                </h4>
                <p className="font-mono text-xs text-[#c7c6ca]/70 line-clamp-2 leading-relaxed">
                  {incident.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Full-stack AI SRE Terminal search bar */}
      <section className="bg-[#131315]/70 backdrop-blur-3xl rounded-2xl p-6 border-t border-l border border-white/10 shadow-2xl">
        <form onSubmit={handleGeminiQuery} className="flex flex-col gap-4">
          <div className="relative">
            <Terminal className="text-[#00eefc] absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              value={geminiQuery}
              onChange={(e) => setGeminiQuery(e.target.value)}
              placeholder="Ask about active issues, system health, or what to do next..."
              className="w-full bg-white/[0.03] border border-white/10 hover:border-[#00eefc]/30 focus:border-[#00eefc] focus:outline-none focus:ring-0 text-[#e4e2e4] font-mono text-xs pl-12 pr-12 py-4 rounded-xl transition-all"
            />
            <button
              type="submit"
              disabled={isQuerying}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#00eefc]/15 text-[#00eefc] border border-[#00eefc]/30 flex items-center justify-center rounded-lg hover:bg-[#00eefc] hover:text-[#00363a] transition-all cursor-pointer"
            >
              <SendIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Prompt Answer Output Panel */}
          {(isQuerying || chatAnswer) && (
            <div className="p-5 bg-black/40 rounded-xl border border-white/5 animate-fade-in relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00eefc] to-transparent animate-pulse" />
              
              <div className="flex gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#00eefc]/15 border border-[#00eefc]/30 flex items-center justify-center flex-shrink-0">
                  <Zap className="text-[#00eefc] w-4.5 h-4.5 animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-mono text-xs text-[#00dbe9] tracking-wider uppercase font-bold">
                      AI Analysis Summary
                    </p>
                    <span className="font-mono text-[9px] text-[#c7c6ca]/40">
                      Response Time: 42ms
                    </span>
                  </div>
                  
                  {isQuerying ? (
                    <div className="flex items-center gap-2 py-2">
                      <span className="w-1.5 h-1.5 bg-[#00eefc] rounded-full animate-ping" />
                      <p className="font-mono text-xs text-[#c7c6ca] italic">
                        Analyzing system data and preparing response...
                      </p>
                    </div>
                  ) : (
                    <p className="font-mono text-xs text-[#c8c6c7] leading-relaxed whitespace-pre-line">
                      {chatAnswer}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </form>
      </section>
    </div>
  );
}
