import { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Clock, Activity, ShieldAlert, Sparkles, Check, Loader2, Play, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface Prediction {
  id: number;
  title: string;
  probability: number;
  timeToImpact: number; // in seconds
  severity: 'high' | 'medium' | 'low';
  affectedServices: string[];
  recommendation: string;
}

const initialPredictions: Prediction[] = [
  {
    id: 1,
    title: 'PostgreSQL Connection Pool Exhaustion Risk',
    probability: 94,
    timeToImpact: 720, // 12m
    severity: 'high',
    affectedServices: ['payment-api', 'checkout-service'],
    recommendation: 'Trigger scale rules to increase pool size bounds dynamically from 50 to 150.'
  },
  {
    id: 2,
    title: 'Compute Memory Pressure on Analytics API',
    probability: 78,
    timeToImpact: 2700, // 45m
    severity: 'medium',
    affectedServices: ['analytics-engine'],
    recommendation: 'Provision auxiliary replica pods to offload analytical query queue processing.'
  },
  {
    id: 3,
    title: 'API Gateway Ingress Rate Limit Exceedance',
    probability: 65,
    timeToImpact: 7200, // 2h
    severity: 'low',
    affectedServices: ['api-gateway'],
    recommendation: 'Configure secondary traffic throttling limits for unauthenticated traffic.'
  },
];

const forecastData = [
  { time: '10:00', actual: 45, predicted: 45, upper: 45, lower: 45 },
  { time: '10:15', actual: 52, predicted: 52, upper: 52, lower: 52 },
  { time: '10:30', actual: 61, predicted: 61, upper: 61, lower: 61 },
  { time: '10:45', actual: 68, predicted: 68, upper: 68, lower: 68 },
  { time: '11:00', actual: null, predicted: 76, upper: 84, lower: 68 },
  { time: '11:15', actual: null, predicted: 83, upper: 94, lower: 72 },
  { time: '11:30', actual: null, predicted: 91, upper: 100, lower: 79 },
  { time: '11:45', actual: null, predicted: 96, upper: 100, lower: 84 },
];

export function PredictionsView() {
  const [predictionsList, setPredictionsList] = useState<Prediction[]>(initialPredictions);
  const [actionStatus, setActionStatus] = useState<Record<number, 'idle' | 'loading' | 'success'>>({});
  const [timeRemaining, setTimeRemaining] = useState<Record<number, number>>({
    1: 720,
    2: 2700,
    3: 7200,
  });

  // Countdown timers
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((key) => {
          const id = Number(key);
          if (next[id] > 0) {
            next[id] = next[id] - 1;
          }
        });
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return 'Impact Imminent';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const executeAction = (id: number) => {
    setActionStatus((prev) => ({ ...prev, [id]: 'loading' }));
    
    // Simulate auto-healing action execution via Dynatrace MCP
    setTimeout(() => {
      setActionStatus((prev) => ({ ...prev, [id]: 'success' }));
      // Remove or resolve prediction after action succeeds
      setTimeout(() => {
        setPredictionsList((prevList) => prevList.filter((p) => p.id !== id));
      }, 1500);
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full w-full custom-scrollbar">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="text-[#8b5cf6] w-6 h-6" />
            Predictive Intelligence
          </h2>
          <p className="text-xs text-white/50">Forecasting capacity failures and resource bottlenecks</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 rounded-lg text-xs font-semibold text-[#8b5cf6]">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Active Forecast Horizon: 2 Hours</span>
        </div>
      </div>

      {/* Stats Mini Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Forecast Risks', value: predictionsList.length, color: 'text-[#8b5cf6] bg-[#8b5cf6]/10 border-[#8b5cf6]/15' },
          { label: 'Prevented Failures Today', value: '29', color: 'text-success bg-success/10 border-success/15' },
          { label: 'Forecast Accuracy MTTR', value: '91.8%', color: 'text-info bg-info/10 border-info/15' },
          { label: 'Failure Reduction SLA', value: '-43%', color: 'text-success bg-success/10 border-success/15' }
        ].map((stat, i) => (
          <div key={i} className={`p-4 rounded-xl border ${stat.color} backdrop-blur-md`}>
            <p className="text-[10px] uppercase font-bold tracking-wider opacity-60 mb-1">{stat.label}</p>
            <p className="text-xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Range-based Forecast Chart */}
      <div className="bg-[#13151c]/60 backdrop-blur-md rounded-xl p-5 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#8b5cf6]" />
            Resource Exhaustion Risk Forecast (with 95% Confidence Interval)
          </h3>
        </div>

        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="predictedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.12} />
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
            {/* Shaded confidence interval band with better opacity */}
            <Area type="monotone" dataKey="upper" stroke="none" fill="#8b5cf6" fillOpacity={0.12} name="Upper Bound" />
            <Area type="monotone" dataKey="lower" stroke="none" fill="#1e1b4b" fillOpacity={0.6} name="Lower Bound" />
            
            {/* Forecast lines */}
            <Area type="monotone" name="Predicted Trend" dataKey="predicted" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="6 3" fill="url(#predictedGrad)" />
            <Area type="monotone" name="Actual Performance" dataKey="actual" stroke="#0ea5e9" strokeWidth={2.5} fill="none" connectNulls />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Predictions Cards List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Predictive Actions Feed</h3>
        
        <AnimatePresence mode="popLayout">
          {predictionsList.map((pred) => {
            const status = actionStatus[pred.id] || 'idle';
            const countdown = timeRemaining[pred.id] || 0;
            const colors = pred.severity === 'high' ? 'border-error/20 bg-error/5 text-error' : pred.severity === 'medium' ? 'border-warning/20 bg-warning/5 text-warning' : 'border-info/20 bg-info/5 text-info';

            // SVG probability gauge helper variables
            const radius = 24;
            const stroke = 4;
            const normalizedRadius = radius - stroke * 1.5;
            const circumference = normalizedRadius * 2 * Math.PI;
            const strokeDashoffset = circumference - (pred.probability / 100) * circumference;

            return (
              <motion.div
                key={pred.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="bg-[#13151c]/60 backdrop-blur-md rounded-xl p-5 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-[#8b5cf6]/20 transition-all"
              >
                <div className="flex-1 flex items-start gap-4">
                  {/* Probability Ring Gauge */}
                  <div className="relative flex-shrink-0 w-12 h-12 flex items-center justify-center">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle
                        stroke="rgba(255, 255, 255, 0.05)"
                        fill="transparent"
                        strokeWidth={stroke}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                      />
                      <circle
                        stroke="#8b5cf6"
                        fill="transparent"
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset }}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-[10px] font-bold text-white">{pred.probability}%</span>
                  </div>

                  {/* Prediction titles */}
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white leading-tight truncate">{pred.title}</h4>
                      <Badge variant="outline" className={`text-[9px] font-bold border uppercase ${colors}`}>
                        {pred.severity}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-[10px] text-white/40 font-medium">
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-error animate-pulse" /> Time to Impact: {formatTime(countdown)}</span>
                      <span>•</span>
                      <span>Probability: {pred.probability}%</span>
                    </div>

                    <div className="pt-2">
                      <p className="text-[11px] text-white/30 uppercase font-bold tracking-wider">Affected Nodes</p>
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        {pred.affectedServices.map((svc) => (
                          <span key={svc} className="text-[9px] font-mono font-bold px-2 py-0.5 bg-white/5 border border-white/5 rounded text-white/60">
                            {svc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right actions CTA box */}
                <div className="border-t md:border-t-0 pt-4 md:pt-0 border-white/5 md:pl-5 flex flex-col items-stretch md:items-end justify-center gap-3 md:w-80">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-white/30 uppercase font-bold tracking-wider">Recommended Action</span>
                    <p className="text-[11px] text-[#8b5cf6] font-medium leading-normal mt-0.5">{pred.recommendation}</p>
                  </div>
                  
                  {status === 'success' ? (
                    <button className="px-4 py-2 bg-success/20 border border-success/30 text-success text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 w-full md:w-fit cursor-default">
                      <Check className="w-3.5 h-3.5" /> Action Dispatched
                    </button>
                  ) : status === 'loading' ? (
                    <button className="px-4 py-2 bg-white/5 border border-white/10 text-white/40 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 w-full md:w-fit cursor-wait">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8b5cf6]" /> Dispatching Scaling...
                    </button>
                  ) : (
                    <button
                      onClick={() => executeAction(pred.id)}
                      className="px-4 py-2 bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] hover:from-[#6d28d9] hover:to-[#8b5cf6] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-lg shadow-[#8b5cf6]/10 w-full md:w-fit cursor-pointer transform active:scale-95 transition-all"
                    >
                      <Play className="w-3 h-3 fill-white" /> Take Action
                    </button>
                  )}
                </div>

              </motion.div>
            );
          })}
        </AnimatePresence>

      </div>

    </div>
  );
}
