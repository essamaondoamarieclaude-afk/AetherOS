import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Clock, Users, CheckCircle2, Download, RefreshCw, BarChart3, FileText, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from './ui/badge';
import { getGradientByColor } from '../../utils/colors';

const businessMetrics = [
  { month: 'Jan', uptime: 99.8, incidents: 12, mttr: 8.5, cost: 45000 },
  { month: 'Feb', uptime: 99.6, incidents: 18, mttr: 11.2, cost: 48000 },
  { month: 'Mar', uptime: 99.9, incidents: 8, mttr: 6.8, cost: 42000 },
  { month: 'Apr', uptime: 99.95, incidents: 5, mttr: 5.2, cost: 39000 },
  { month: 'May', uptime: 99.92, incidents: 7, mttr: 4.8, cost: 38000 },
  { month: 'Jun', uptime: 99.98, incidents: 3, mttr: 3.2, cost: 36000 },
];

const kpis = [
  {
    label: 'Uptime Compliance',
    value: '99.98%',
    change: '+0.18%',
    trend: 'up',
    icon: CheckCircle2,
    color: 'text-success'
  },
  {
    label: 'Mean Time to Repair (MTTR)',
    value: '3.2min',
    change: '-2.1min',
    trend: 'down', // Decreased MTTR is good (down trend)
    icon: Clock,
    color: 'text-info'
  },
  {
    label: 'Cloud Infrastructure Cost',
    value: '$36.2k',
    change: '-$9.1k',
    trend: 'down', // Decreased cost is good (down trend)
    icon: DollarSign,
    color: 'text-success'
  },
  {
    label: 'AI-Prevented Outages',
    value: '24',
    change: '+18',
    trend: 'up', // More prevented outages is good (up trend)
    icon: TrendingUp,
    color: 'text-purple'
  },
];

const slaCompliance = [
  { service: 'Payment gateway API', sla: 99.9, actual: 99.95, status: 'healthy' },
  { service: 'User session auth core', sla: 99.5, actual: 99.87, status: 'healthy' },
  { service: 'Analytics reporting engine', sla: 99.0, actual: 98.92, status: 'at-risk' },
  { service: 'Notification broker service', sla: 99.5, actual: 99.62, status: 'healthy' },
];

const fullSummary = "AetherOS operations have scaled securely over the preceding 30-day billing window. The deployment of autonomous self-healing agents successfully intercepted and mitigated 24 critical memory & connection pool anomalies before they propagated to customer checkout, preventing an estimated 4.2 hours of platform degradation. Resource-downscaling micro-tasks on idle VM profiles achieved an aggregate saving of $9,120. All core SLAs are fully satisfied.";

