/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  Command, 
  AlertOctagon, 
  Cpu, 
  Globe, 
  Compass, 
  HelpCircle, 
  Activity, 
  User, 
  Zap,
  Server,
  Terminal,
  LogOut,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { ScreenType, Incident, AgentLog } from './types';
import { login, api, getToken } from './services/apiClient';
import { connectSocket, disconnectSocket, getSocket } from './services/socketClient';

// Importing our modular sub-screens
import LandingScreen from './components/LandingScreen';
import CommandCenterScreen from './components/CommandCenterScreen';
import IncidentsScreen from './components/IncidentsScreen';
import OrchestraScreen from './components/OrchestraScreen';
import GalaxyScreen from './components/GalaxyScreen';
import ExecutiveScreen from './components/ExecutiveScreen';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('landing');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('incident-01');
  const [isScalingUp, setIsScalingUp] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // SRE Live Incident State
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: 'incident-01',
      title: 'Memory usage spike on auth-service-02',
      severity: 'critical',
      service: 'AUTH-SERVICE',
      timestamp: '14:02:11',
      description: 'Memory usage on the authentication service has exceeded 98%. This may affect login and user session management.',
      status: 'active',
      uptimeImpact: '99.2%',
      blastRadius: 'US East Region - Login & Payments',
      userImpact: 'Some users may experience slower login responses.',
      dataIntegrity: 'No data loss detected',
      confidence: 94
    },
    {
      id: 'incident-02',
      title: 'Database connection pool is exhausted',
      severity: 'critical',
      service: 'POSTGRES-POOL',
      timestamp: '14:02:44',
      description: 'The database has run out of available connections. Checkout and order processing may be affected.',
      status: 'active',
      uptimeImpact: '98.8%',
      blastRadius: 'Checkout Service & Order Processing',
      userImpact: 'Customers may see delays when completing purchases.',
      dataIntegrity: 'No data loss detected',
      confidence: 88
    },
    {
      id: 'incident-03',
      title: 'Traffic controller responding slowly',
      severity: 'warning',
      service: 'INGRESS-6',
      timestamp: '14:03:00',
      description: 'A traffic routing component is experiencing higher than normal response times of 24ms.',
      status: 'active',
      uptimeImpact: '99.98%',
      blastRadius: 'API Gateway - Low Traffic Routes',
      userImpact: 'Minimal impact detected.',
      dataIntegrity: 'No data loss detected',
      confidence: 76
    }
  ]);

  // Swarm live diagnostic logs state
  const [logs, setLogs] = useState<AgentLog[]>([
    {
      id: 'log-01',
      time: '14:02:01',
      agentName: 'Root Cause Analyzer',
      category: 'Dependency Analysis',
      message: 'Analyzing service dependencies. Found potential issue with auth-service-02.',
      type: 'thought'
    },
    {
      id: 'log-02',
      time: '14:02:15',
      agentName: 'Security Monitor',
      category: 'Security Check',
      message: 'All security checks passed. No threats detected in the system.',
      type: 'info'
    },
    {
      id: 'log-03',
      time: '14:02:30',
      agentName: 'Predictive Analyzer',
      category: 'Capacity Forecast',
      message: 'Checking database connection usage for the next hour. Potential overload expected.',
      type: 'thought'
    }
  ]);

  // Maintain UTC Digital Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Backend connection + initial data fetch
  useEffect(() => {
    let cancelled = false;

    const initBackend = async () => {
      try {
        const auth = await login();
        if (!auth || cancelled) return;

        setIsBackendConnected(true);
        const token = getToken();
        connectSocket(token || undefined);

        const socket = getSocket();
        if (socket) {
          socket.on('incident:update', (data: Incident) => {
            setIncidents(prev => {
              const idx = prev.findIndex(i => i.id === data.id);
              if (idx >= 0) {
                const next = [...prev];
                next[idx] = { ...next[idx], ...data };
                return next;
              }
              return [data, ...prev];
            });
          });

          socket.on('agent:finding', (data: AgentLog) => {
            const log: AgentLog = {
              id: data.id || String(Math.random()),
              time: data.time || new Date().toLocaleTimeString('en-GB', { hour12: false }),
              agentName: data.agentName,
              category: data.category,
              message: data.message,
              type: data.type || 'info',
            };
            setLogs(prev => [log, ...prev.slice(0, 15)]);
          });

          socket.on('agent:status', (data: { name: string; status: string }) => {
            const logTime = new Date().toLocaleTimeString('en-GB', { hour12: false });
            setLogs(prev => [{
              id: String(Math.random()),
              time: logTime,
              agentName: data.name,
              category: 'STATUS',
              message: `Agent status changed to ${data.status}`,
              type: data.status === 'failed' ? 'warning' : 'info',
            }, ...prev.slice(0, 15)]);
          });
        }

        const [incidentData] = await Promise.all([
          api.getIncidents(),
        ]);

        if (incidentData?.incidents && !cancelled) {
          setIncidents(prev => incidentData.incidents.length > 0 ? incidentData.incidents as Incident[] : prev);
        }
      } catch {
        if (!cancelled) setIsBackendConnected(false);
      }
    };

    initBackend();

    return () => {
      cancelled = true;
      disconnectSocket();
    };
  }, []);

  // Fallback simulated telemetry (only when backend not connected)
  useEffect(() => {
    if (isBackendConnected || activeScreen === 'landing') return;

    const logPhrases = [
      { agent: 'Predictive Analyzer', cat: 'Resource Planning', msg: 'Memory usage is within normal range. No action needed.', type: 'info' as const },
      { agent: 'System Health', cat: 'Health Check', msg: 'All microservices are running normally. System is stable.', type: 'success' as const },
      { agent: 'Security Monitor', cat: 'Access Control', msg: 'Security audit complete. All access patterns are normal.', type: 'info' as const },
      { agent: 'Root Cause Analyzer', cat: 'Database Analysis', msg: 'Database performance is normal. All queries completing as expected.', type: 'thought' as const }
    ];

    const interval = setInterval(() => {
      const p = logPhrases[Math.floor(Math.random() * logPhrases.length)];
      const logTime = new Date().toLocaleTimeString('en-GB', { hour12: false });
      
      const newLog: AgentLog = {
        id: String(Math.random()),
        time: logTime,
        agentName: p.agent,
        category: p.cat,
        message: p.msg,
        type: p.type
      };

      setLogs(prev => [newLog, ...prev.slice(0, 15)]);
    }, 6000);

    return () => clearInterval(interval);
  }, [activeScreen, isBackendConnected]);

  // Execute Scale up resolution (HPA replicas scaling)
  const handleScaleUp = () => {
    setIsScalingUp(true);

    // Inject scaling diagnostic triggers
    const logTime = new Date().toLocaleTimeString('en-GB', { hour12: false });
    const logIdx = String(Math.random());

    const scaleLog: AgentLog = {
      id: logIdx,
      time: logTime,
      agentName: 'AI Assistant',
      category: 'AUTO-RESOLUTION',
      message: 'Scaling up application servers to handle the increased load. Adding 15 additional instances...',
      type: 'success'
    };

    setLogs(prev => [scaleLog, ...prev]);

    setTimeout(() => {
      setIsScalingUp(false);
      setIncidents(prev => prev.map(inc => {
        if (inc.id === 'incident-01') {
          return { ...inc, status: 'remediated', description: 'Fix applied. Additional server instances are now running and handling the load.' };
        }
        return inc;
      }));

      setLogs(prev => [{
        id: String(Math.random()),
        time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
        agentName: 'System Health',
        category: 'VERIFICATION',
        message: 'Scale-up complete. Memory usage has dropped to 42%. System is stable.',
        type: 'success'
      }, ...prev]);
    }, 3000);
  };

  const handleSelectIncident = (id: string) => {
    setSelectedIncidentId(id);
    setActiveScreen('incidents');
  };

  const handleRemediate = (incidentId: string, actionName: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: 'resolved',
          description: `Resolution applied successfully: ${actionName}. System is now stable.`
        };
      }
      return inc;
    }));
  };

  const handleAddLog = (newLog: AgentLog) => {
    setLogs(prev => [newLog, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#e4e2e4] font-sans relative flex flex-col justify-between overflow-x-hidden antialiased">
      
      {/* Top Professional Mission Status Header */}
      <header className="relative z-30 bg-[#0d0d0e]/95 backdrop-blur-md border-b border-white/[0.06] py-3.5 px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        {/* Left Brand Identity */}
        <div className="flex items-center gap-3 select-none cursor-pointer" onClick={() => setActiveScreen('landing')}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00b0ff] via-[#00eefc] to-blue-500 p-[1px] flex items-center justify-center shadow-[0_0_15px_rgba(0,238,252,0.3)]">
            <div className="w-full h-full bg-[#0d0d0e] rounded-xl flex items-center justify-center">
              <Sparkles className="text-[#00eefc] w-4.5 h-4.5 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="font-display font-medium text-lg leading-tight tracking-wider text-[#e4e2e4]">Aether<span className="text-[#00eefc] font-bold">OS</span></h1>
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#c7c6ca]/50 font-bold block">Enterprise Operations Center</span>
          </div>
        </div>

        {/* Dynamic SRE Operational Indicators */}
        <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
          <div className="flex items-center gap-2 bg-[#171719] px-3 py-1.5 rounded-lg border border-white/5 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#00eefc] animate-pulse shadow-[0_0_8px_#00eefc]" />
            <span className="text-[#c7c6ca]/70 uppercase text-[10px] font-bold tracking-wider">SYSTEM OPERATIONAL</span>
          </div>

          <div className="flex items-center gap-2 bg-[#171719] px-3 py-1.5 rounded-lg border border-white/5 shadow-inner">
            <Server className={`w-3.5 h-3.5 ${isBackendConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span className="text-[#e4e2e4] text-[10px] font-bold">{isBackendConnected ? 'API: CONNECTED' : 'API: FALLBACK'}</span>
          </div>

          <div className="text-[#c7c6ca]/60 text-[10px] font-bold tracking-widest bg-white/[0.02] px-3 py-1.5 rounded-lg border border-white/5 uppercase select-none">
            {currentTime || 'SYNCHRONIZING SYSTEM CLOCK...'}
          </div>
        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-8 relative z-10">
        
        {/* Navigation Tab links (Header tabs) */}
        {activeScreen !== 'landing' && (
          <nav className="flex flex-wrap gap-2 mb-8 border-b border-white/5 pb-5 select-none">
            {[
              { id: 'command', label: 'Command Center', icon: Command },
              { id: 'incidents', label: 'Incidents', icon: AlertOctagon, count: incidents.filter(i => i.status === 'active').length },
              { id: 'orchestra', label: 'AI Assistants', icon: Cpu },
              { id: 'galaxy', label: 'System Map', icon: Compass },
              { id: 'executive', label: 'Executive Overview', icon: Globe }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveScreen(tab.id as ScreenType)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase border cursor-pointer flex items-center gap-2.5 transition-all ${
                    activeScreen === tab.id 
                    ? 'bg-[#00eefc] text-[#00363a] border-transparent shadow-[0_4px_15px_rgba(0,238,252,0.25)] scale-[1.02]' 
                    : 'bg-white/[0.02] text-[#c7c6ca]/80 border-white/5 hover:bg-white/[0.06]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="bg-red-500 text-white font-sans text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1 animate-pulse">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {/* Dynamic active view injection */}
        <div className="animate-fade-in duration-300">
          {activeScreen === 'landing' && (
            <LandingScreen onInitialize={() => setActiveScreen('command')} />
          )}

          {activeScreen === 'command' && (
            <CommandCenterScreen 
              incidents={incidents}
              onSelectIncident={handleSelectIncident}
              onScaleUp={handleScaleUp}
              logs={logs}
              onAddLog={handleAddLog}
              onNavigateTo={setActiveScreen}
              isScalingUp={isScalingUp}
            />
          )}

          {activeScreen === 'incidents' && (
            <IncidentsScreen 
              incidents={incidents}
              selectedIncidentId={selectedIncidentId}
              onSelectIncident={setSelectedIncidentId}
              onRemediate={handleRemediate}
            />
          )}

          {activeScreen === 'orchestra' && (
            <OrchestraScreen 
              logs={logs}
              onAddLog={handleAddLog}
            />
          )}

          {activeScreen === 'galaxy' && (
            <GalaxyScreen 
              onAddLog={handleAddLog}
            />
          )}

          {activeScreen === 'executive' && (
            <ExecutiveScreen />
          )}
        </div>
      </main>

      {/* Floating navigational bottom tray for Cinematic feel */}
      <footer className="relative z-20 py-6 px-6 md:px-12 border-t border-white/[0.04] bg-[#0c0c0d]/90 backdrop-blur-md mt-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-[#c7c6ca]/40 select-none">
        <div>
          <span>AetherOS Enterprise Platform • v4.2.0</span>
        </div>
        <div className="flex gap-6">
          <button onClick={() => setActiveScreen('landing')} className="hover:text-white transition-colors cursor-pointer font-bold uppercase tracking-wide">
            System Home
          </button>
          <span>|</span>
          <span className="text-emerald-400 font-bold uppercase tracking-wider">ALL SYSTEMS SYNCHRONIZED</span>
        </div>
      </footer>
    </div>
  );
}
