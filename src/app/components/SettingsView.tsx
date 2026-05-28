import { useState } from 'react';
import { Settings, Bell, Shield, Database, Zap, ChevronRight, Check, Wifi, Globe, Sliders, CheckCircle2, Save } from 'lucide-react';
import { motion } from 'motion/react';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<'integrations' | 'notifications' | 'automation'>('integrations');

  // Integrations state
  const [dynatraceToken, setDynatraceToken] = useState('dt0c01.ST26AETHEROS.XXXXXX');
  const [geminiKey, setGeminiKey] = useState('AIzaSyAetherOS_XXXXXX');
  const [saved, setSaved] = useState(false);

  // Notification channels
  const [channels, setChannels] = useState({
    slack: true,
    pagerduty: true,
    email: false,
  });

  // Threshold slider
  const [cpuThreshold, setCpuThreshold] = useState([85]);
  const [memThreshold, setMemThreshold] = useState([78]);

  // Automation rules
  const [autoScale, setAutoScale] = useState(true);
  const [requireApproval, setRequireApproval] = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full w-full custom-scrollbar">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="text-[#0ea5e9] w-6 h-6" />
          System Settings
        </h2>
        <p className="text-xs text-white/50">Manage Dynatrace integrations, AI execution rules, and pager configurations</p>
      </div>

      {/* Main Settings Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left tabs selector */}
        <div className="space-y-1.5">
          {[
            { id: 'integrations', label: 'MCP Integrations', icon: Database },
            { id: 'notifications', label: 'Alert Notifications', icon: Bell },
            { id: 'automation', label: 'AI Agent Rules', icon: Zap },
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold text-left transition-all border cursor-pointer ${
                  isTabActive
                    ? 'bg-[#0ea5e9]/10 text-[#0ea5e9] border-[#0ea5e9]/20'
                    : 'bg-white/3 border-transparent text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Settings panel area */}
        <div className="md:col-span-3 bg-[#13151c]/60 backdrop-blur-md rounded-xl p-5 border border-white/5">
          
          {/* TAB 1: INTEGRATIONS */}
          {activeTab === 'integrations' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-[#0ea5e9]" /> Observability & AI Integrations
                </h3>
                <p className="text-xs text-white/40">Configure credentials and connect auxiliary MCP servers.</p>
              </div>

              <div className="space-y-4">
                {/* Dynatrace Integration */}
                <div className="p-4 bg-[#0a0b0f]/50 border border-white/5 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 flex items-center justify-center text-[#0ea5e9]">
                        <Wifi className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Dynatrace MCP Server</h4>
                        <p className="text-[10px] text-white/40">Query system metric graphs and host topology</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-success/30 bg-success/10 text-success text-[9px] font-bold">
                      Connected
                    </Badge>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-white/40 block mb-1">API Token Secret</label>
                    <input
                      type="password"
                      value={dynatraceToken}
                      onChange={(e) => setDynatraceToken(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#13151c] text-white border border-white/5 rounded font-mono text-xs focus:outline-none focus:border-[#0ea5e9]"
                    />
                  </div>
                </div>

                {/* Google Cloud Agent Builder */}
                <div className="p-4 bg-[#0a0b0f]/50 border border-white/5 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center text-[#8b5cf6]">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">GCP Agent Builder</h4>
                        <p className="text-[10px] text-white/40">Execute container rebuild and scaling API tasks</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-success/30 bg-success/10 text-success text-[9px] font-bold">
                      Connected
                    </Badge>
                  </div>
                </div>

                {/* Gemini Engine */}
                <div className="p-4 bg-[#0a0b0f]/50 border border-white/5 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-warning/10 border border-warning/20 flex items-center justify-center text-warning">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Gemini 1.5 Pro Reasoning Engine</h4>
                        <p className="text-[10px] text-white/40">Translate alert payloads and generate execution summaries</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-success/30 bg-success/10 text-success text-[9px] font-bold">
                      Connected
                    </Badge>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-white/40 block mb-1">Developer API Key</label>
                    <input
                      type="password"
                      value={geminiKey}
                      onChange={(e) => setGeminiKey(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#13151c] text-white border border-white/5 rounded font-mono text-xs focus:outline-none focus:border-[#0ea5e9]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-warning" /> Alert Notifications Channels
                </h3>
                <p className="text-xs text-white/40">Configure dispatch targets and metric warning limits.</p>
              </div>

              <div className="space-y-5">
                {/* Channels toggles */}
                <div className="space-y-3 bg-[#0a0b0f]/50 p-4 border border-white/5 rounded-lg">
                  <h4 className="text-xs font-bold text-white mb-2">Notification Streams</h4>
                  
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <div>
                      <p className="text-xs font-bold text-white">PagerDuty Integration</p>
                      <p className="text-[10px] text-white/40">Dispatch critical incidents alerts to on-call schedules</p>
                    </div>
                    <Switch
                      checked={channels.pagerduty}
                      onCheckedChange={(checked) => setChannels((prev) => ({ ...prev, pagerduty: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <div>
                      <p className="text-xs font-bold text-white">Slack Hook Channel</p>
                      <p className="text-[10px] text-white/40">Stream system anomaly briefs directly to #ops-alerts</p>
                    </div>
                    <Switch
                      checked={channels.slack}
                      onCheckedChange={(checked) => setChannels((prev) => ({ ...prev, slack: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-xs font-bold text-white">Email Digest Logs</p>
                      <p className="text-[10px] text-white/40">Receive weekly summaries of SLA uptime metrics</p>
                    </div>
                    <Switch
                      checked={channels.email}
                      onCheckedChange={(checked) => setChannels((prev) => ({ ...prev, email: checked }))}
                    />
                  </div>
                </div>

                {/* Threshold sliders */}
                <div className="bg-[#0a0b0f]/50 p-4 border border-white/5 rounded-lg space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">CPU Alert Limit Threshold</span>
                      <span className="text-electric-blue font-black">{cpuThreshold}%</span>
                    </div>
                    <Slider
                      value={cpuThreshold}
                      onValueChange={setCpuThreshold}
                      min={50}
                      max={98}
                      step={1}
                    />
                    <p className="text-[10px] text-white/35">
                      Triggers alarm alerts when a node compute profile breaches this threshold for longer than 3 minutes.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">Memory Pressure Limit</span>
                      <span className="text-[#8b5cf6] font-black">{memThreshold}%</span>
                    </div>
                    <Slider
                      value={memThreshold}
                      onValueChange={setMemThreshold}
                      min={50}
                      max={95}
                      step={1}
                    />
                    <p className="text-[10px] text-white/35">
                      Triggers memory scaling actions when utilization exceeds this threshold for 5+ minutes.
                    </p>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={handleSave}
                    variant={saved ? 'default' : 'outline'}
                    className={saved ? 'bg-success hover:bg-success' : ''}
                  >
                    {saved ? <><Check className="w-3.5 h-3.5 mr-1" /> Saved</> : <><Save className="w-3.5 h-3.5 mr-1" /> Save Changes</>}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: AUTOMATION */}
          {activeTab === 'automation' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#8b5cf6]" /> AI Agent Automation Rules
                </h3>
                <p className="text-xs text-white/40">Set the guardrails and execution authorization for autonomous actions.</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-[#0a0b0f]/50 border border-white/5 rounded-lg space-y-4">
                  
                  <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                    <div>
                      <p className="text-xs font-bold text-white">Enable Auto-Scaling Remediation</p>
                      <p className="text-[10px] text-white/40">Allow Response Orchestrator to scale pods to resolve bottlenecks</p>
                    </div>
                    <Switch
                      checked={autoScale}
                      onCheckedChange={setAutoScale}
                    />
                  </div>

                  <div className="flex items-center justify-between py-1.5">
                    <div>
                      <p className="text-xs font-bold text-white">Require Human Operator Approval</p>
                      <p className="text-[10px] text-white/40">Prompt for user authorization on critical cluster sizing alterations</p>
                    </div>
                    <Switch
                      checked={requireApproval}
                      onCheckedChange={setRequireApproval}
                    />
                  </div>

                </div>

                {/* Rules Checklist */}
                <div className="bg-[#0a0b0f]/50 p-4 border border-white/5 rounded-lg space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-[#8b5cf6]" /> Automation Rules Scope
                  </h4>
                  <ul className="space-y-2 text-[11px] text-white/60">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" /> Scale connection pool settings if connections {'>'} 90%</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" /> Trigger host swap action if CPU latency limit exceeds 95%</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" /> Throttle unauthenticated API limits during traffic spikes</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

        </div>

      </div>

    </div>
  );
}
