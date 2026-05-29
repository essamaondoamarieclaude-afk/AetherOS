/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  HelpCircle, 
  Layers, 
  Cpu, 
  Activity, 
  Terminal, 
  AlertTriangle, 
  Play,
  RotateCcw,
  Sliders,
  Sparkles
} from 'lucide-react';
import { NodeMetrics } from '../types';

interface GalaxyScreenProps {
  onAddLog: (log: any) => void;
}

export default function GalaxyScreen({ onAddLog }: GalaxyScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedTier, setSelectedTier] = useState<'all' | 'edge' | 'core' | 'neural'>('all');
  const [timeOffset, setTimeOffset] = useState<number>(100); // 100 representing LIVE
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('alpha-09');
  
  // Diagnostics UI state
  const [runningDiagnostics, setRunningDiagnostics] = useState(false);
  const [diagnosticsData, setDiagnosticsData] = useState<{
    analysis: string;
    confidence: number;
    steps: string[];
  } | null>(null);

  // Hardcode 6 system nodes
  const nodes: NodeMetrics[] = [
    { id: 'alpha-01', name: 'US-EAST-1 Core', type: 'core', status: 'stable', traffic: '6.4 GB/s', latency: '4ms', cpu: 42, memory: 55, x: 200, y: 150 },
    { id: 'alpha-09', name: 'US-EAST-1 Edge', type: 'edge', status: 'stable', traffic: '4.2k requests/sec', latency: '12ms', cpu: 31, memory: 40, x: 500, y: 180 },
    { id: 'beta-02', name: 'EU-FRANKFURT', type: 'edge', status: 'degraded', traffic: '1.2 GB/s', latency: '148ms', cpu: 94, memory: 98, x: 300, y: 320 },
    { id: 'gamma-03', name: 'EU-MUNICH Core', type: 'core', status: 'stable', traffic: '18.9 GB/s', latency: '8ms', cpu: 65, memory: 72, x: 650, y: 300 },
    { id: 'neural-04', name: 'AI-Processor-A', type: 'neural', status: 'stable', traffic: '72k cycles/s', latency: '2ms', cpu: 22, memory: 48, x: 420, y: 100 },
    { id: 'neural-05', name: 'AI-Processor-B', type: 'neural', status: 'stable', traffic: '60k cycles/s', latency: '3ms', cpu: 18, memory: 35, x: 180, y: 280 }
  ];

  const filteredNodes = nodes.filter(n => selectedTier === 'all' || n.type === selectedTier);
  const selectedNodeObj = nodes.find(n => n.id === selectedNodeId) || nodes[1];

  // Canvas Galaxy Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Stars particles background
    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5,
      speed: Math.random() * 0.1 + 0.05
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Black Void space radial background
      const baseGradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        20,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      baseGradient.addColorStop(0, '#101014');
      baseGradient.addColorStop(1, '#060609');
      ctx.fillStyle = baseGradient;
      ctx.fillRect(0, 0, width, height);

      // Render drifting space dust
      stars.forEach(s => {
        ctx.fillStyle = 'rgba(125, 244, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();

        s.y -= s.speed;
        if (s.y < 0) s.y = height;
      });

      // Draw faint connections linking filtered nodes
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(0, 238, 252, 0.06)';
      filteredNodes.forEach((node, nidx) => {
        for (let j = nidx + 1; j < filteredNodes.length; j++) {
          const targetNode = filteredNodes[j];
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          ctx.stroke();
        }
      });

      // Highlight selected tier connections with glow
      filteredNodes.forEach(node => {
        ctx.beginPath();
        const rad = node.status === 'degraded' ? 12 : 8;
        ctx.arc(node.x, node.y, rad, 0, Math.PI * 2);
        
        if (node.status === 'degraded') {
          // Pulse the degraded anomaly node (Frankfurt-02)
          const pulse = 1 + Math.sin(Date.now() / 200) * 0.15;
          ctx.fillStyle = `rgba(239, 68, 68, ${0.4 * pulse})`;
          ctx.beginPath();
          ctx.arc(node.x, node.y, rad * 1.5 * pulse, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
          ctx.beginPath();
          ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#00eefc';
          ctx.fill();
        }

        // Draw thin surrounding circle
        ctx.strokeStyle = node.id === selectedNodeId ? 'white' : 'rgba(0, 238, 252, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(node.x, node.y, rad + 4, 0, Math.PI * 2);
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [filteredNodes, selectedNodeId]);

  // Call Server-side Diagnostics via Gemini API
  const handleTriggerDiagnostics = async (nodeName: string, sector: string) => {
    setRunningDiagnostics(true);
    setDiagnosticsData(null);

    try {
      const response = await fetch('/api/gemini/diagnostics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodeName, sector })
      });

      const resData = await response.json();
      if (resData.success) {
        setDiagnosticsData(resData.data);
        onAddLog({
          id: String(Math.random()),
          time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
          agentName: 'System Analyzer',
          category: 'Node Analysis',
          message: `Analysis complete for ${nodeName}: root cause identified.`,
          type: 'success'
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRunningDiagnostics(false);
    }
  };

  // Adjust metrics based on time-travel offset values
  const simulatedTimeLabel = timeOffset === 100 ? 'LIVE' : `-${Math.round((100 - timeOffset) * 0.24)} Hours Offset`;
  const dynamicLoadValue = Math.min(100, Math.max(10, Math.round(84.2 * (timeOffset / 100))));

  return (
    <div className="relative min-h-[85vh] w-full">
      {/* Canvas: constrained height on mobile, absolute full on desktop */}
      <div className="h-[300px] lg:absolute lg:inset-0 lg:h-full z-0 rounded-2xl overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Content: flex-col stack on mobile, absolute overlay on desktop */}
      <div className="flex flex-col gap-6 mt-6 lg:mt-0 lg:static lg:block lg:absolute lg:inset-0">
        {/* Floating HUD: Tier select filters and Time travel slider */}
        <div className="lg:absolute lg:top-6 lg:left-6 flex flex-col gap-6 w-full lg:max-w-xs">
          <div className="bg-[#131315]/80 backdrop-blur-3xl rounded-2xl p-5 border-t border-l border-white/10 shadow-2xl">
            <h2 className="font-sans font-bold text-sm text-[#00dbe9] mb-4 flex items-center gap-2 uppercase tracking-wider">
              <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} /> 
              System Map
            </h2>

            <div className="space-y-4">
              {/* Service selectors */}
              <div>
                <label className="font-mono text-[9px] text-[#c7c6ca]/60 uppercase tracking-widest mb-2 block font-bold">
                  Node Type Filter
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[['all', 'All'], ['edge', 'Edge'], ['core', 'Core'], ['neural', 'AI']].map(([tier, label]) => (
                    <button
                      key={tier}
                      onClick={() => setSelectedTier(tier as 'all' | 'edge' | 'core' | 'neural')}
                      className={`px-2.5 py-1 text-[10px] font-mono rounded-lg border leading-none uppercase cursor-pointer transition-all ${
                        selectedTier === tier 
                          ? 'bg-[#00eefc]/15 text-[#00eefc] border-[#00eefc]/30 font-bold' 
                          : 'bg-white/[0.02] text-[#c7c6ca]/70 border-white/5 hover:bg-white/[0.05]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Travel query slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="font-mono text-[9px] text-[#c7c6ca]/60 uppercase tracking-widest font-bold">
                    Time Range
                  </label>
                  <span className="font-mono text-[10px] text-[#00eefc] font-bold uppercase">{simulatedTimeLabel}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={timeOffset}
                  onChange={(e) => setTimeOffset(Number(e.target.value))}
                  className="w-full accent-[#00eefc] bg-white/10 h-1 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-1 font-mono text-[8px] text-[#c7c6ca]/40 tracking-wider">
                  <span>Past (24h ago)</span>
                  <span>Live</span>
                </div>
              </div>
            </div>
          </div>

          {/* Local metrics load widget */}
          <div className="bg-[#131315]/80 backdrop-blur-3xl rounded-2xl p-4 border-l-2 border-[#00dbe9] shadow-2xl flex justify-between items-end">
            <div>
              <p className="font-mono text-[8px] text-[#c7c6ca]/40 uppercase tracking-widest font-bold">Traffic Load</p>
              <p className="font-mono text-base font-bold text-[#00dbe9] mt-0.5 tracking-wider">
                {dynamicLoadValue}% Capacity
              </p>
            </div>
            <div className="flex gap-1 h-8 items-end">
              <div className="w-1 bg-[#00eefc] h-3 rounded-full" />
              <div className="w-1 bg-[#00eefc] h-5 rounded-full" />
              <div className="w-1 bg-[#00eefc] h-[18px] rounded-full" />
              <div className={`w-1 bg-[#00eefc] h-[26px] rounded-full ${timeOffset > 80 ? 'animate-pulse' : ''}`} />
            </div>
          </div>
        </div>

        {/* Interactive Selected Node tooltip detail panel */}
        <div className="lg:absolute lg:top-6 lg:right-6 flex flex-col gap-6 w-full lg:max-w-sm">
          <div className="bg-[#131315]/80 backdrop-blur-3xl p-5 rounded-2xl border-t border-l border-white/10 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-mono text-[9px] text-[#00eefc] tracking-widest font-bold uppercase">
                  {selectedNodeObj.type} • System Node
                </p>
                <h3 className="font-sans font-bold text-white text-base tracking-tight mt-0.5">{selectedNodeObj.name}</h3>
              </div>
              <span className={`font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                selectedNodeObj.status === 'degraded' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
              }`}>
                {selectedNodeObj.status.toUpperCase()}
              </span>
            </div>

            <div className="space-y-3 bg-white/[0.01] p-3 rounded-xl border border-white/5">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-[#c7c6ca]/40 uppercase">Outbound Traffic</span>
                <span className="text-white font-semibold">{selectedNodeObj.traffic}</span>
              </div>
              <div className="flex justify-between font-mono text-xs">
                <span className="text-[#c7c6ca]/40 uppercase">Latency</span>
                <span className="text-[#00eefc] font-semibold">{selectedNodeObj.latency}</span>
              </div>
              <div className="flex justify-between font-mono text-xs">
                <span className="text-[#c7c6ca]/40 uppercase">CPU Usage</span>
                <span className="text-white font-semibold">{selectedNodeObj.cpu}%</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {nodes.map(n => (
                <button
                  key={n.id}
                  onClick={() => {
                    setSelectedNodeId(n.id);
                    setDiagnosticsData(null);
                  }}
                  className={`py-1 px-2 text-[10px] font-mono border rounded uppercase transition-all cursor-pointer ${
                    selectedNodeId === n.id ? 'border-[#00eefc] text-[#00eefc] bg-[#00eefc]/5' : 'border-white/5 text-[#c7c6ca]/50 hover:text-white'
                  }`}
                >
                  {n.id}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Warning Diagnostic Trigger / Outcome */}
          {selectedNodeObj.status === 'degraded' && (
            <div className="bg-red-950/20 backdrop-blur-3xl border border-red-500/30 p-5 rounded-2xl shadow-xl">
              <div className="flex justify-between items-start mb-3">
                <span className="font-mono text-[9px] text-red-400 font-bold tracking-widest uppercase">
                  Performance Alert
                </span>
                <AlertTriangle className="text-red-400 w-4 h-4 animate-bounce" />
              </div>

              <p className="font-sans text-xs text-[#c7c6ca] leading-relaxed mb-4">
                The Frankfurt server is experiencing slowdowns. Data transmission quality is reduced at 12.4% loss rate.
              </p>

              {diagnosticsData ? (
                <div className="p-3 bg-black/40 rounded-xl space-y-2 border border-white/5 animate-fade-in">
                  <p className="font-mono text-[10px] text-emerald-400 font-bold uppercase">
                    ✓ AI Analysis Complete
                  </p>
                  <p className="font-mono text-[10.5px] text-[#c7c6ca]/90 leading-relaxed italic">
                    "{diagnosticsData.analysis}"
                  </p>
                  <div className="pt-2 border-t border-white/5">
                    <span className="font-mono text-[9px] text-blue-300 block mb-1 uppercase font-bold">Recommended Actions:</span>
                    <ul className="space-y-1">
                      {diagnosticsData.steps.map((step, sidx) => (
                        <li key={sidx} className="font-mono text-[9.5px] text-[#c7c6ca]/70 flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-blue-400" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleTriggerDiagnostics(selectedNodeObj.name, 'Frankfurt Sector')}
                  disabled={runningDiagnostics}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-[#e4e2e4] text-xs font-mono uppercase tracking-wider font-bold rounded-xl cursor-pointer transition-all active:scale-95 shadow-[0_4px_15px_rgba(239,68,68,0.2)]"
                >
                  {runningDiagnostics ? 'Analyzing...' : 'Run AI Analysis'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Floating Canvas UI instruction overlay footer */}
        <div className="lg:absolute lg:bottom-6 lg:left-6 pointer-events-none uppercase font-mono text-[9px] text-[#c7c6ca]/30 tracking-widest">
          System Topology Map
        </div>
      </div>
    </div>
  );
}
