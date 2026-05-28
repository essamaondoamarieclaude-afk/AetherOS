import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle2, Activity, ShieldAlert, Key, ClipboardCheck, ArrowUpRight, Search, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from './ui/badge';
import { getSeverityColor } from '../../utils/colors';

interface SecurityAlert {
  id: number;
  title: string;
  severity: 'high' | 'medium' | 'low';
  type: string;
  time: string;
  description: string;
  status: 'investigating' | 'monitoring' | 'resolved';
}

const initialAlerts: SecurityAlert[] = [
  {
    id: 1,
    title: 'Unusual API Request Burst Pattern',
    severity: 'medium',
    type: 'Ingress Threat',
    time: '5m ago',
    description: 'Detected 240% increase in authentication attempts from mobile client IPs (subnet 192.168.4.x)',
    status: 'investigating'
  },
  {
    id: 2,
    title: 'Brute Force SSH Login Failures',
    severity: 'high',
    type: 'Host Integrity',
    time: '12m ago',
    description: 'Multiple failed root credential SSH attempts on payment-svc-pod-4 from external range 80.x.x.x',
    status: 'monitoring'
  },
  {
    id: 3,
    title: 'SSL/TLS Certificate Expiration Alarm',
    severity: 'low',
    type: 'Certificate Warning',
    time: '1h ago',
    description: 'Ingress routing SSL cert for *.aetheros.dev expires in 12 days. Auto-renew routine pending check.',
    status: 'monitoring'
  },
  {
    id: 4,
    title: 'Outdated NPM Dependency CVE vulnerability',
    severity: 'low',
    type: 'Vulnerability Scan',
    time: '4h ago',
    description: 'Package lodash inside checkout service has reported CVE-2025-xxxx (Prototype pollution flaw).',
    status: 'resolved'
  },
  {
    id: 5,
    title: 'RBAC Policy Privilege Modification',
    severity: 'high',
    type: 'Access Audit',
    time: '6h ago',
    description: 'Audit logger detected role modification on operator-policy permissions by admin user token.',
    status: 'investigating'
  }
];

const threatTimelineData = [
  { hour: '00:00', blocked: 4, alerts: 1 },
  { hour: '04:00', blocked: 12, alerts: 2 },
  { hour: '08:00', blocked: 8, alerts: 1 },
  { hour: '12:00', blocked: 19, alerts: 4 },
  { hour: '16:00', blocked: 24, alerts: 5 },
  { hour: '20:00', blocked: 15, alerts: 2 },
];