export function ExecutiveDashboard() {
  const [timeframe, setTimeframe] = useState<'30d' | '7d' | '90d'>('30d');
  const [typedSummary, setTypedSummary] = useState('');
  const [reportState, setReportState] = useState<'idle' | 'generating' | 'done'>('idle');

  // Typewriter streaming effect for AI summary
  useEffect(() => {
    setTypedSummary('');
    let index = 0;
    const interval = setInterval(() => {
      setTypedSummary((prev) => prev + fullSummary.charAt(index));
      index++;
      if (index >= fullSummary.length) {
        clearInterval(interval);
      }
    }, 10);
    return () => clearInterval(interval);
  }, [timeframe]);

  const generateReport = () => {
    setReportState('generating');
    setTimeout(() => {
      setReportState('done');
      setTimeout(() => setReportState('idle'), 2000);
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full w-full custom-scrollbar">
      
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="text-[#0ea5e9] w-6 h-6" />
            Executive Intelligence
          </h2>
          <p className="text-xs text-white/50">High-level business impacts, SLA metrics, and cloud cost analytics</p>
        </div>

        {/* Date Selector and Download Report CTA */}
        <div className="flex items-center gap-3">
          <div className="flex bg-white/5 border border-white/5 rounded-lg p-0.5">
            {(['7d', '30d', '90d'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  timeframe === t ? 'bg-[#0ea5e9] text-white' : 'text-white/40 hover:text-white/70'
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          {reportState === 'done' ? (
            <button className="px-3.5 py-1.5 bg-success/20 border border-success/30 text-success text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-default">
              <Check className="w-3.5 h-3.5" /> Report Saved
            </button>
          ) : reportState === 'generating' ? (
            <button className="px-3.5 py-1.5 bg-white/5 border border-white/10 text-white/40 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-wait">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0ea5e9]" /> Compiling PDF...
            </button>
          ) : (
            <button
              onClick={generateReport}
              className="px-3.5 py-1.5 bg-white/5 hover:bg-white/8 text-white text-xs font-bold rounded-lg border border-white/5 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-white/60" /> Download Report
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          const bgGradient = getGradientByColor(kpi.color);
          // Correct conditional trend color formatting
          // For MTTR and Cost, down is good; for Uptime and AI-Prevented, up is good
          const isUpwardPositive = kpi.label === 'Uptime Compliance' || kpi.label === 'AI-Prevented Outages';
          const isDownwardPositive = kpi.label === 'Mean Time to Repair (MTTR)' || kpi.label === 'Cloud Infrastructure Cost';
          const isGoodTrend = (isUpwardPositive && kpi.trend === 'up') || (isDownwardPositive && kpi.trend === 'down');
          const TrendIcon = kpi.trend === 'up' ? TrendingUp : TrendingDown;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#13151c]/60 backdrop-blur-md rounded-xl p-4 border border-white/5 flex flex-col justify-between h-32 relative overflow-hidden group hover:border-[#0ea5e9]/20 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${bgGradient} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <div className={`flex items-center gap-1 font-bold text-xs ${isGoodTrend ? 'text-success' : 'text-error'}`}>
                  <TrendIcon className="w-3.5 h-3.5" />
                  <span>{kpi.change}</span>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-2xl font-black text-white tracking-tight leading-none mb-1">{kpi.value}</p>
                <p className="text-[11px] text-white/50 font-medium uppercase tracking-wider">{kpi.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* SLA compliance bar graph */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SLA detail lists */}
        <div className="bg-[#13151c]/60 backdrop-blur-md rounded-xl p-5 border border-white/5 lg:col-span-2">
          <h3 className="text-sm font-bold text-white mb-4">Core SLA Monitoring Services</h3>
          <div className="space-y-4">
            {slaCompliance.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${service.status === 'healthy' ? 'bg-success animate-pulse' : 'bg-warning animate-pulse'}`} />
                    <span className="font-bold text-white/80">{service.service}</span>
                  </div>
                  <div className="flex items-center gap-3 font-semibold text-white/50">
                    <span>Target: {service.sla}%</span>
                    <span>•</span>
                    <span className={service.actual >= service.sla ? 'text-success' : 'text-warning'}>
                      Actual: {service.actual}%
                    </span>
                  </div>
                </div>
                {/* SLA animated progress bar using Framer Motion */}
                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(service.actual / 100) * 100}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.1 }}
                    className={`h-full rounded-full bg-gradient-to-r ${
                      service.actual >= service.sla ? 'from-success to-[#4ade80]' : 'from-warning to-[#fbbf24]'
                    }`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SLA donut gauge overall visual */}
        <div className="bg-[#13151c]/60 backdrop-blur-md rounded-xl p-5 border border-white/5 flex flex-col justify-between items-center text-center">
          <h3 className="text-sm font-bold text-white w-full text-left">Overall SLA Status</h3>
          
          {/* Uptime radial gauge */}
          <div className="relative w-32 h-32 flex items-center justify-center my-4">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                stroke="rgba(255, 255, 255, 0.03)"
                fill="transparent"
                strokeWidth="8"
                r="48"
                cx="64"
                cy="64"
              />
              <circle
                stroke="url(#slaGrad)"
                fill="transparent"
                strokeWidth="8"
                strokeDasharray="301.6"
                strokeDashoffset="0.06" // 99.98%
                r="48"
                cx="64"
                cy="64"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="slaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col">
              <span className="text-xl font-black text-white leading-none">99.98%</span>
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">Uptime</span>
            </div>
          </div>

          <Badge variant="outline" className="border-success/30 bg-success/10 text-success text-[10px] font-bold">
            Target SLA (99.90%) Met
          </Badge>
        </div>

      </div>

      {/* Operational Trends & Cloud Spend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-[#13151c]/60 backdrop-blur-md rounded-xl p-5 border border-white/5">
          <h3 className="text-sm font-bold text-white mb-4">MTTR Response Trends (min)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={businessMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 9 }} />
              <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 9 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#13151c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}
                labelStyle={{ color: '#e8e9ed', fontSize: 10 }}
              />
              <Line type="monotone" name="Avg MTTR" dataKey="mttr" stroke="#0ea5e9" strokeWidth={2.5} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#13151c]/60 backdrop-blur-md rounded-xl p-5 border border-white/5">
          <h3 className="text-sm font-bold text-white mb-4">Infrastructure Spend Trends ($ USD)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={businessMetrics} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 9 }} />
              <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 9 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#13151c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}
                labelStyle={{ color: '#e8e9ed', fontSize: 10 }}
              />
              <Bar dataKey="cost" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Spend" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* AI Streaming Executive Summary */}
      <div className="bg-gradient-to-br from-[#0ea5e9]/10 to-[#8b5cf6]/10 rounded-xl p-5 border border-[#0ea5e9]/15 flex items-start gap-4">
        <FileText className="w-5 h-5 text-[#0ea5e9] flex-shrink-0 mt-0.5" />
        <div className="space-y-2 min-w-0">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">Gemini Ops Executive Summary</h3>
          <div className="text-sm text-white/80 leading-relaxed font-light min-h-[50px]">
            {typedSummary}
            <span className="inline-block w-1.5 h-3 bg-[#0ea5e9] animate-pulse ml-0.5" />
          </div>
          <p className="text-[10px] text-white/30">
            Dynamically streaming core operational analysis insights • Updated 1m ago
          </p>
        </div>
      </div>

    </div>
  );
}
