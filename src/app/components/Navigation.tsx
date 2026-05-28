import { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Activity,
  AlertCircle,
  Bot,
  TrendingUp,
  BarChart3,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onSearchClick: () => void;
}

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'infrastructure', label: 'Infrastructure', icon: Activity },
  { id: 'incidents', label: 'Incidents', icon: AlertCircle, badge: '3', badgeColor: 'bg-error text-white' },
  { id: 'agents', label: 'AI Agents', icon: Bot, badge: 'Active', badgeColor: 'bg-[#8b5cf6]/20 text-[#8b5cf6] border border-[#8b5cf6]/30' },
  { id: 'predictions', label: 'Predictions', icon: TrendingUp },
  { id: 'executive', label: 'Executive', icon: BarChart3 },
  { id: 'security', label: 'Security', icon: Shield, badge: 'Secure', badgeColor: 'bg-success/15 text-success border border-success/20' },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Navigation({
  activeView,
  onViewChange,
  isCollapsed,
  setIsCollapsed,
  onSearchClick
}: NavigationProps) {

  // Keyboard shortcut listener for Collapse toggle (Ctrl+B) and Search (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsCollapsed(!isCollapsed);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onSearchClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCollapsed, setIsCollapsed, onSearchClick]);

  // Keyboard navigation with arrow keys
  const navListRef = useRef<HTMLDivElement>(null);
  const handleNavKeyDown = (e: React.KeyboardEvent, index: number) => {
    const items = navListRef.current?.querySelectorAll('[role="tab"]');
    if (!items) return;
    let nextIndex = index;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (index + 1) % items.length;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (index - 1 + items.length) % items.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = items.length - 1;
    }
    if (nextIndex !== index) {
      (items[nextIndex] as HTMLElement).focus();
    }
  };

  return (
    <div
      role="navigation"
      aria-label="Main Navigation"
      className={`h-full bg-graphite border-r border-white/5 flex flex-col relative transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between min-h-[73px]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 bg-gradient-to-br from-electric-blue to-cyan rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
            <Activity className="w-4 h-4 text-white" />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col"
            >
              <span className="text-white font-bold text-sm tracking-tight truncate">AetherOS</span>
              <span className="text-[9px] text-electric-blue font-medium tracking-widest uppercase">Operations</span>
            </motion.div>
          )}
        </div>

        {/* Collapse toggle button */}
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 hover:bg-white/5 text-white/40 hover:text-white rounded border border-white/5 transition-colors cursor-pointer"
            title="Collapse Sidebar (Ctrl+B)"
            aria-label="Collapse navigation sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Input Trigger */}
      <div className="p-3">
        {isCollapsed ? (
          <button
            onClick={onSearchClick}
            className="w-full flex items-center justify-center py-2.5 bg-white/5 border border-white/5 rounded-lg text-white/50 hover:text-white hover:bg-white/8 transition-colors cursor-pointer"
            title="Search palette (Cmd+K)"
            aria-label="Open search palette"
          >
            <Search className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onSearchClick}
            className="w-full flex items-center gap-3 px-3 py-2 bg-white/5 border border-white/5 rounded-lg text-left text-xs text-white/40 hover:text-white/70 hover:bg-white/8 transition-all cursor-pointer"
            title="Search palette (Cmd+K)"
            aria-label="Open search palette"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="flex-1">Search...</span>
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[9px] font-mono border border-white/15">
              ⌘K
            </kbd>
          </button>
        )}
      </div>

      {/* Nav List */}
      <div ref={navListRef} className="flex-1 p-3 space-y-1.5 overflow-y-auto custom-scrollbar" role="tablist" aria-label="View navigation">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              onKeyDown={(e) => handleNavKeyDown(e, idx)}
              className="w-full group relative block text-left"
              role="tab"
              aria-selected={isActive}
              tabIndex={0}
              aria-label={`${item.label}${item.badge ? ` - ${item.badge}` : ''}`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-white/5 rounded-lg border border-electric-blue/30"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div
                className={`relative flex items-center rounded-lg transition-all ${
                  isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'
                } ${
                  isActive ? 'text-electric-blue' : 'text-white/60 hover:text-white/90 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-electric-blue' : ''}`} />
                
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs font-semibold flex-1 truncate"
                  >
                    {item.label}
                  </motion.span>
                )}

                {/* Badge rendering */}
                {item.badge && !isCollapsed && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}

                {/* Collapsed Badge Dot indicator */}
                {item.badge && isCollapsed && (
                  <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Profile area */}
      <div className="p-4 border-t border-white/5 flex flex-col gap-3">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-1 py-1'}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-electric-blue to-cyan flex items-center justify-center text-xs text-white font-bold flex-shrink-0 shadow-md">
            OI
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white font-semibold truncate leading-tight">Ops Intelligence</p>
              <p className="text-[10px] text-white/40 leading-none">Enterprise • v1.0 MVP</p>
            </div>
          )}
        </div>

        {/* Collapsed Expand Toggle */}
        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="mx-auto p-1.5 hover:bg-white/5 text-white/40 hover:text-white rounded border border-white/5 transition-colors cursor-pointer"
            aria-label="Expand navigation sidebar"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