export function SecurityView() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>(initialAlerts);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const totalPages = Math.ceil(alerts.length / itemsPerPage);
  const displayedAlerts = alerts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const deleteAlert = (id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full w-full custom-scrollbar">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="text-[#22c55e] w-6 h-6" />
            Security Intelligence Hub
          </h2>
          <p className="text-xs text-white/50">Runtime vulnerability detection, traffic anomalies, and threat response logs</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-success/10 border border-success/20 rounded-lg text-xs font-semibold text-success">
          <CheckCircle2 className="w-4 h-4 text-success animate-pulse" />
          <span>Policies Fully Enforced</span>
        </div>
      </div>

      {/* Grid: Donut + Timeline + Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* Security Score Donut Gauge */}
        <div className="bg-[#13151c]/60 backdrop-blur-md rounded-xl p-5 border border-white/5 flex flex-col justify-between items-center text-center">
          <h3 className="text-xs font-bold text-white w-full text-left uppercase tracking-wider">Security Score</h3>
          
          <div className="relative w-32 h-32 flex items-center justify-center my-3">
            <svg className="w-32 h-32 transform -rotate-90">
              <defs>
                <linearGradient id="securityScoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
              </defs>
              <circle stroke="rgba(255, 255, 255, 0.03)" fill="transparent" strokeWidth="7" r="48" cx="64" cy="64" />
              <circle
                stroke="url(#securityScoreGrad)"
                fill="transparent"
                strokeWidth="7"
                strokeDasharray="301.6"
                strokeDashoffset="24.1"
                r="48"
                cx="64"
                cy="64"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col">
              <span className="text-2xl font-black text-white leading-none">92<span className="text-xs text-white/40">/100</span></span>
              <span className="text-[8px] font-bold text-success uppercase tracking-widest mt-1">Excellent</span>
            </div>
          </div>

          <div className="w-full space-y-2 mt-2">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-white/50">Host Hardening</span>
              <span className="text-white font-semibold">95%</span>
            </div>
            <Progress value={95} className="h-1.5" />
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-white/50">Access Control</span>
              <span className="text-white font-semibold">88%</span>
            </div>
            <Progress value={88} className="h-1.5" />
          </div>
        </div>

        {/* Threat timeline area chart */}
        <div className="bg-[#13151c]/60 backdrop-blur-md rounded-xl p-5 border border-white/5 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Threat Incident Timeline (Last 24h)</h3>
            <div className="flex items-center gap-3 text-[9px] text-white/40">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-error" /> Blocked</span>
              <span className="font-mono">Total: 93</span>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={threatTimelineData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="hour" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 8 }} />
              <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 8 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#13151c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}
                labelStyle={{ color: '#e8e9ed', fontSize: 9 }}
              />
              <Area type="monotone" name="Blocked Attacks" dataKey="blocked" stroke="#ef4444" strokeWidth={2} fill="url(#threatGrad)" />
              <Area type="monotone" name="Alert Events" dataKey="alerts" stroke="#f59e0b" strokeWidth={1.5} fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Grid: Compliance and RBAC */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Compliance Checklist */}
        <div className="bg-[#13151c]/60 backdrop-blur-md rounded-xl p-5 border border-white/5 space-y-3.5">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <ClipboardCheck className="w-4 h-4 text-success" /> Cloud Standards Compliance
          </h3>
          <div className="space-y-2.5">
            {[
              { rule: 'SOC 2 Type II Auditing', status: 'compliant', date: 'Feb 2026' },
              { rule: 'GDPR Data Residency Rules', status: 'compliant', date: 'Active' },
              { rule: 'ISO 27001 Security Framework', status: 'compliant', date: 'Dec 2025' },
              { rule: 'PCI-DSS Billing Compliance', status: 'compliant', date: 'Active' },
            ].map((std, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 bg-[#0a0b0f]/50 border border-white/5 rounded-lg text-xs">
                <span className="font-semibold text-white/80">{std.rule}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/40">{std.date}</span>
                  <Badge variant="outline" className="border-success/30 bg-success/10 text-success text-[9px] font-bold uppercase py-0">
                    {std.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RBAC Sessions Overview */}
        <div className="bg-[#13151c]/60 backdrop-blur-md rounded-xl p-5 border border-white/5 space-y-3.5">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Key className="w-4 h-4 text-info" /> Role-Based Access Control (RBAC)
          </h3>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-[#0a0b0f]/50 p-3 rounded border border-white/5">
              <p className="text-[10px] text-white/40 uppercase font-bold">Admin Roles</p>
              <p className="text-xl font-black text-white mt-1">2</p>
            </div>
            <div className="bg-[#0a0b0f]/50 p-3 rounded border border-white/5">
              <p className="text-[10px] text-white/40 uppercase font-bold">Auditor Roles</p>
              <p className="text-xl font-black text-white mt-1">1</p>
            </div>
            <div className="bg-[#0a0b0f]/50 p-3 rounded border border-white/5">
              <p className="text-[10px] text-white/40 uppercase font-bold">Operator Roles</p>
              <p className="text-xl font-black text-white mt-1">6</p>
            </div>
            <div className="bg-[#0a0b0f]/50 p-3 rounded border border-white/5">
              <p className="text-[10px] text-white/40 uppercase font-bold">Active Sessions</p>
              <p className="text-xl font-black text-[#22c55e] mt-1">3</p>
            </div>
          </div>
        </div>

      </div>

      {/* Security Threat log table with pagination */}
      <div className="bg-[#13151c]/60 backdrop-blur-md rounded-xl p-5 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-error" />
            Security Alerts & Events Log
          </h3>
          <Badge variant="outline" className="border-white/10 text-white/50 text-[10px]">
            {alerts.length} Warnings Logged
          </Badge>
        </div>

        {/* Security event list row items */}
        <div className="space-y-3">
          {displayedAlerts.length > 0 ? (
            displayedAlerts.map((alert) => {
              const colors = getSeverityColor(alert.severity);
              return (
                <div
                  key={alert.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white/5 hover:bg-white/8 border border-white/5 rounded-lg gap-4"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-2.5 h-2.5 rounded-full ${colors.raw === '#ef4444' ? 'bg-error' : colors.raw === '#f59e0b' ? 'bg-warning' : 'bg-info'} animate-pulse mt-1`} />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white leading-tight flex items-center gap-2">
                        <span>{alert.title}</span>
                        <span className="text-[9px] font-mono text-white/35">({alert.type})</span>
                      </h4>
                      <p className="text-[11px] text-white/50 mt-1 leading-relaxed">{alert.description}</p>
                      <p className="text-[10px] text-white/35 mt-1 font-mono">{alert.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 self-end sm:self-auto flex-shrink-0">
                    <Badge variant="outline" className={`text-[9px] font-bold border uppercase ${colors.text} ${colors.bg} ${colors.border}`}>
                      {alert.severity}
                    </Badge>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#0a0b0f]/50 border border-white/5 text-white/60 capitalize">
                      {alert.status}
                    </span>
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="p-1 hover:bg-error/15 text-white/30 hover:text-error rounded border border-transparent transition-colors cursor-pointer"
                      title="Delete log event entry"
                      aria-label={`Delete security alert: ${alert.title}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-xs text-white/30 py-6">All security alarms cleared.</p>
          )}
        </div>

        {/* Pagination buttons */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 mt-3 border-t border-white/5 text-[10px] text-white/40">
            <span>Page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/8 disabled:opacity-30 disabled:pointer-events-none rounded border border-white/5 cursor-pointer font-bold"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/8 disabled:opacity-30 disabled:pointer-events-none rounded border border-white/5 cursor-pointer font-bold"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
