/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Zap, 
  AlertTriangle, 
  Activity, 
  Layers, 
  Flame, 
  Terminal, 
  Cpu, 
  Play, 
  ShieldAlert, 
  X,
  CheckCircle2,
  Lock,
  RefreshCw
} from 'lucide-react';
import { Incident } from '../types';

interface IncidentsScreenProps {
  incidents: Incident[];
  selectedIncidentId: string;
  onSelectIncident: (id: string) => void;
  onRemediate: (incidentId: string, actionName: string) => void;
}

export default function IncidentsScreen({
  incidents,
  selectedIncidentId,
  onSelectIncident,
  onRemediate
}: IncidentsScreenProps) {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [actionLog, setActionLog] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [selectedGraphNode, setSelectedGraphNode] = useState<string | null>('root');

  const selectedIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];

  const handleActionClick = (actionName: string, doconfidence: number) => {
    setActiveAction(actionName);
    setIsExecuting(true);
    setActionLog([`[INFO] Loading remediation plan for: ${actionName}`]);

    setTimeout(() => {
      setActionLog(prev => [...prev, `[INIT] Verifying system permissions...`]);
    }, 450);

    setTimeout(() => {
      setActionLog(prev => [...prev, `[TRANSIT] Applying configuration changes...`]);
    }, 900);

    setTimeout(() => {
      setActionLog(prev => [
        ...prev, 
        `[SUCCESS] Fix applied with ${doconfidence}% confidence.`,
        `[HEALED] System has stabilized. Monitoring for recurrence.`
      ]);
      setIsExecuting(false);
      onRemediate(selectedIncident.id, actionName);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Top Selector Banner */}
      <section className="bg-[#131315]/40 p-6 rounded-2xl border border-white/5 backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shadow-2xl">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="bg-red-500/10 text-red-400 px-2.5 py-1 rounded-full font-mono text-[9px] font-bold tracking-widest uppercase border border-red-500/20">
              CRITICAL INCIDENT
            </span>
            <span className="text-[#c7c6ca]/50 font-mono text-xs">ID: {selectedIncident.id}</span>
          </div>
          <h2 className="font-sans font-bold text-2xl md:text-3xl text-white tracking-tight flex items-center gap-4">
            Incident Overview: <span className="text-[#00eefc]">{selectedIncident.title}</span>
          </h2>
        </div>

        {/* Quick select dropdown */}
        <div className="flex items-center gap-4">
          <label className="font-mono text-xs text-[#c7c6ca]/60 uppercase tracking-wider">Current Incident:</label>
          <select 
            value={selectedIncident.id}
            onChange={(e) => onSelectIncident(e.target.value)}
            className="bg-[#1f1f21] border border-white/10 rounded-xl px-4 py-2 text-xs font-mono text-[#e4e2e4] focus:border-[#00eefc] focus:outline-none"
          >
            {incidents.map(i => (
              <option key={i.id} value={i.id}>{i.service} - {i.title.substring(0, 20)}...</option>
            ))}
          </select>
        </div>
      </section>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Severity score column */}
        <div className="col-span-12 md:col-span-3 space-y-6">
          <div className="bg-[#131315]/70 backdrop-blur-3xl p-6 rounded-2xl border-t border-l border-white/10 shadow-2xl relative overflow-hidden flex flex-col items-center">
            {/* Specular scanning indicator */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent animate-pulse" />
            
            <div className="w-full flex justify-between items-center mb-6">
              <h3 className="font-sans text-xs font-semibold text-[#c7c6ca]/70 uppercase tracking-widest">
                Incident Severity
              </h3>
              <Flame className="text-red-500 w-5 h-5 animate-bounce" />
            </div>

            <div className="relative w-36 h-36 flex items-center justify-center mb-4">
              {/* Glowing ring */}
              <svg className="w-full h-full -rotate-90">
                <circle className="text-white/5" cx="72" cy="72" fill="transparent" r="64" stroke="currentColor" strokeWidth="2" />
                <circle className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" cx="72" cy="72" fill="transparent" r="64" stroke="currentColor" strokeDasharray="402" strokeDashoffset="20" strokeWidth="5" />
              </svg>
              <span className="absolute font-sans font-bold text-5xl text-white tracking-widest">9.8</span>
            </div>

            <p className="font-mono text-[10px] text-red-400 font-bold tracking-widest uppercase mb-6">
              CRITICAL - AFFECTING MULTIPLE SERVICES
            </p>

            <div className="w-full space-y-4">
              <div className="flex justify-between items-center bg-white/[0.01] p-2 rounded-lg border border-white/5">
                <span className="text-[#c7c6ca]/70 text-xs font-mono uppercase">Customer Impact</span>
                <span className="font-mono text-xs text-[#00eefc] font-bold">{selectedIncident.userImpact}</span>
              </div>
              <div className="flex justify-between items-center bg-white/[0.01] p-2 rounded-lg border border-white/5">
                <span className="text-[#c7c6ca]/70 text-xs font-mono uppercase">Data Integrity</span>
                <span className="font-mono text-xs text-emerald-400 font-bold">{selectedIncident.dataIntegrity}</span>
              </div>
              <div className="flex justify-between items-center bg-white/[0.01] p-2 rounded-lg border border-white/5">
                <span className="text-[#c7c6ca]/70 text-xs font-mono uppercase">Service Uptime</span>
                <span className="font-mono text-xs text-red-400 font-bold">{selectedIncident.uptimeImpact}</span>
              </div>
            </div>
          </div>

          {/* Real-time Stream */}
          <div className="bg-[#131315]/70 backdrop-blur-3xl p-6 rounded-2xl border-t border-l border-white/10 shadow-2xl">
            <h3 className="font-sans text-xs font-semibold text-[#c7c6ca]/70 uppercase tracking-widest mb-6 block">
              Live Events
            </h3>

            <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
              <div className="relative pl-8">
                <span className="absolute left-[7px] top-[5px] w-2.5 h-2.5 rounded-full bg-red-400 shadow-[0_0_8px_rgb(248,113,113)]" />
                <p className="font-mono text-[10px] text-[#c7c6ca]/40">14:02:31.42</p>
                <p className="font-sans text-xs text-[#e4e2e4] mt-0.5">Error rate spike detected</p>
              </div>
              <div className="relative pl-8">
                <span className="absolute left-[7px] top-[5px] w-2.5 h-2.5 rounded-full bg-[#00eefc] shadow-[0_0_8px_#00eefc]" />
                <p className="font-mono text-[10px] text-[#c7c6ca]/40">14:02:44.11</p>
                <p className="font-sans text-xs text-[#e4e2e4] mt-0.5">{selectedIncident.service} state: OOMKilled</p>
              </div>
              <div className="relative pl-8 opacity-40">
                <span className="absolute left-[7px] top-[5px] w-2.5 h-2.5 rounded-full bg-white/20" />
                <p className="font-mono text-[10px] text-[#c7c6ca]/40">14:02:45.00</p>
                <p className="font-sans text-xs text-[#c7c6ca] mt-0.5">Restarting affected services...</p>
              </div>
            </div>
          </div>
        </div>

        {/* Service Dependency Map */}
        <div className="col-span-12 md:col-span-6">
          <div className="bg-[#131315]/70 backdrop-blur-3xl p-6 rounded-2xl border-t border-l border-white/10 shadow-2xl h-full flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-sans text-xs font-semibold text-[#c7c6ca]/70 uppercase tracking-widest">
                Service Dependency Map
              </h3>
              <div className="flex gap-2">
                <button className="bg-white/5 py-1 px-3 border border-white/10 rounded font-mono text-[9px] text-[#c7c6ca] hover:bg-white/10 transition-colors cursor-pointer">
                  Identify Root Cause
                </button>
              </div>
            </div>

            {/* Simulated topology vector graph */}
            <div className="relative h-[280px] sm:h-[380px] bg-black/3 w-full rounded-xl border border-white/5 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(ellipse at center, rgba(0, 238, 252, 0.02) 0%, transparent 80%)' }} />

              {/* Linking SVG paths dynamically */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                <path d="M 120 70 Q 240 100 240 190" fill="none" stroke="#00eefc" strokeWidth="1.5" />
                <path d="M 370 70 Q 240 100 240 190" fill="none" stroke="#00eefc" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M 240 190 L 240 310" fill="none" stroke="red" strokeWidth="1.5" />
              </svg>

              {/* Node A: Load Balancer */}
              <div 
                onClick={() => setSelectedGraphNode('lb')}
                className={`absolute top-10 left-[20%] p-3.5 rounded-xl border cursor-pointer hover:scale-105 transition-all ${
                  selectedGraphNode === 'lb' ? 'bg-[#1f1f21] border-[#00eefc]' : 'bg-[#131113]/50 border-white/10'
                }`}
              >
                <div className="font-mono text-[9px] text-[#00dbe9] tracking-wider uppercase font-bold">LOAD BALANCER</div>
                <div className="mt-1 w-16 h-1 bg-emerald-400 rounded-full" />
              </div>

              {/* Node B: Cache */}
              <div 
                onClick={() => setSelectedGraphNode('cache')}
                className={`absolute top-10 right-[20%] p-3.5 rounded-xl border cursor-pointer hover:scale-105 transition-all ${
                  selectedGraphNode === 'cache' ? 'bg-[#1f1f21] border-[#00eefc]' : 'bg-[#131113]/50 border-white/10 opacity-50'
                }`}
              >
                <div className="font-mono text-[9px] text-[#c7c6ca] tracking-wider uppercase">REDIS CACHE</div>
                <div className="mt-1 w-16 h-1 bg-emerald-400 rounded-full" />
              </div>

              {/* Node C: Root Failure Auth (Big central element) */}
              <div 
                onClick={() => setSelectedGraphNode('root')}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-full flex flex-col items-center justify-center text-center cursor-pointer hover:scale-105 transition-all w-44 h-44 ${
                  selectedGraphNode === 'root' ? 'bg-red-950/20 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.25)]' : 'bg-red-950/5 border-red-500/40'
                } border`}
              >
                <ShieldAlert className="text-red-500 w-8 h-8 mb-1.5 animate-pulse" />
                <p className="font-mono text-red-500 font-bold text-xs uppercase tracking-wider">{selectedIncident.service}</p>
                  <span className="font-mono text-[8.5px] text-[#c7c6ca]/60 uppercase mt-0.5 tracking-widest font-bold">
                    Primary Service Issue
                  </span>
              </div>

              {/* Node D: Dependencies Postgres Master */}
              <div 
                onClick={() => setSelectedGraphNode('db')}
                className={`absolute bottom-8 left-[35%] -translate-x-1/2 p-3.5 rounded-xl border cursor-pointer hover:scale-105 transition-all ${
                  selectedGraphNode === 'db' ? 'bg-[#1f1f21] border-[#00eefc]' : 'bg-[#131113]/50 border-white/10'
                }`}
              >
                <div className="font-mono text-[9px] text-[#c7c6ca] tracking-wider uppercase font-medium">POSTGRES DATABASE</div>
                <div className="mt-1 w-16 h-1 bg-red-400 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Selected Node Explanatory insights widget */}
            <div className="mt-4 p-4 bg-red-950/10 border border-red-500/20 rounded-xl">
              <div className="flex items-center gap-3">
                <Terminal className="text-red-400 w-5 h-5 flex-shrink-0" />
                <p className="font-mono text-xs text-[#c7c6ca]/90 leading-relaxed">
                  <span className="text-red-400 font-bold">AI ANALYSIS:</span> The authentication service is slowing down because the database is overloaded and cannot process requests quickly enough.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Actionable Remediation Column */}
        <div className="col-span-12 md:col-span-3 space-y-6">
          <div className="bg-[#131315]/70 backdrop-blur-3xl p-6 rounded-2xl border border-blue-500/10 shadow-2xl relative overflow-hidden">
            {/* Cognitive Blue status bulb */}
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500/10 rounded-full blur-sm" />
            <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgb(96,165,250)] absolute top-4 right-4" />

            <h3 className="font-sans text-xs font-semibold text-blue-300 uppercase tracking-widest mb-6">
              AI Remediation Plan
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 hover:border-blue-500/20 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-sans font-semibold text-white text-xs leading-none">Scale Application Pods</p>
                  <span className="bg-blue-500/15 text-blue-300 px-2 py-0.5 rounded text-[8.5px] font-mono font-bold tracking-wider">
                    92% Confidence
                  </span>
                </div>
                <p className="font-mono text-[10.5px] text-[#c7c6ca]/70 leading-relaxed mb-3">
                  Add more application instances to handle the increased authentication request volume.
                </p>
                <button
                  onClick={() => handleActionClick('Pod Escalation [HPA]', 92)}
                  disabled={isExecuting}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/40 text-white font-mono text-[10px] font-bold uppercase rounded-lg cursor-pointer transition-all active:scale-95"
                >
                  {isExecuting && activeAction === 'Pod Escalation [HPA]' ? 'Executing...' : 'Apply Fix'}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 hover:border-blue-500/20 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-sans font-semibold text-white text-xs leading-none">Clear Database Connections</p>
                  <span className="bg-[#00eefc]/15 text-[#00eefc] px-2 py-0.5 rounded text-[8.5px] font-mono font-bold tracking-wider">
                    78% Confidence
                  </span>
                </div>
                <p className="font-mono text-[10.5px] text-[#c7c6ca]/70 leading-relaxed mb-3">
                  Clear waiting database queries to free up connections and restore normal operation.
                </p>
                <button
                  onClick={() => handleActionClick('Postgres Lock Flush', 78)}
                  disabled={isExecuting}
                  className="w-full py-2 border border-[#00eefc] text-[#00eefc] hover:bg-[#00eefc]/10 disabled:opacity-40 text-mono text-[10px] font-bold uppercase rounded-lg cursor-pointer transition-all active:scale-95"
                >
                  {isExecuting && activeAction === 'Postgres Lock Flush' ? 'Executing...' : 'Apply Fix'}
                </button>
              </div>
            </div>
          </div>

          {/* SRE automation execution logs */}
          {actionLog.length > 0 && (
            <div className="bg-[#0e0e10] p-4 rounded-xl border border-white/5 font-mono text-[10px] space-y-1.5 shadow-xl max-h-[160px] overflow-y-auto">
              <div className="flex justify-between items-center text-[#c7c6ca]/40 uppercase tracking-widest text-[9px] border-b border-white/5 pb-1 mb-2">
                <span>Execution Logs</span>
                {isExecuting ? <RefreshCw className="animate-spin w-2.5 h-2.5" /> : <span className="text-emerald-400">Stable</span>}
              </div>
              {actionLog.map((log, lidx) => (
                <div key={lidx} className={`${log.startsWith('[SUCCESS]') || log.startsWith('[HEALED]') ? 'text-emerald-400 font-semibold' : 'text-[#c7c6ca]/80'}`}>
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Gemini Recommendation Insights Dialog */}
      <div className="bg-[#131315]/80 backdrop-blur-3xl border border-blue-500/30 p-6 rounded-2xl max-w-xl shadow-[0_0_35px_rgba(59,130,246,0.15)] relative">
        <div className="flex items-center gap-3.5 mb-3">
          <div className="bg-blue-600 p-2 rounded-xl border border-blue-400/20 shadow-[0_0_8px_rgba(59,130,246,0.5)]">
            <Zap className="text-white w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-sans font-bold text-sm text-white uppercase leading-none">AI Analysis</h4>
            <span className="font-mono text-[9px] text-[#00eefc] uppercase tracking-wider font-bold">
              Root Cause Analysis Engine
            </span>
          </div>
        </div>

        <p className="font-mono text-xs text-[#c7c6ca] leading-relaxed">
          The <span className="text-[#00eefc]">{selectedIncident.service}</span> service is using too much memory, which is causing slowdowns. The database connections are also getting exhausted because too many requests are coming in at once. We recommend adding more server capacity to handle the load.
        </p>

        <div className="mt-4 pt-3.5 border-t border-white/5 flex flex-wrap gap-4 font-mono text-[10px] text-[#c7c6ca]/50 uppercase tracking-wider">
          <span>Analysis Time: 42ms</span>
          <span>Metrics Analyzed: 124 data points</span>
        </div>
      </div>
    </div>
  );
}
