import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LandingView } from './components/LandingView';
import { Navigation } from './components/Navigation';
import { IntelligencePanel } from './components/IntelligencePanel';
import { OverviewDashboard } from './components/OverviewDashboard';
import { IncidentsView } from './components/IncidentsView';
import { AIAgentsView } from './components/AIAgentsView';
import { PredictionsView } from './components/PredictionsView';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { InfrastructureGalaxy } from './components/InfrastructureGalaxy';
import { SecurityView } from './components/SecurityView';
import { SettingsView } from './components/SettingsView';
import { Bell, Sparkles, ChevronRight, Search, X, Command, Cpu, LayoutDashboard } from 'lucide-react';
import { Badge } from './components/ui/badge';

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeView, setActiveView] = useState('overview');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showIntelligencePanel, setShowIntelligencePanel] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Reset scroll on view change
  useEffect(() => {
    const el = document.getElementById('view-content-area');
    if (el) el.scrollTop = 0;
  }, [activeView]);

  // Auto-focus search input when opening palette
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [showSearch]);

  // Close search on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showSearch) {
        setShowSearch(false);
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showSearch]);

  if (showLanding) {
    return <LandingView onEnter={() => setShowLanding(false)} />;
  }

  const handleViewChange = useCallback((view: string) => {
    setActiveView(view);
    setSearchQuery('');
    setShowSearch(false);
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'overview':
        return <OverviewDashboard />;
      case 'infrastructure':
        return <InfrastructureGalaxy />;
      case 'incidents':
        return <IncidentsView />;
      case 'agents':
        return <AIAgentsView />;
      case 'predictions':
        return <PredictionsView />;
      case 'executive':
        return <ExecutiveDashboard />;
      case 'security':
        return <SecurityView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewDashboard />;
    }
  };

  const getBreadcrumb = () => {
    const mapping: Record<string, string> = {
      overview: 'Operational Command Center',
      infrastructure: 'Service Topology Galaxy',
      incidents: 'AI Incident Intelligence',
      agents: 'Multi-Agent Orchestrator',
      predictions: 'Predictive Forecasting',
      executive: 'Executive SLA & KPI Dashboard',
      security: 'Threat & Compliance Hub',
      settings: 'System Configuration',
    };
    return mapping[activeView] || 'Overview';
  };

  const viewIcons: Record<string, typeof LayoutDashboard> = {
    overview: LayoutDashboard,
    infrastructure: LayoutDashboard,
    incidents: LayoutDashboard,
    agents: LayoutDashboard,
    predictions: LayoutDashboard,
    executive: LayoutDashboard,
    security: LayoutDashboard,
    settings: LayoutDashboard,
  };

  const searchCommands = [
    { label: 'Jump to Overview Dashboard', view: 'overview' },
    { label: 'View 3D Infrastructure Topology', view: 'infrastructure' },
    { label: 'Check Active Alert Incidents', view: 'incidents' },
    { label: 'Manage AI Agents Workflow', view: 'agents' },
    { label: 'View Future Capacity Predictions', view: 'predictions' },
    { label: 'View SLA Executive Summary', view: 'executive' },
    { label: 'Scan Security Events & Threat Log', view: 'security' },
    { label: 'Configure Integration Settings', view: 'settings' },
  ];

  const filteredCommands = searchCommands.filter((cmd) =>
    cmd.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex bg-graphite text-foreground overflow-hidden select-none font-sans relative">
      
      {/* Sidebar Navigation */}
      <Navigation
        activeView={activeView}
        onViewChange={handleViewChange}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        onSearchClick={() => setShowSearch(true)}
      />

      {/* Main Workspace Column */}
      <div className="flex-1 h-full flex flex-col overflow-hidden bg-graphite">
        
        {/* Top Control Bar / Header */}
        <header className="h-[73px] border-b border-white/5 px-4 md:px-6 flex items-center justify-between bg-graphite/40 backdrop-blur-md z-20 flex-shrink-0">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs min-w-0">
            <span className="text-white/40 hover:text-white/70 transition-colors font-medium whitespace-nowrap">AetherOS</span>
            <ChevronRight className="w-3 h-3 text-white/20 flex-shrink-0" />
            <span className="text-white font-bold capitalize whitespace-nowrap">{activeView}</span>
            <Badge variant="outline" className="hidden md:inline-flex border-white/10 bg-white/5 text-white/50 text-[9px] font-bold px-2 py-0.5">
              {getBreadcrumb()}
            </Badge>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* Search button */}
            <button
              onClick={() => setShowSearch(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/8 transition-all cursor-pointer"
              title="Search (⌘K)"
              aria-label="Open command palette"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Quick Action</span>
              <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[9px] font-mono border border-white/15">⌘K</kbd>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white border border-white/5 transition-colors cursor-pointer"
                aria-label="Open notifications menu"
              >
                <Bell className="w-4 h-4" />
              </button>
              <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-graphite animate-pulse" />
            </div>

            {/* Intelligence Panel Toggle */}
            <button
              onClick={() => setShowIntelligencePanel(!showIntelligencePanel)}
              className={`flex items-center gap-2 px-2.5 md:px-3 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                showIntelligencePanel
                  ? 'bg-[#8b5cf6]/15 hover:bg-[#8b5cf6]/25 text-[#8b5cf6] border-[#8b5cf6]/35 shadow-lg shadow-[#8b5cf6]/5'
                  : 'bg-white/5 hover:bg-white/8 text-white/60 border-white/5'
              }`}
              title="Toggle AI Intelligence Assistant Panel"
              aria-label="Toggle intelligence assistant panel"
            >
              <Sparkles className={`w-3.5 h-3.5 ${showIntelligencePanel ? 'text-[#8b5cf6] animate-pulse' : ''}`} />
              <span className="hidden md:inline">Intelligence Panel</span>
            </button>

          </div>
        </header>

        {/* View Content Workspace */}
        <main
          id="view-content-area"
          className="flex-1 overflow-hidden relative"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full h-full"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Intelligence Panel */}
      <AnimatePresence>
        {showIntelligencePanel && activeView !== 'infrastructure' && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 384, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="h-full border-l border-white/5 flex-shrink-0 hidden lg:block"
          >
            <IntelligencePanel activeView={activeView} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Command Palette Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <div
            className="fixed inset-0 z-50 bg-graphite/75 backdrop-blur-md flex items-start justify-center pt-16 md:pt-24 px-4"
            onClick={() => { setShowSearch(false); setSearchQuery(''); }}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="bg-slate-dark w-full max-w-xl rounded-xl border border-white/10 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Header */}
              <div className="p-4 border-b border-white/8 flex items-center gap-3">
                <Search className="w-5 h-5 text-white/40 flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Type a command or view name..."
                  className="flex-1 bg-transparent border-0 outline-none text-sm text-white placeholder-white/30"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                  className="p-1 text-white/40 hover:text-white rounded hover:bg-white/5 cursor-pointer"
                  aria-label="Close command palette"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Commands List */}
              <div className="p-2 max-h-72 overflow-y-auto custom-scrollbar">
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((cmd) => (
                    <button
                      key={cmd.view}
                      onClick={() => handleViewChange(cmd.view)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <span className="flex items-center gap-2">
                        <Command className="w-3.5 h-3.5 text-white/40 group-hover:text-electric-blue" />
                        {cmd.label}
                      </span>
                      <kbd className="px-1.5 py-0.5 bg-white/5 group-hover:bg-white/10 rounded text-[10px] text-white/40">
                        Go to
                      </kbd>
                    </button>
                  ))
                ) : (
                  <p className="text-center text-xs text-white/30 py-6">No commands found matching &ldquo;{searchQuery}&rdquo;</p>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-white/5 bg-graphite/50 flex items-center justify-between text-[10px] text-white/30">
                <span>Use keyboard arrows or mouse to select</span>
                <span className="flex items-center gap-1"><Cpu className="w-3 h-3 text-[#8b5cf6]" /> AetherOS AI Orchestrator</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}