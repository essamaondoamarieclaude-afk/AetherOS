/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  TrendingUp, 
  DollarSign, 
  Award, 
  Globe, 
  Map, 
  RefreshCw, 
  CheckCircle2, 
  Flame, 
  FileText,
  Shield,
  Sparkles
} from 'lucide-react';

export default function ExecutiveScreen() {
  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-2 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#00eefc] animate-pulse shadow-[0_0_8px_#00eefc]" />
            <span className="font-mono text-xs text-[#00eefc] uppercase tracking-widest font-semibold">
              Executive Dashboard | Overview
            </span>
          </div>
          <h2 className="font-sans font-bold text-2xl md:text-3xl text-white tracking-tight uppercase">
            Executive Overview
          </h2>
        </div>

        <div className="flex gap-4">
          <div className="px-4 py-2 bg-[#1f1f21] rounded-xl border border-white/5 flex items-center gap-3 font-mono text-xs">
            <span className="text-[#c7c6ca]/40 uppercase font-bold text-[10px]">Reporting Period</span>
            <span className="text-white font-bold">Q4-2024.12</span>
          </div>
          <button className="bg-white/[0.03] border border-white/10 text-white rounded-xl p-2 px-3 hover:bg-white/[0.08] transition-colors cursor-pointer select-none">
            <RefreshCw className="w-4.5 h-4.5" />
          </button>
        </div>
      </header>

      {/* Grid structure */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-auto md:auto-rows-[180px]">
        {/* Gemini Executive Advisory Summary */}
        <section className="md:col-span-8 md:row-span-2 bg-[#131315]/70 backdrop-blur-3xl p-8 rounded-2xl border border-[#00dbe9]/20 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          {/* Animated specular highlight bar */}
          <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00eefc]/50 to-transparent animate-pulse" />

          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="text-[#00eefc] w-5 h-5 animate-pulse" />
              <h3 className="font-sans font-bold text-base text-white uppercase tracking-wider">
                AI Strategy Summary
              </h3>
            </div>
            <span className="font-mono text-[8.5px] text-[#00eefc] border border-[#00eefc]/30 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              AI Analysis Engine
            </span>
          </div>

          <div className="space-y-4 flex-1 flex flex-col justify-center">
            <p className="font-sans text-sm md:text-base text-white/90 font-light leading-relaxed border-l-2 border-[#00eefc] pl-5 italic">
              "System efficiency has declined by 12% this period, primarily due to increased database load in the EU region. We recommend adding capacity to the Frankfurt data center to protect the projected $2.4M revenue at risk."
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5">
            <div>
              <span className="font-mono text-[9px] text-[#c7c6ca]/40 uppercase tracking-widest font-bold block mb-1">Observed Signal</span>
              <p className="font-sans text-xs text-[#c7c6ca]">Increased latency detected in the EU data center, likely due to higher than normal traffic volume.</p>
            </div>
            <div>
              <span className="font-mono text-[9px] text-[#c7c6ca]/40 uppercase tracking-widest font-bold block mb-1">Recommended Action</span>
              <p className="font-sans text-xs text-[#c7c6ca]">Scale up EU data center capacity and review traffic routing rules to balance load across regions.</p>
            </div>
          </div>
        </section>

        {/* Operational Risk Meter (SRE Gauge) */}
        <section className="md:col-span-4 md:row-span-2 bg-[#131315]/70 backdrop-blur-3xl p-8 rounded-2xl border-t border-l border-white/10 shadow-2xl flex flex-col items-center justify-center text-center">
          <span className="font-mono text-[10px] text-[#c7c6ca]/50 uppercase tracking-widest block font-bold mb-4">
            Security Risk Score
          </span>

          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle className="text-white/5" cx="80" cy="80" fill="transparent" r="72" stroke="currentColor" strokeWidth="3" />
              <circle className="text-[#00eefc] transition-all duration-1000" cx="80" cy="80" fill="transparent" r="72" stroke="currentColor" strokeDasharray="452" strokeDashoffset="80" strokeWidth="6" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-sans text-5xl font-bold text-white tracking-widest leading-none">82</span>
              <span className="font-mono text-[9px] text-[#c7c6ca]/50 uppercase mt-1 font-bold">/ 100 max</span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00eefc]/5 border border-[#00eefc]/15 rounded-full">
            <TrendingUp className="text-[#00eefc] w-3.5 h-3.5 animate-pulse" />
            <span className="font-mono text-[9.5px] text-[#00eefc] font-bold uppercase tracking-wider">
              Improving (+2.4% vs last period)
            </span>
          </div>
        </section>

        {/* Capital At Risk panel */}
        <section className="md:col-span-5 md:row-span-1 bg-[#131315]/70 backdrop-blur-3xl p-6 rounded-2xl border-t border-l border-white/10 shadow-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-[#c7c6ca]/40 uppercase tracking-widest font-bold">Financial Risk</span>
              <h3 className="font-sans font-bold text-sm text-[#e4e2e4] mt-0.5 uppercase tracking-wide">Revenue at Risk</h3>
            </div>
            <DollarSign className="text-red-400 w-5 h-5 animate-pulse" />
          </div>

          <div className="flex items-baseline gap-2.5 my-3">
            <span className="font-mono text-3xl font-bold text-red-400 tracking-wider">$2.4M</span>
            <span className="font-mono text-[10px] text-[#c7c6ca]/40 uppercase">Projected revenue impact</span>
          </div>

          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="bg-red-400 h-full w-[35%]" />
          </div>
        </section>

        {/* SLA Tracker panel */}
        <section className="md:col-span-4 md:row-span-1 bg-[#131315]/70 backdrop-blur-3xl p-6 rounded-2xl border-l-4 border-[#00eefc] shadow-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-[#c7c6ca]/40 uppercase tracking-widest font-bold">Service Level</span>
              <h3 className="font-sans font-bold text-sm text-[#e4e2e4] mt-0.5 uppercase tracking-wide">Service Reliability</h3>
            </div>
            <Award className="text-[#00eefc] w-5 h-5" />
          </div>

          <div className="flex items-baseline gap-2.5 my-3">
            <span className="font-mono text-3xl font-bold text-[#00eefc] tracking-wider">99.98%</span>
            <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Exceeding Target</span>
          </div>

          <div className="flex gap-1.5">
            <div className="h-1 flex-1 bg-[#00eefc] rounded-full" />
            <div className="h-1 flex-1 bg-[#00eefc] rounded-full" />
            <div className="h-1 flex-1 bg-[#00eefc] rounded-full" />
            <div className="h-1 flex-1 bg-[#00eefc] rounded-full animate-pulse" />
            <div className="h-1 flex-1 bg-white/10 rounded-full" />
          </div>
        </section>

        {/* Uptime Trend Widget */}
        <section className="md:col-span-3 md:row-span-1 bg-[#131315]/70 backdrop-blur-3xl p-6 rounded-2xl border-t border-l border-white/10 shadow-2xl flex flex-col justify-between">
          <div className="flex flex-col">
            <span className="font-mono text-[9px] text-[#c7c6ca]/40 uppercase tracking-widest font-bold">System Nodes</span>
            <h3 className="font-sans font-bold text-sm text-[#e4e2e4] mt-0.5 uppercase tracking-wide">System Health</h3>
          </div>

          <div className="flex items-end gap-1.5 h-12 pt-2">
            <div className="w-2.5 bg-[#00eefc]/20 h-4 rounded-sm border-t border-[#00eefc]/25" />
            <div className="w-2.5 bg-[#00eefc]/40 h-8 rounded-sm border-t border-[#00eefc]/30 animate-pulse" />
            <div className="w-2.5 bg-[#00eefc]/60 h-6 rounded-sm border-t border-[#00eefc]/40" />
            <div className="w-2.5 bg-[#00eefc]/80 h-10 rounded-sm border-t border-[#00eefc]/50" />
            <div className="w-2.5 bg-[#00eefc] h-12 rounded-sm" />
            <div className="w-2.5 bg-[#00eefc]/70 h-9 rounded-sm" />
            <div className="w-2.5 bg-[#00eefc]/50 h-7 rounded-sm" />
          </div>
        </section>

        {/* Satellite Node map (Bottom rows span) */}
        <section className="md:col-span-12 md:row-span-2 bg-[#131315]/40 rounded-2xl overflow-hidden relative group shadow-2xl">
          <div className="absolute top-8 left-8 z-10 pointer-events-none">
            <h3 className="font-sans font-bold text-white text-base uppercase tracking-wider">Global Infrastructure Map</h3>
            <span className="font-mono text-[9.5px]/none text-[#c7c6ca]/50 uppercase tracking-widest mt-1 block font-semibold">
              Infrastructure Deployment Density
            </span>
          </div>

          <div className="absolute top-8 right-8 z-10 flex flex-col gap-2">
            <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00eefc]" />
              <span className="font-mono text-[9px] text-[#e4e2e4] uppercase font-bold">Stable</span>
            </div>
            <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="font-mono text-[9px] text-[#e4e2e4] uppercase font-bold">Degraded</span>
            </div>
          </div>

          {/* High-contrast satellite satellite image backdrop */}
          <div className="w-full h-full opacity-40 group-hover:opacity-60 transition-opacity duration-700 select-none">
            <img 
              alt="Global Satellite Network View" 
              className="w-full h-full object-cover grayscale brightness-75 contrast-125" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtEtng74UfifzwULe2IDB9i7otPriMoM5dXbk5nDIWYJjGETDrjlo8M39cZHNg7jBEcca6aJEbA6MDL2VJ-mJhL6-JZfthhkhjBLH2BVqNogX-uPGvGJNcF1kAIMg0QDkfwnqMOkCHdzhpCK5sjNDnAvj3WViIMEKxMMMwcSWW7eM0KQZYZZVvAVpEY2UyOrqxbd1zrFgVpXO2h3BkDSW6FPamgNOmdVDee1PFMvnL0qXzUAMUj9DlDJwO4dpNtyEnjbkgiLd9VdIq" 
            />
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#0A0A0B] to-transparent pointer-events-none" />
        </section>
      </div>
    </div>
  );
}
