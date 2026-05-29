/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import { Shield, Sparkles, Cpu, Activity } from 'lucide-react';

interface LandingScreenProps {
  onInitialize: () => void;
}

export default function LandingScreen({ onInitialize }: LandingScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Initialize starry connections nodes
    interface Point {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }

    const points: Point[] = Array.from({ length: 80 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw global space background gradient
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      gradient.addColorStop(0, '#131317');
      gradient.addColorStop(1, '#050508');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw faint background grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw points and lines
      ctx.fillStyle = 'rgba(0, 238, 252, 0.6)';
      ctx.strokeStyle = 'rgba(0, 238, 252, 0.08)';

      points.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 238, 252, ${p.opacity})`;
        ctx.fill();

        // Connect nearby points
        for (let j = idx + 1; j < points.length; j++) {
          const p2 = points[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-32 overflow-hidden bg-[#0A0A0B]">
      {/* Immersive star canvas base */}
      <div className="absolute inset-0 z-0">
        <canvas ref={canvasRef} className="w-full h-full block" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0A0B]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center text-center">
        {/* State Banner */}
        <div className="mb-6 inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/[0.03] border border-white/10 rounded-full select-none backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00dbe9] animate-pulse shadow-[0_0_8px_#00dbe9]"></span>
          <span className="font-mono text-xs text-[#00dbe9] uppercase tracking-widest font-medium">
            System Online: v4.2.0-Alpha
          </span>
        </div>

        {/* Hero Headline */}
        <h1 className="font-sans font-bold text-4xl md:text-7xl lg:text-[5.5rem] text-[#e4e2e4] max-w-5xl leading-tight md:leading-[1.05] mb-8 tracking-tight">
          Real-Time <span className="text-[#00dbe9] relative">Intelligence</span> for Modern Operations.
        </h1>

        <p className="font-sans text-base md:text-xl text-[#c7c6ca] max-w-2xl mb-12 font-light leading-relaxed">
          AetherOS monitors your entire infrastructure with AI, detecting issues before they impact customers and providing clear recommendations for resolution.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            onClick={onInitialize}
            className="px-10 py-4 bg-[#00eefc] text-[#00363a] font-sans font-bold text-base uppercase tracking-wider rounded-xl hover:shadow-[0_0_30px_rgba(0,238,252,0.45)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
          >
            Open Command Center
          </button>
          <button
            onClick={onInitialize}
            className="px-10 py-4 border border-white/20 bg-white/[0.03] text-[#e4e2e4] font-sans font-semibold text-base uppercase tracking-wider rounded-xl hover:bg-white/[0.08] transition-all cursor-pointer"
          >
            View System Status
          </button>
        </div>

        {/* Live floating HUD panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full text-left">
          {/* Node Alpha Card */}
          <div className="bg-[#0e0e10]/40 backdrop-blur-xl p-6 rounded-2xl border-t border-l border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-start mb-4">
              <span className="font-mono text-xs text-[#c7c6ca] font-medium tracking-wider uppercase">SYSTEM_HEALTH</span>
              <Activity className="text-[#00eefc] w-4 h-4 animate-pulse" />
            </div>
            <div className="font-mono text-3xl font-semibold text-[#c8c6c7] mb-2">98.4%</div>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
              <div className="bg-[#00eefc] h-full w-[98.4%]" />
            </div>
            <div className="mt-4 font-mono text-[10px] text-[#c7c6ca]/50 uppercase tracking-wider">
              Overall System Health
            </div>
          </div>

          {/* Cognitive Agent Card */}
          <div className="bg-[#0e0e10]/40 backdrop-blur-xl p-6 rounded-2xl border border-[#00dbe9]/20 shadow-[0_0_20px_-5px_rgba(0,219,233,0.2)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00eefc]/[0.015] rounded-full blur-2xl pointer-events-none" />
            <div className="flex justify-between items-start mb-4">
              <span className="font-mono text-xs text-[#c7c6ca] font-medium tracking-wider uppercase">AI_PROCESSING</span>
              <Sparkles className="text-[#a4c8ff] w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div className="font-mono text-3xl font-bold text-[#a4c8ff] mb-2">ACTIVE</div>
            <div className="flex gap-1 h-8 items-end">
              <div className="w-1.5 bg-[#a4c8ff]/20 h-4 rounded-sm" />
              <div className="w-1.5 bg-[#a4c8ff]/40 h-6 rounded-sm animate-pulse" />
              <div className="w-1.5 bg-[#a4c8ff] h-8 rounded-sm" />
              <div className="w-1.5 bg-[#a4c8ff]/60 h-5 rounded-sm animate-bounce" />
              <div className="w-1.5 bg-[#a4c8ff]/30 h-4 rounded-sm" />
            </div>
            <div className="mt-4 font-mono text-[10px] text-[#c7c6ca]/50 uppercase tracking-wider">
              Active AI Analysis Threads
            </div>
          </div>

          {/* Secure Perimeter Card */}
          <div className="bg-[#0e0e10]/40 backdrop-blur-xl p-6 rounded-2xl border-t border-l border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-start mb-4">
              <span className="font-mono text-xs text-[#c7c6ca] font-medium tracking-wider uppercase">SECURITY_STATUS</span>
              <Shield className="text-emerald-400 w-4 h-4" />
            </div>
            <div className="font-mono text-3xl font-semibold text-[#c8c6c7] mb-2">SECURE</div>
            <div className="text-[10px] font-mono text-emerald-400 font-medium tracking-wider uppercase">
              ALL SYSTEMS SECURE
            </div>
            <div className="mt-4 w-full bg-emerald-500/10 text-emerald-400 text-[10px] p-2 border border-emerald-500/20 rounded font-mono">
              ENCRYPTION VERIFIED
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
