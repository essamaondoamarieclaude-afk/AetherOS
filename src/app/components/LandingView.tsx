import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import { ArrowRight, Activity, Brain, Zap, Shield, TrendingUp, Database, Sparkles, BookOpen, Github, ChevronDown } from 'lucide-react';
import { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface NodeData {
  pos: [number, number, number];
  size: number;
  speed: number;
  phase: number;
  color: string;
  pulsePhase: number;
}

function InfrastructureNeuralNet() {
  const groupRef = useRef<THREE.Group>(null);
  const nodesCount = 32;

  const [nodes, connections] = useMemo(() => {
    const tempNodes: NodeData[] = [];
    const colors = ['#0ea5e9', '#06b6d4', '#8b5cf6', '#22c55e', '#f59e0b'];

    for (let i = 0; i < nodesCount; i++) {
      tempNodes.push({
        pos: [
          (Math.random() - 0.5) * 7,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6,
        ],
        size: Math.random() * 0.1 + 0.03,
        speed: Math.random() * 0.4 + 0.08,
        phase: Math.random() * Math.PI * 2,
        color: colors[i % colors.length],
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    const tempConnections: Array<[number, number]> = [];
    for (let i = 0; i < nodesCount; i++) {
      for (let j = i + 1; j < nodesCount; j++) {
        const dist = Math.hypot(
          tempNodes[i].pos[0] - tempNodes[j].pos[0],
          tempNodes[i].pos[1] - tempNodes[j].pos[1],
          tempNodes[i].pos[2] - tempNodes[j].pos[2]
        );
        if (dist < 3.5) {
          tempConnections.push([i, j]);
        }
      }
    }
    return [tempNodes, tempConnections];
  }, []);

  const nodesRefs = useRef<THREE.Mesh[]>([]);
  const glowRefs = useRef<THREE.Mesh[]>([]);
  const linesRef = useRef<THREE.LineSegments>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.025;
      groupRef.current.rotation.x = Math.sin(time * 0.008) * 0.08;
    }

    nodes.forEach((node, index) => {
      const mesh = nodesRefs.current[index];
      const glow = glowRefs.current[index];
      if (mesh) {
        const yOffset = Math.sin(time * node.speed + node.phase) * 0.25;
        const xOffset = Math.cos(time * (node.speed * 0.6) + node.phase) * 0.18;
        const zOffset = Math.sin(time * (node.speed * 0.3) + node.phase * 0.7) * 0.12;
        mesh.position.set(
          node.pos[0] + xOffset,
          node.pos[1] + yOffset,
          node.pos[2] + zOffset
        );
        const pulse = 0.5 + 0.5 * Math.sin(time * 0.8 + node.pulsePhase);
        (mesh.material as THREE.MeshBasicMaterial).opacity = 0.5 + pulse * 0.5;
      }
      if (glow) {
        glow.position.copy(mesh!.position);
        const pulse = 0.3 + 0.7 * Math.sin(time * 0.6 + node.pulsePhase);
        (glow.material as THREE.MeshBasicMaterial).opacity = pulse * 0.15;
      }
    });

    if (linesRef.current) {
      const positions = linesRef.current.geometry.attributes.position.array as Float32Array;
      let posIndex = 0;
      connections.forEach(([i, j]) => {
        const nodeA = nodesRefs.current[i];
        const nodeB = nodesRefs.current[j];
        if (nodeA && nodeB) {
          positions[posIndex++] = nodeA.position.x;
          positions[posIndex++] = nodeA.position.y;
          positions[posIndex++] = nodeA.position.z;
          positions[posIndex++] = nodeB.position.x;
          positions[posIndex++] = nodeB.position.y;
          positions[posIndex++] = nodeB.position.z;
        }
      });
      linesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const initialLinePositions = useMemo(() => {
    return new Float32Array(connections.length * 6);
  }, [connections]);

  const particlesPosition = useMemo(() => {
    const arr = new Float32Array(500 * 3);
    for (let i = 0; i < 500 * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 16;
    }
    return arr;
  }, []);

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <group key={i}>
          <mesh
            ref={(el) => {
              if (el) nodesRefs.current[i] = el;
            }}
            position={node.pos}
          >
            <sphereGeometry args={[node.size, 20, 20]} />
            <meshBasicMaterial color={node.color} transparent opacity={0.8} />
          </mesh>
          <mesh
            ref={(el) => {
              if (el) glowRefs.current[i] = el;
            }}
            position={node.pos}
          >
            <sphereGeometry args={[node.size * 2.5, 16, 16]} />
            <meshBasicMaterial color={node.color} transparent opacity={0.1} depthWrite={false} />
          </mesh>
        </group>
      ))}

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[initialLinePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#0ea5e9" opacity={0.12} transparent />
      </lineSegments>

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlesPosition, 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.02} color="#06b6d4" transparent opacity={0.2} sizeAttenuation />
      </points>
    </group>
  );
}

