import { useState, useEffect, useRef } from 'react';
import { Activity, TrendingUp, AlertCircle, Clock, Users, Cpu, Server, Wifi, Sparkles, CheckCircle2, Zap, MemoryStick } from 'lucide-react';
import { motion } from 'motion/react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Badge } from './ui/badge';
import { getSeverityColor, getGradientByColor } from '../../utils/colors';

const initialMetricsData = [
  { time: '00:00', cpu: 42, memory: 58, requests: 1100 },
  { time: '04:00', cpu: 35, memory: 55, requests: 950 },
  { time: '08:00', cpu: 68, memory: 69, requests: 2200 },
  { time: '12:00', cpu: 82, memory: 76, requests: 2900 },
  { time: '16:00', cpu: 64, memory: 70, requests: 2500 },
  { time: '20:00', cpu: 55, memory: 63, requests: 1750 },
];

const initialIncidents = [
  { id: 1, title: 'Payment Gateway Degraded Performance', severity: 'high', time: '2m ago', status: 'active', node: 'payment-svc-pod-4' },
  { id: 2, title: 'PostgreSQL DB Connection Pool Limit warning', severity: 'medium', time: '15m ago', status: 'investigating', node: 'postgres-db-main' },
  { id: 3, title: 'API Gateway Ingress Rate Limit Exceeded', severity: 'low', time: '1h ago', status: 'monitoring', node: 'ingress-nginx-controller' },
];

