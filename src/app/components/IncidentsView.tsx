import { useState, useRef } from 'react';
import { AlertCircle, Clock, Users, TrendingUp, ChevronRight, ChevronDown, Sparkles, Server, Check, ArrowRight, ShieldAlert, Cpu, Search, X, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from './ui/badge';
import { getSeverityColor } from '../../utils/colors';

interface Incident {
  id: number;
  title: string;
  severity: 'critical' | 'warning' | 'info';
  time: string;
  duration: string;
  affectedUsers: string;
  services: string[];
  rootCause: string;
  confidence: number;
  status: 'active' | 'investigating' | 'resolved' | 'monitoring';
  steps: { name: string; done: boolean; current?: boolean }[];
  nodes: { name: string; type: string; status: 'ok' | 'fail' | 'warn' }[];
}

const initialIncidents: Incident[] = [
  {
    id: 1,
    title: 'Payment Gateway API Degraded Performance',
    severity: 'critical',
    time: '2 minutes ago',
    duration: '2m 14s',
    affectedUsers: '2,431',
    services: ['payment-api', 'checkout-service', 'order-processor'],
    rootCause: 'PostgreSQL Database Connection Pool Exhaustion on port 5432',
    confidence: 94,
    status: 'active',
    steps: [
      { name: 'Anomaly Detected', done: true },
      { name: 'Dynatrace MCP Triggered', done: true },
      { name: 'Root Cause Analyzed', done: true, current: true },
      { name: 'Remediation Proposed', done: false },
      { name: 'Issue Resolved', done: false },
    ],
    nodes: [
      { name: 'API-Gateway', type: 'Ingress', status: 'ok' },
      { name: 'Payment-API', type: 'Service', status: 'warn' },
      { name: 'PostgresDB', type: 'Database', status: 'fail' },
    ]
  },
  {
    id: 2,
    title: 'API Gateway Rate Limit Approaching Limit',
    severity: 'warning',
    time: '15 minutes ago',
    duration: '15m 42s',
    affectedUsers: '124',
    services: ['api-gateway', 'auth-service'],
    rootCause: 'Unusual spike in requests from mobile app clients (suspected API abuse)',
    confidence: 87,
    status: 'investigating',
    steps: [
      { name: 'Anomaly Detected', done: true },
      { name: 'Dynatrace MCP Triggered', done: true, current: true },
      { name: 'Root Cause Analyzed', done: false },
      { name: 'Remediation Proposed', done: false },
      { name: 'Issue Resolved', done: false },
    ],
    nodes: [
      { name: 'Client App', type: 'Source', status: 'warn' },
      { name: 'Auth-Service', type: 'Service', status: 'ok' },
      { name: 'API-Gateway', type: 'Ingress', status: 'warn' },
    ]
  },
  {
    id: 3,
    title: 'Redis Cache Invalidation Delay',
    severity: 'info',
    time: '1 hour ago',
    duration: '8m 33s',
    affectedUsers: '0',
    services: ['cache-service', 'product-catalog'],
    rootCause: 'Redis cluster slot migration and internal shard rebalancing overhead',
    confidence: 91,
    status: 'resolved',
    steps: [
      { name: 'Anomaly Detected', done: true },
      { name: 'Dynatrace MCP Triggered', done: true },
      { name: 'Root Cause Analyzed', done: true },
      { name: 'Remediation Proposed', done: true },
      { name: 'Issue Resolved', done: true },
    ],
    nodes: [
      { name: 'Catalog-Svc', type: 'Service', status: 'ok' },
      { name: 'Redis-Cluster', type: 'Cache', status: 'ok' },
    ]
  },
];

export function IncidentsView() {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredIncidents = initialIncidents.filter((inc) => {
    const matchesFilter = filter === 'all' || inc.severity === filter;
    const matchesSearch = inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.rootCause.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const openDetailsDrawer = (incident: Incident) => {
    setSelectedIncident(incident);
    setShowDetailsDrawer(true);
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto h-full w-full custom-scrollbar">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="text-error w-5 h-5 md:w-6 md:h-6 animate-pulse" />
            AI Incident Intelligence
          </h2>
          <p className="text-xs text-white/50">Root cause isolation and self-healing engine diagnostics</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search incidents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-2 py-1.5 bg-white/5 border border-white/5 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none focus:border-electric-blue w-32 md:w-40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-white/40" />
            {['all', 'critical', 'warning', 'info'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilter(lvl as typeof filter)}
                className={`px-2.5 py-1 rounded text-[10px] font-bold capitalize transition-colors border cursor-pointer ${
                  filter === lvl
                    ? 'bg-electric-blue/10 text-electric-blue border-electric-blue/30'
                    : 'bg-white/5 text-white/50 border-white/5 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI mini row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Critical Alerts', value: '1', color: 'text-error bg-error/10 border-error/20' },
          { label: 'Warning Anomalies', value: '1', color: 'text-warning bg-warning/10 border-warning/20' },
          { label: 'Auto-Resolved (24h)', value: '14', color: 'text-success bg-success/10 border-success/20' },
          { label: 'Mean Time to Repair', value: '6m 12s', color: 'text-info bg-info/10 border-info/20' }
        ].map((stat, i) => (
          <div key={i} className={`p-4 rounded-xl border ${stat.color} backdrop-blur-md`}>
            <p className="text-[10px] uppercase font-bold tracking-wider opacity-60 mb-1">{stat.label}</p>
            <p className="text-xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Incidents Stream */}
      <div className="space-y-4">
          {filteredIncidents.map((incident, idx) => {
            const colors = getSeverityColor(incident.severity);
            const isExpanded = expandedId === incident.id;

            return (
              <motion.div
                key={incident.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`bg-[#13151c]/60 backdrop-blur-md rounded-xl border transition-all overflow-hidden ${
                  isExpanded ? 'border-electric-blue/30 shadow-lg shadow-electric-blue/3' : 'border-white/5 hover:border-white/10'
                }`}
              >
                {/* Row Header summary */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : incident.id)}
                  className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between cursor-pointer gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        incident.severity === 'critical' ? 'bg-error' : incident.severity === 'warning' ? 'bg-warning' : 'bg-info'
                      } animate-pulse flex-shrink-0`} />
                      <h3 className="text-sm font-bold text-white leading-tight truncate">{incident.title}</h3>
                      <Badge variant="outline" className={`text-[10px] font-bold border uppercase ${colors.text} ${colors.bg} ${colors.border}`}>
                        {incident.severity}
                      </Badge>
                    </div>

                    <p className="text-xs text-white/50 truncate max-w-2xl">{incident.rootCause}</p>

                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-white/40 mt-2 font-medium">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-electric-blue" /> {incident.time}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:flex items-center gap-1"><TrendingUp className="w-3 h-3 text-warning" /> {incident.duration}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3 text-info" /> {incident.affectedUsers} impacted</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <button
                      onClick={(e) => { e.stopPropagation(); openDetailsDrawer(incident); }}
                      className="px-3 py-1 bg-white/5 hover:bg-white/8 text-[11px] font-bold rounded-lg border border-white/5 flex items-center gap-1 text-white/60 hover:text-white transition-colors cursor-pointer"
                      aria-label={`Ask AI about ${incident.title}`}
                    >
                      <Sparkles className="w-3 h-3 text-[#8b5cf6]" />
                      <span className="hidden sm:inline">Ask AI</span>
                    </button>
                    {isExpanded ? <ChevronDown className="w-5 h-5 text-white/40 flex-shrink-0" /> : <ChevronRight className="w-5 h-5 text-white/40 flex-shrink-0" />}
                  </div>
                </div>

                {/* Expanded detailing */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden bg-[#0a0b0f]/30 border-t border-white/5"
                    >
                      <div className="p-4 md:p-5 space-y-4 md:space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                          {/* Process Stepper */}
                          <div className="bg-[#13151c]/40 border border-white/5 rounded-lg p-4">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                              <Cpu className="w-3.5 h-3.5 text-[#8b5cf6]" /> Investigation Timeline
                            </h4>
                            <div className="relative pl-6 space-y-3">
                              <div className="absolute top-1.5 bottom-1.5 left-2 w-0.5 bg-white/5" />
                              {incident.steps.map((step, sIdx) => (
                                <div key={sIdx} className="relative flex items-start gap-3">
                                  <div className={`absolute -left-6 w-4 h-4 rounded-full flex items-center justify-center border text-[9px] ${
                                    step.done ? 'bg-success/15 border-success text-success' : step.current ? 'bg-[#8b5cf6]/10 border-[#8b5cf6] text-[#8b5cf6] animate-pulse' : 'bg-[#13151c] border-white/10 text-white/30'
                                  }`}>
                                    {step.done ? <Check className="w-2.5 h-2.5" /> : (sIdx + 1)}
                                  </div>
                                  <p className={`text-xs font-bold ${step.done ? 'text-white/80' : step.current ? 'text-[#8b5cf6]' : 'text-white/30'}`}>{step.name}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Root Cause Topology */}
                          <div className="bg-[#13151c]/40 border border-white/5 rounded-lg p-4 flex flex-col justify-between">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                              <Server className="w-3.5 h-3.5 text-electric-blue" /> Root Cause Topology
                            </h4>
                            <div className="flex items-center justify-around py-2 flex-wrap gap-2">
                              {incident.nodes.map((node, nIdx) => (
                                <div key={nIdx} className="flex items-center gap-2">
                                  <div className="flex flex-col items-center">
                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex flex-col items-center justify-center border ${
                                      node.status === 'fail' ? 'bg-error/10 border-error text-error' : node.status === 'warn' ? 'bg-warning/10 border-warning text-warning' : 'bg-success/10 border-success text-success'
                                    }`}>
                                      <Server className="w-4 h-4 md:w-5 md:h-5" />
                                      <span className="text-[7px] md:text-[8px] font-bold opacity-80 mt-0.5">{node.type}</span>
                                    </div>
                                    <span className="text-[9px] md:text-[10px] font-semibold text-white/70 mt-1.5">{node.name}</span>
                                  </div>
                                  {nIdx < incident.nodes.length - 1 && <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-white/20" />}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Service badges + Confidence */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/5">
                          <div className="flex flex-wrap gap-1.5">
                            {incident.services.map((svc) => (
                              <span key={svc} className="text-[9px] font-bold px-2 py-0.5 bg-white/5 text-white/50 border border-white/5 rounded font-mono uppercase">{svc}</span>
                            ))}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-white/50 font-medium">Confidence:</span>
                            <div className="w-24 md:w-32 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${incident.confidence}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                className="h-full bg-gradient-to-r from-electric-blue to-cyan rounded-full"
                              />
                            </div>
                            <span className="text-xs font-bold text-electric-blue">{incident.confidence}%</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
      </div>

      {/* Details Drawer */}
      <AnimatePresence>
        {showDetailsDrawer && selectedIncident && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-graphite/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowDetailsDrawer(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-slate-dark border border-white/10 rounded-xl p-6 max-w-lg w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">{selectedIncident.title}</h3>
                <button onClick={() => setShowDetailsDrawer(false)} className="p-1 hover:bg-white/5 rounded text-white/40 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4 text-xs text-white/70">
                <div className="p-3 bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 rounded-lg">
                  <p className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-[#8b5cf6]" /> <strong>AI Analysis:</strong> {selectedIncident.rootCause}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 p-3 rounded-lg">
                    <p className="text-white/40 text-[10px] uppercase tracking-wider">Severity</p>
                    <span className={`text-sm font-bold ${getSeverityColor(selectedIncident.severity).text}`}>{selectedIncident.severity}</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <p className="text-white/40 text-[10px] uppercase tracking-wider">Duration</p>
                    <p className="text-sm font-bold text-white">{selectedIncident.duration}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <p className="text-white/40 text-[10px] uppercase tracking-wider">Impact</p>
                    <p className="text-sm font-bold text-white">{selectedIncident.affectedUsers} users</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <p className="text-white/40 text-[10px] uppercase tracking-wider">Confidence</p>
                    <p className="text-sm font-bold text-electric-blue">{selectedIncident.confidence}%</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
