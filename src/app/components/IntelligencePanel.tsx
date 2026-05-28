import { useState, useEffect, useRef } from 'react';
import { Brain, Zap, CheckCircle2, AlertTriangle, Send, Loader2, RefreshCw, MessageSquare, History, ShieldAlert, Cpu, Sparkles, TrendingUp, Server, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from './ui/badge';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

interface IntelligencePanelProps {
  activeView: string;
}

export function IntelligencePanel({ activeView }: IntelligencePanelProps) {
  const [activeTab, setActiveTab] = useState<'analysis' | 'actions' | 'memory'>('analysis');
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: 'Hello! I am the AetherOS Operations assistant. How can I help you analyze active alerts today?', time: '9:40 AM' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [applyState, setApplyState] = useState<Record<string, 'idle' | 'loading' | 'success'>>({});
  const [typingText, setTypingText] = useState('');
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, typingText]);

  // Set context-aware recommendations on view change
  useEffect(() => {
    const recs: Record<string, string[]> = {
      overview: ['Review CPU spike from 04:00', 'Check active alert feed', 'Verify MCP connection status'],
      incidents: ['Investigate payment-api degradation', 'Scale PostgreSQL pool', 'Review blast radius'],
      agents: ['Check Root Cause Agent heartbeat', 'Verify Predictive Intelligence forecast'],
      predictions: ['Deploy memory replica pod', 'Review confidence intervals', 'Check affected services'],
      executive: ['Download SLA report', 'Review cost savings breakdown', 'Verify AI-prevented outages'],
      security: ['Review threat timeline', 'Check compliance status', 'Audit RBAC sessions'],
      settings: ['Verify MCP integration status', 'Review threshold configuration'],
    };
    setRecommendations(recs[activeView] || ['Check system status', 'Review recent activity']);
  }, [activeView]);

  const simulateTyping = (text: string, cb: () => void) => {
    let idx = 0;
    setTypingText('');
    const interval = setInterval(() => {
      setTypingText(text.slice(0, idx + 1));
      idx++;
      if (idx >= text.length) {
        clearInterval(interval);
        setTypingText('');
        cb();
      }
    }, 15);
    return () => clearInterval(interval);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      if (activeView === 'overview') {
        reply = 'Overall CPU cluster telemetry shows healthy bounds. System health at 94.2% with 3 active warnings. Inspect the Compute Performance graph for isolated spikes.';
      } else if (activeView === 'incidents') {
        reply = 'The payment-api connection pool is running near exhaustion due to checkout-service request queues. Scaling DB capacity by 50% is recommended to prevent service degradation.';
      } else if (activeView === 'agents') {
        reply = 'All 5 agents synchronized. Root Cause Agent actively analyzing telemetry anomalies. Predictive Intelligence on standby. Response Orchestrator ready.';
      } else if (activeView === 'predictions') {
        reply = 'Predictive models show 78% probability of memory pressure on analytics-engine within 45 minutes. Recommended: deploy auxiliary replica pod to offload query processing.';
      } else if (activeView === 'executive') {
        reply = 'Executive summary: All SLA metrics green. 99.98% uptime achieved. $9,120 cost savings realized via automated downscaling. 24 AI-prevented outages this period.';
      } else if (activeView === 'security') {
        reply = 'Security posture: 92/100 score. 93 blocked threats today. SOC 2 and GDPR compliance verified. 2 high-severity events under investigation.';
      } else {
        reply += 'Settings and configuration dashboard is operational. All MCP integrations are connected and reporting.';
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setIsTyping(false);
    }, 1200);
  };

  const applyAction = (actionKey: string) => {
    setApplyState((prev) => ({ ...prev, [actionKey]: 'loading' }));
    setTimeout(() => {
      setApplyState((prev) => ({ ...prev, [actionKey]: 'success' }));
    }, 1500);
  };

  const renderContextAnalysis = () => {
    switch (activeView) {
      case 'incidents':
        return (
          <div className="space-y-4">
            <div className="bg-[#13151c]/60 backdrop-blur-md rounded-lg p-4 border border-white/5 space-y-2.5">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-error" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Root Cause isolated</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                PostgreSQL pool exhaustion detected on host <code className="text-electric-blue bg-white/5 px-1 py-0.5 rounded font-mono text-[9px]">postgres-db-main</code>. Spike in checkout threads locked resources.
              </p>
              <div className="flex items-center gap-3 text-[11px] text-white/50 pt-1.5">
                <span>Confidence:</span>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-electric-blue to-cyan" style={{ width: '94%' }} />
                </div>
                <span className="text-electric-blue font-bold">94%</span>
              </div>
            </div>
            <div className="bg-[#13151c]/60 backdrop-blur-md rounded-lg p-4 border border-white/5 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Blast Radius</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-white/40 block">Impacted Nodes:</span>
                  <div className="flex gap-1.5 mt-1 flex-wrap">
                    {['payment-api', 'checkout'].map((n) => (
                      <span key={n} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-warning/10 text-warning">{n}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-white/40 block">User Impact:</span>
                  <span className="text-warning font-bold mt-1 block">Medium ~2.4k users</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'predictions':
        return (
          <div className="space-y-4">
            <div className="bg-[#13151c]/60 backdrop-blur-md rounded-lg p-4 border border-white/5 space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#8b5cf6]" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Capacity Exhaustion Alarm</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                Resource utilization forecast models indicate 78% probability of memory pressure bottleneck on host <code className="text-electric-blue bg-white/5 px-1 py-0.5 rounded font-mono text-[9px]">analytics-engine</code> within 45 minutes.
              </p>
            </div>
          </div>
        );

      case 'agents':
        return (
          <div className="space-y-4">
            <div className="bg-[#13151c]/60 backdrop-blur-md rounded-lg p-4 border border-white/5 space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#8b5cf6]" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Agent Health Summary</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                All 5 autonomous agents operational. Root Cause Agent active on pool queries. Predictive Intelligence running forecast cycles.
              </p>
            </div>
            {/* Quick recommendations */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Recommendations</h4>
              {recommendations.map((rec, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-white/5 border border-white/5 rounded text-[10px] text-white/60">
                  <Sparkles className="w-3 h-3 text-[#8b5cf6] flex-shrink-0" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div className="bg-[#13151c]/60 backdrop-blur-md rounded-lg p-4 border border-white/5 space-y-2.5">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-electric-blue" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Active View Analysis</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                {activeView === 'overview' && 'System health at 94.2%. 3 active alerts. CPU utilization within normal bounds.'}
                {activeView === 'executive' && 'Executive metrics green across all SLAs. 99.98% uptime achieved with $9.1k cost savings.'}
                {activeView === 'security' && 'Security score 92/100. 2 high-severity events. All compliance standards met.'}
                {activeView === 'settings' && 'All MCP integrations connected. Review threshold configuration for optimal performance.'}
                {!['overview', 'executive', 'security', 'settings'].includes(activeView) && 'Monitoring system telemetry and agent health status.'}
              </p>
            </div>
            {/* Quick recommendations */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Quick Actions</h4>
              {recommendations.slice(0, 3).map((rec, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-white/5 border border-white/5 rounded text-[10px] text-white/60">
                  <Sparkles className="w-3 h-3 text-[#8b5cf6] flex-shrink-0" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  const renderContextActions = () => {
    const list = activeView === 'incidents' ? [
      { key: 'scale', text: 'Scale database connection pool limit', desc: 'Increase max connections from 50 to 150' },
      { key: 'cache', text: 'Trigger cache invalidation flushing', desc: 'Clear Redis cache for payment-api' },
      { key: 'rollback', text: 'Rollback recent deployment', desc: 'Revert v2.4.1 to v2.4.0 on payment-svc' }
    ] : activeView === 'predictions' ? [
      { key: 'scale_replica', text: 'Deploy auxiliary replica pod', desc: 'Add 2 replicas to analytics-engine' },
      { key: 'clean_disk', text: 'Flush historical logs caches', desc: 'Clear 7d+ logs from disk volumes' }
    ] : activeView === 'security' ? [
      { key: 'block_ip', text: 'Block suspicious IP range', desc: 'Add 192.168.4.x to deny list' },
      { key: 'rotate_keys', text: 'Rotate API access keys', desc: 'Regenerate Gemini and Dynatrace tokens' }
    ] : [
      { key: 'review_logs', text: 'Extract active problem brief', desc: 'Generate summary of current issues' },
      { key: 'ping', text: 'Verify Dynatrace MCP ping', desc: 'Test connection to Dynatrace endpoint' },
      { key: 'summary', text: 'Generate Gemini Ops summary', desc: 'Create AI analysis of current state' }
    ];

    return (
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Available Remediations</h4>
        <div className="space-y-2.5">
          {list.map((item) => {
            const status = applyState[item.key] || 'idle';
            return (
              <div key={item.key} className="flex flex-col gap-1.5 p-3 bg-white/5 border border-white/5 rounded-lg text-xs">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-white/80 font-medium block">{item.text}</span>
                    <span className="text-[10px] text-white/40 block mt-0.5">{item.desc}</span>
                  </div>
                </div>
                {status === 'success' ? (
                  <button className="py-1.5 bg-success/20 border border-success/30 text-success text-[10px] font-bold rounded flex items-center justify-center gap-1.5 cursor-default w-full mt-1">
                    <CheckCircle2 className="w-3 h-3" /> Action Applied
                  </button>
                ) : status === 'loading' ? (
                  <button className="py-1.5 bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold rounded flex items-center justify-center gap-1.5 cursor-wait w-full mt-1">
                    <Loader2 className="w-3 h-3 animate-spin text-[#8b5cf6]" /> Dispatching...
                  </button>
                ) : (
                  <button
                    onClick={() => applyAction(item.key)}
                    className="py-1.5 bg-[#8b5cf6]/10 hover:bg-[#8b5cf6]/20 border border-[#8b5cf6]/30 text-[#8b5cf6] text-[10px] font-bold rounded transition-colors cursor-pointer w-full mt-1"
                  >
                    Apply Fix
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderContextMemory = () => {
    return (
      <div className="space-y-3 bg-[#13151c]/60 backdrop-blur-md rounded-lg p-4 border border-white/5">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <History className="w-4 h-4 text-info" /> Incident Historical Log
        </h4>
        <div className="space-y-3.5 text-xs text-white/50 leading-relaxed font-light">
          <div className="p-2 bg-[#0a0b0f]/50 border border-white/5 rounded">
            <span className="text-[9px] font-bold text-white/45 block font-mono">14 Days Ago</span>
            <p className="text-white/85 font-medium mt-0.5">Database connection pool exhaustion</p>
            <p className="mt-1 text-[11px]">Resolution: connection pool scaling limit adjusted to 150. Recovered in 8.2m.</p>
          </div>
          <div className="p-2 bg-[#0a0b0f]/50 border border-white/5 rounded">
            <span className="text-[9px] font-bold text-white/45 block font-mono">29 Days Ago</span>
            <p className="text-white/85 font-medium mt-0.5">Ingress API bottleneck latency</p>
            <p className="mt-1 text-[11px]">Resolution: deployment of auxiliary rate limit parameters. MTTR: 5.6m.</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-[#0a0b0f] flex flex-col justify-between select-none">
      
      {/* Header title */}
      <div className="p-4 border-b border-white/5 bg-[#0a0b0f]/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-[#8b5cf6] animate-pulse" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-white">AI Operations</h2>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-0.5 bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] animate-ping" />
          <span className="text-[9px] text-[#8b5cf6] font-bold uppercase">Streaming live</span>
        </div>
      </div>

      {/* Tabs list selector */}
      <div className="flex border-b border-white/5 px-2 bg-[#0a0b0f]/20">
        {(['analysis', 'actions', 'memory'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider text-center transition-all cursor-pointer ${
              activeTab === tab
                ? 'text-[#8b5cf6] border-b-2 border-[#8b5cf6]'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main scrolling analysis workspace */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {activeTab === 'analysis' && renderContextAnalysis()}
        {activeTab === 'actions' && renderContextActions()}
        {activeTab === 'memory' && renderContextMemory()}
      </div>

      {/* Assistant Interactive Chat Terminal */}
      <div className="border-t border-white/5 bg-[#13151c]/40 flex flex-col h-[280px]">
        {/* Messages feed */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar text-xs">
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`p-2.5 rounded-lg max-w-[85%] leading-normal font-light ${
                msg.sender === 'user'
                  ? 'bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 text-white text-right'
                  : 'bg-white/5 border border-white/5 text-white/80'
              }`}>
                {msg.text}
              </div>
              <span className="text-[9px] text-white/30 mt-1 font-mono">{msg.time}</span>
            </div>
          ))}
          
          {/* Typing dots */}
          {isTyping && (
            <div className="flex flex-col items-start">
              <div className="p-2.5 bg-white/5 border border-white/5 rounded-lg flex gap-1">
                <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full typing-dot" />
                <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full typing-dot" />
                <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full typing-dot" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input panel Form */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-white/5 flex gap-2">
          <input
            type="text"
            placeholder="Ask AetherOS assistant..."
            className="flex-1 bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#8b5cf6] min-w-0"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
          />
          <button
            type="submit"
            className="p-2 bg-[#8b5cf6] hover:bg-[#6d28d9] text-white rounded-lg transition-colors flex-shrink-0 flex items-center justify-center cursor-pointer transform active:scale-95"
            aria-label="Send message to assistant"
          >
            <Send className="w-3.5 h-3.5 fill-white" />
          </button>
        </form>
      </div>

    </div>
  );
}
export default IntelligencePanel;