export function OverviewDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveStats, setLiveStats] = useState({
    health: 94.2,
    incidentsCount: 3,
    responseTime: 124,
    activeUsers: 12420,
    metrics: initialMetricsData,
    mcpConnected: true,
    podsRunning: 47,
    servicesDegraded: 1,
  });

  // Live clock ticking every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulated real-time data updates
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveStats((prev) => {
        const rtDelta = Math.floor(Math.random() * 5) - 2;
        const newResponseTime = Math.max(90, Math.min(220, prev.responseTime + rtDelta));
        const userDelta = Math.floor(Math.random() * 60) - 25;
        const newUsers = prev.activeUsers + userDelta;
        const healthDelta = (Math.random() * 0.16 - 0.08);
        const newHealth = parseFloat(Math.max(91.0, Math.min(99.9, prev.health + healthDelta)).toFixed(2));
        const podDelta = Math.floor(Math.random() * 3) - 1;

        const updatedMetrics = [...prev.metrics];
        const lastIndex = updatedMetrics.length - 1;
        const cpuDelta = Math.floor(Math.random() * 8) - 4;
        const memDelta = Math.floor(Math.random() * 6) - 3;
        const reqDelta = Math.floor(Math.random() * 120) - 50;

        updatedMetrics[lastIndex] = {
          ...updatedMetrics[lastIndex],
          cpu: Math.max(15, Math.min(98, updatedMetrics[lastIndex].cpu + cpuDelta)),
          memory: Math.max(20, Math.min(95, updatedMetrics[lastIndex].memory + memDelta)),
          requests: Math.max(600, Math.min(4500, updatedMetrics[lastIndex].requests + reqDelta)),
        };

        return {
          ...prev,
          health: newHealth,
          responseTime: newResponseTime,
          activeUsers: newUsers,
          metrics: updatedMetrics,
          podsRunning: Math.max(42, Math.min(52, prev.podsRunning + podDelta)),
        };
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  };

  const statsList = [
    { label: 'System Health Status', value: `${liveStats.health}%`, change: '+1.4%', icon: Activity, color: 'text-success' },
    { label: 'Active Alerts Feed', value: `${liveStats.incidentsCount}`, change: 'Stable', icon: AlertCircle, color: 'text-warning' },
    { label: 'Latency Avg Response', value: `${liveStats.responseTime}ms`, change: '-4ms', icon: Clock, color: 'text-info' },
    { label: 'Telemetry Active Users', value: liveStats.activeUsers.toLocaleString(), change: '+340', icon: Users, color: 'text-purple' },
  ];

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full w-full custom-scrollbar">
      
      {/* Header and Live Clock */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Server className="w-6 h-6 text-[#0ea5e9]" />
            Command Center
          </h2>
          <p className="text-xs text-white/50">Real-time infrastructure intelligence feeds & telemetry status</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Connection status tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-success/15 border border-success/20 rounded-full">
            <Wifi className="w-3.5 h-3.5 text-success animate-pulse" />
            <span className="text-[10px] font-bold text-success uppercase tracking-wider">MCP Connected</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 rounded-full">
            <Zap className="w-3 h-3 text-[#8b5cf6] animate-pulse" />
            <span className="text-[9px] font-bold text-[#8b5cf6] uppercase tracking-wider">
              {liveStats.podsRunning} Pods • {liveStats.servicesDegraded} Degraded
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-xs font-mono text-white/60">
            <Clock className="w-3.5 h-3.5 text-electric-blue" />
            <span className="hidden sm:inline">{formatDate(currentTime)}</span>
            <span>{formatTime(currentTime)} UTC</span>
          </div>
        </div>
      </div>

      {/* AI Reasoning active banner */}
      <div className="p-4 bg-gradient-to-r from-[#8b5cf6]/10 to-transparent border border-[#8b5cf6]/20 rounded-lg flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#8b5cf6] animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">Gemini Observability Agent</h3>
            <p className="text-[11px] text-white/50">Continuously evaluating active metrics for potential drift anomalies.</p>
          </div>
        </div>
        <Badge variant="outline" className="border-[#8b5cf6]/30 bg-[#8b5cf6]/10 text-[#8b5cf6] text-[10px] font-bold">
          Reasoning Active
        </Badge>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsList.map((stat, i) => {
          const Icon = stat.icon;
          const bgGradient = getGradientByColor(stat.color);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-[#13151c]/60 backdrop-blur-md rounded-xl p-4 border flex flex-col justify-between h-32 relative overflow-hidden group hover:border-[#0ea5e9]/20 transition-all`}
            >
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${bgGradient} flex items-center justify-center shadow-inner`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <Badge variant="secondary" className="text-[10px] font-bold bg-white/5 text-white/70">
                  {stat.change}
                </Badge>
              </div>
              <div className="mt-2">
                <p className="text-2xl font-black text-white tracking-tight leading-none mb-1">{stat.value}</p>
                <p className="text-[11px] text-white/50 font-medium uppercase tracking-wider">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CPU & Memory Area Chart */}
        <div className="bg-[#13151c]/60 backdrop-blur-md rounded-xl p-5 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#0ea5e9]" />
              Compute Performance (CPU & Memory)
            </h3>
            <div className="flex items-center gap-3 text-[10px] font-bold text-white/50">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#0ea5e9]" /> CPU %</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#8b5cf6]" /> Memory %</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={liveStats.metrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="memGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 9 }} />
              <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 9 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#13151c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}
                labelStyle={{ color: '#e8e9ed', fontSize: 10, fontWeight: 'bold' }}
                itemStyle={{ fontSize: 10 }}
              />
              <Area type="monotone" name="CPU Utilization" dataKey="cpu" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#cpuGradient)" />
              <Area type="monotone" name="Memory Utilization" dataKey="memory" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#memGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Requests Chart */}
        <div className="bg-[#13151c]/60 backdrop-blur-md rounded-xl p-5 border border-white/5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#06b6d4]" />
            Telemetry Request Rate (req/sec)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={liveStats.metrics} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 9 }} />
              <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 9 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#13151c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}
                labelStyle={{ color: '#e8e9ed', fontSize: 10, fontWeight: 'bold' }}
                itemStyle={{ fontSize: 10 }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 9, color: 'rgba(255,255,255,0.5)' }} />
              <Line type="monotone" name="Ingress Requests" dataKey="requests" stroke="#06b6d4" strokeWidth={2.5} activeDot={{ r: 6 }} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Incident Feeds List */}
      <div className="bg-[#13151c]/60 backdrop-blur-md rounded-xl p-5 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-warning" />
            Active Alert Incidents Stream
          </h3>
          <Badge variant="outline" className="border-white/15 text-white/50 text-[10px]">
            {liveStats.incidentsCount} Incidents Active
          </Badge>
        </div>
        <div className="space-y-3">
          {initialIncidents.map((incident) => {
            const colors = getSeverityColor(incident.severity);
            return (
              <motion.div
                key={incident.id}
                whileHover={{ x: 4 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white/5 hover:bg-white/8 border border-white/5 hover:border-[#0ea5e9]/20 rounded-lg transition-all gap-3 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${colors.raw === '#ef4444' ? 'bg-error' : colors.raw === '#f59e0b' ? 'bg-warning' : 'bg-info'} animate-pulse mt-1`} />
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">{incident.title}</h4>
                    <p className="text-[10px] text-white/40 mt-1 flex items-center gap-1.5">
                      <span>Node: <code className="text-[#0ea5e9] bg-white/5 px-1 py-0.5 rounded font-mono text-[9px]">{incident.node}</code></span>
                      <span>•</span>
                      <span>{incident.time}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 self-end sm:self-auto">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border capitalize ${colors.text} ${colors.bg} ${colors.border}`}>
                    {incident.severity}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70 capitalize">
                    {incident.status}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