const partnerLogos = ['Dynatrace', 'Google Cloud', 'Gemini', 'Kubernetes', 'MongoDB'];

interface LandingViewProps {
  onEnter: () => void;
}

export function LandingView({ onEnter }: LandingViewProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const partnersRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.fromTo(navRef.current, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 });

    if (heroRef.current) {
      const children = Array.from(heroRef.current.children);
      tl.fromTo(
        children,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.2 },
        '-=0.5'
      );
    }

    if (partnersRef.current) {
      tl.fromTo(
        partnersRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 },
        '-=0.4'
      );
    }

    if (cardsRef.current) {
      tl.fromTo(
        cardsRef.current.children,
        { y: 30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.05 },
        '-=0.4'
      );
    }

    tl.fromTo(buttonRef.current, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }, '-=0.3');

    if (scrollIndicatorRef.current) {
      tl.fromTo(scrollIndicatorRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.2');
    }

    tl.fromTo(footerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.2');

    const scrollTimer = setTimeout(() => setShowScrollHint(false), 8000);
    return () => clearTimeout(scrollTimer);
  }, []);

  const handleEnter = () => {
    const tl = gsap.timeline({ onComplete: onEnter });
    tl.to(
      [navRef.current, heroRef.current, partnersRef.current, cardsRef.current, buttonRef.current, footerRef.current],
      { opacity: 0, y: -20, scale: 0.97, duration: 0.4, stagger: 0.03, ease: 'power3.in' }
    );
  };

  return (
    <div className="relative w-full h-full bg-graphite overflow-y-auto flex flex-col justify-between">
      {/* Cinematic animated mesh background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,_var(--tw-gradient-stops))] from-[#0ea5e9]/10 via-[#06b6d4]/4 via-graphite to-graphite pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_var(--tw-gradient-stops))] from-[#8b5cf6]/8 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-transparent via-[#0ea5e9]/2 to-transparent pointer-events-none" />

      {/* React Three Fiber canvas */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Canvas camera={{ position: [0, 0, 7], fov: 40 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 2]} intensity={1} />
          <InfrastructureNeuralNet />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
        </Canvas>
      </div>

      {/* Navigation Bar */}
      <header
        ref={navRef}
        className="relative z-10 w-full px-6 md:px-10 py-4 flex items-center justify-between border-b border-white/5 backdrop-blur-md bg-graphite/40"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-electric-blue to-cyan rounded-lg flex items-center justify-center shadow-lg shadow-electric-blue/15">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold tracking-tight text-base">AetherOS</h1>
            <p className="text-[9px] text-electric-blue font-medium tracking-widest uppercase">System Operations</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-xs text-white/50 hover:text-white transition-colors flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> Documentation
          </a>
          <a href="#" className="text-xs text-white/50 hover:text-white transition-colors flex items-center gap-1.5">
            <Github className="w-3.5 h-3.5" /> GitHub
          </a>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2 px-3 py-1 bg-success/10 border border-success/20 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] text-success font-medium">MCP Services Live</span>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-8 md:py-16 text-center max-w-6xl mx-auto w-full">
        <div ref={heroRef} className="max-w-3xl mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-electric-blue" />
            <span className="text-xs text-white/70 font-semibold tracking-wide">Autonomous AI Operational Intelligence</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white mb-4 tracking-tight leading-none bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">
            AetherOS
          </h2>
          <p className="text-base md:text-lg text-white/60 font-light max-w-xl mx-auto mb-2">
            The intelligent operational nervous system for next-generation enterprise clouds.
          </p>
          <p className="text-base md:text-lg text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-cyan to-purple font-semibold">
            Connecting telemetry to autonomous action.
          </p>
        </div>

        {/* Partner Logos */}
        <div ref={partnersRef} className="flex items-center gap-6 md:gap-10 mb-8 flex-wrap justify-center">
          {partnerLogos.map((partner) => (
            <span
              key={partner}
              className="text-[10px] md:text-xs text-white/25 font-semibold tracking-widest uppercase border border-white/5 px-3 py-1.5 rounded-full bg-white/[0.02]"
            >
              {partner}
            </span>
          ))}
        </div>

        {/* Feature Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 w-full max-w-4xl"
        >
          {[
            { icon: Brain, label: 'AI-Powered Analysis', desc: 'Gemini reasoning engine translates raw telemetry to root causes', color: 'from-electric-blue to-cyan' },
            { icon: Activity, label: 'Real-Time Telemetry', desc: 'Continuous stream integration with Dynatrace topology', color: 'from-cyan to-cyan-light' },
            { icon: Zap, label: 'Autonomous Response', desc: 'Agentic workflows execute diagnostic & self-healing rules', color: 'from-purple to-[#a78bfa]' },
            { icon: Shield, label: 'Security Intelligence', desc: 'Proactive correlation of threat timelines with alerts', color: 'from-success to-[#4ade80]' },
            { icon: TrendingUp, label: 'Predictive Forecasting', desc: 'Outage prevention using deep probability interval modeling', color: 'from-warning to-[#fbbf24]' },
            { icon: Database, label: 'Operational Memory', desc: 'Chronological learning system indexes incident solutions', color: 'from-purple to-purple/50' }
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.label}
                className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10 hover:border-white/20 transition-all hover:bg-white/[0.08] text-left group shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-md`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2 text-sm">{feature.label}</h3>
                  <p className="text-xs text-white/50 font-light leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enter Button */}
        <button
          ref={buttonRef}
          onClick={handleEnter}
          className="group px-8 py-4 bg-gradient-to-r from-electric-blue to-cyan hover:from-cyan hover:to-electric-blue rounded-lg text-white font-semibold inline-flex items-center gap-2.5 shadow-lg shadow-electric-blue/15 hover:shadow-electric-blue/30 transition-all cursor-pointer transform active:scale-95"
        >
          <span>Launch Dashboard</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </button>

        {/* Scroll Indicator */}
        {showScrollHint && (
          <div ref={scrollIndicatorRef} className="mt-8 flex flex-col items-center gap-1.5 text-white/20">
            <span className="text-[9px] font-medium tracking-widest uppercase">Scroll to explore</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        ref={footerRef}
        className="relative z-10 w-full py-5 text-center border-t border-white/5 backdrop-blur-md bg-graphite/20 flex flex-col sm:flex-row items-center justify-between px-6 md:px-10 gap-3"
      >
        <p className="text-[10px] text-white/30">
          © 2026 AetherOS Inc. All rights reserved. Registered under Partner Track.
        </p>
        <div className="flex items-center gap-3 text-[10px] text-white/30">
          <span>Powered by</span>
          <span className="text-white/60 font-semibold">Dynatrace MCP</span>
          <span>•</span>
          <span className="text-white/60 font-semibold">Google Cloud</span>
          <span>•</span>
          <span className="text-white/60 font-semibold">Gemini API</span>
        </div>
      </footer>
    </div>
  );
}
