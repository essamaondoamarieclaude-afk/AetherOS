import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, Html } from '@react-three/drei';
import { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';
import { Activity, Server, Network, Shield, AlertTriangle, ShieldCheck, Compass, Info, X, Zap } from 'lucide-react';
import { Badge } from './ui/badge';

interface TopologyNode {
  id: number;
  name: string;
  position: [number, number, number];
  status: 'healthy' | 'degraded' | 'critical';
  connections: number[];
  traffic: number; // in req/sec
  cpu: number; // %
  memory: number; // %
  region: string;
}

const services: TopologyNode[] = [
  { id: 0, name: 'API-Gateway Ingress', position: [0, 2, 0], status: 'healthy', connections: [1, 2, 3, 10], traffic: 1200, cpu: 42, memory: 55, region: 'us-east-1' },
  { id: 1, name: 'Auth-Service Core', position: [-2.0, 1.2, 0.8], status: 'healthy', connections: [8], traffic: 950, cpu: 28, memory: 40, region: 'us-east-1' },
  { id: 2, name: 'Payment-API', position: [1.8, 1, -1], status: 'degraded', connections: [4], traffic: 320, cpu: 88, memory: 82, region: 'us-east-1' },
  { id: 3, name: 'Product-Catalog', position: [0.8, 0.8, 2.0], status: 'healthy', connections: [4], traffic: 600, cpu: 33, memory: 48, region: 'us-west-2' },
  { id: 4, name: 'Checkout-Orchestrator', position: [2.5, -0.4, 0.5], status: 'healthy', connections: [5, 8], traffic: 450, cpu: 51, memory: 60, region: 'us-east-1' },
  { id: 5, name: 'Shipping-Broker', position: [3, -1.8, -0.8], status: 'healthy', connections: [], traffic: 120, cpu: 18, memory: 35, region: 'eu-west-1' },
  { id: 6, name: 'Inventory-Worker', position: [-1.2, -0.6, -2.0], status: 'healthy', connections: [8, 7], traffic: 400, cpu: 25, memory: 39, region: 'us-west-2' },
  { id: 7, name: 'Redis Cache-Svc', position: [-0.8, -1.5, 0.8], status: 'healthy', connections: [], traffic: 1800, cpu: 45, memory: 68, region: 'us-east-1' },
  { id: 8, name: 'Postgres DB Primary', position: [0.5, -2.2, -0.5], status: 'healthy', connections: [], traffic: 850, cpu: 65, memory: 76, region: 'us-east-1' },
  { id: 9, name: 'Metrics Daemon', position: [-2.8, -1, 1.5], status: 'healthy', connections: [], traffic: 180, cpu: 12, memory: 28, region: 'us-west-2' },
  { id: 10, name: 'Elastic Search Node', position: [-2, 2.4, -1.5], status: 'healthy', connections: [7], traffic: 520, cpu: 55, memory: 70, region: 'us-west-2' },
  { id: 11, name: 'Notification-Hub', position: [1.5, 2.5, 1.8], status: 'healthy', connections: [8], traffic: 220, cpu: 20, memory: 32, region: 'eu-west-1' },
];

interface NodeProps {
  node: TopologyNode;
  isSelected: boolean;
  onSelect: (node: TopologyNode) => void;
  hoveredNode: TopologyNode | null;
  setHoveredNode: (node: TopologyNode | null) => void;
}

function ServiceNode({ node, isSelected, onSelect, hoveredNode, setHoveredNode }: NodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const color = useMemo(() => {
    switch (node.status) {
      case 'healthy': return '#22c55e';
      case 'degraded': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#0ea5e9';
    }
  }, [node.status]);

  // Adjust node scale slightly based on traffic volume
  const scale = useMemo(() => {
    const base = 0.14;
    if (node.traffic > 1000) return base * 1.35;
    if (node.traffic < 300) return base * 0.9;
    return base;
  }, [node.traffic]);

  const isHovered = hoveredNode?.id === node.id;

  return (
    <group position={node.position}>
      {/* Node Sphere */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredNode(node);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredNode(null);
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[scale, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered || isSelected ? 1.0 : 0.45}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Pulsing selection shell */}
      {(isSelected || isHovered) && (
        <mesh>
          <sphereGeometry args={[scale * 1.35, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.12} />
        </mesh>
      )}

      {/* HTML Scale-dependent Tag Label */}
      <Html distanceFactor={7} position={[0, scale + 0.2, 0]} center>
        <div className={`px-2 py-0.5 bg-[#0a0b0f]/85 backdrop-blur-md border rounded text-[9px] font-mono whitespace-nowrap pointer-events-none select-none transition-all ${
          isSelected ? 'border-[#0ea5e9] text-[#0ea5e9]' : 'border-white/10 text-white/70'
        }`}>
          {node.name}
        </div>
      </Html>
    </group>
  );
}

interface LineProps {
  start: [number, number, number];
  end: [number, number, number];
  status: string;
}

function ConnectionLine({ start, end, status }: LineProps) {
  const points = useMemo(() => [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end)
  ], [start, end]);

  const particleRef = useRef<THREE.Mesh>(null);
  const speed = useMemo(() => 0.25 + Math.random() * 0.2, []);

  // LERP moving flow particle along wire path
  useFrame((state) => {
    if (particleRef.current) {
      const time = state.clock.getElapsedTime();
      const progress = (time * speed) % 1.0;
      const currentPos = new THREE.Vector3().lerpVectors(points[0], points[1], progress);
      particleRef.current.position.copy(currentPos);
    }
  });

  const lineColor = status === 'degraded' ? '#f59e0b' : '#0ea5e9';

  return (
    <group>
      <Line
        points={points}
        color={lineColor}
        lineWidth={1.2}
        opacity={0.14}
        transparent
      />
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color={lineColor} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

interface SceneProps {
  selectedNode: TopologyNode | null;
  onSelect: (node: TopologyNode) => void;
  hoveredNode: TopologyNode | null;
  setHoveredNode: (node: TopologyNode | null) => void;
}

function Scene({ selectedNode, onSelect, hoveredNode, setHoveredNode }: SceneProps) {
  const ambientPosition = useMemo(() => {
    const arr = new Float32Array(250 * 3);
    for (let i = 0; i < 250 * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 15;
    }
    return arr;
  }, []);

  return (
    <>
      <ambientLight intensity={0.65} />
      <pointLight position={[8, 8, 8]} intensity={1.5} />

      {/* Service Nodes */}
      {services.map((node) => (
        <ServiceNode
          key={node.id}
          node={node}
          isSelected={selectedNode?.id === node.id}
          onSelect={onSelect}
          hoveredNode={hoveredNode}
          setHoveredNode={setHoveredNode}
        />
      ))}

      {/* Connection Wires */}
      {services.map((svc) =>
        svc.connections.map((connId) => {
          const target = services.find((s) => s.id === connId);
          if (!target) return null;
          return (
            <ConnectionLine
              key={`${svc.id}-${connId}`}
              start={svc.position}
              end={target.position}
              status={svc.status}
            />
          );
        })
      )}

      {/* Floating Network Dust Particle Field */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[ambientPosition, 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.03} color="#06b6d4" transparent opacity={0.25} sizeAttenuation />
      </points>

      <OrbitControls
        enableZoom={true}
        enablePan={true}
        autoRotate={!selectedNode}
        autoRotateSpeed={0.2}
        minDistance={2}
        maxDistance={8}
      />
    </>
  );
}

export function InfrastructureGalaxy() {
  const [selectedNode, setSelectedNode] = useState<TopologyNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<TopologyNode | null>(null);

  return (
    <div className="relative w-full h-full bg-[#0a0b0f] overflow-hidden select-none">
      
      {/* 3D WebGL Canvas */}
      <Canvas camera={{ position: [3, 2.5, 3], fov: 50 }}>
        <Scene
          selectedNode={selectedNode}
          onSelect={setSelectedNode}
          hoveredNode={hoveredNode}
          setHoveredNode={setHoveredNode}
        />
      </Canvas>

      {/* Topology Header overlay */}
      <div className="absolute top-6 left-6 pointer-events-none z-10 max-w-sm w-full">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#13151c]/80 backdrop-blur-xl rounded-xl p-4 border border-white/5 pointer-events-auto shadow-xl"
        >
          <div className="flex items-center gap-2 mb-2.5">
            <Network className="text-[#0ea5e9] w-4.5 h-4.5" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Service Topology Map</h2>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-[#0a0b0f]/50 p-2 rounded border border-white/5">
              <p className="text-[9px] text-white/40 uppercase font-bold">Services</p>
              <p className="text-base font-black text-white mt-0.5">{services.length}</p>
            </div>
            <div className="bg-[#0a0b0f]/50 p-2 rounded border border-white/5">
              <p className="text-[9px] text-white/40 uppercase font-bold">Healthy</p>
              <p className="text-base font-black text-success mt-0.5">
                {services.filter((s) => s.status === 'healthy').length}
              </p>
            </div>
            <div className="bg-[#0a0b0f]/50 p-2 rounded border border-white/5">
              <p className="text-[9px] text-white/40 uppercase font-bold">Degraded</p>
              <p className="text-base font-black text-warning mt-0.5">
                {services.filter((s) => s.status === 'degraded' || s.status === 'critical').length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Hover Tooltip */}
      <AnimatePresence>
        {hoveredNode && !selectedNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bottom-6 left-6 z-10 bg-slate-dark/90 backdrop-blur-md border border-white/10 rounded-lg p-3 max-w-xs shadow-xl pointer-events-none"
          >
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="text-xs font-bold text-white">{hoveredNode.name}</span>
              <Badge variant="outline" className={`text-[8px] px-1.5 py-0.2 rounded font-bold uppercase ${
                hoveredNode.status === 'healthy' ? 'border-success text-success bg-success/5' : 'border-warning text-warning bg-warning/5'
              }`}>
                {hoveredNode.status}
              </Badge>
            </div>
            <p className="text-[10px] text-white/50">Region: <code className="text-electric-blue font-mono">{hoveredNode.region}</code></p>
            <div className="flex items-center gap-3 mt-1 text-[10px]">
              <span className="text-white/50">Traffic: <span className="text-white font-semibold">{hoveredNode.traffic} req/s</span></span>
              <span className="text-white/50">CPU: <span className="text-white font-semibold">{hoveredNode.cpu}%</span></span>
              <span className="text-white/50">Mem: <span className="text-white font-semibold">{hoveredNode.memory}%</span></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selection Details Side Panel Overlay */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="absolute right-6 top-6 bottom-6 w-80 bg-[#13151c]/90 backdrop-blur-xl border border-white/8 rounded-xl p-5 shadow-2xl z-20 flex flex-col justify-between"
          >
            <div className="space-y-5">
              {/* Node panel title */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-[#0ea5e9]" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Service telemetry</span>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 hover:bg-white/5 text-white/40 hover:text-white rounded border border-white/5 cursor-pointer"
                  aria-label="Close details panel"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-white leading-tight">{selectedNode.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`w-2 h-2 rounded-full ${selectedNode.status === 'healthy' ? 'bg-success' : 'bg-warning'} animate-pulse`} />
                  <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Status:</span>
                  <Badge variant="outline" className={`text-[8px] font-extrabold uppercase ${
                    selectedNode.status === 'healthy' ? 'border-success text-success bg-success/5' : 'border-warning text-warning bg-warning/5'
                  }`}>
                    {selectedNode.status}
                  </Badge>
                </div>
              </div>

              <div className="bg-[#0a0b0f]/50 rounded-lg p-3 border border-white/5 space-y-3.5">
                <div>
                  <span className="text-[9px] uppercase font-bold text-white/30 tracking-widest block mb-1">Region</span>
                  <code className="text-[#0ea5e9] font-mono text-xs">{selectedNode.region}</code>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-white/30 tracking-widest block mb-1">Compute utilization</span>
                  <div className="flex items-center justify-between text-xs text-white/70 font-semibold mb-1">
                    <span>CPU: {selectedNode.cpu}%</span>
                    <span>Mem: {selectedNode.memory}%</span>
                  </div>
                  {/* CPU Progress Bar */}
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-1.5">
                    <div className="h-full bg-[#0ea5e9]" style={{ width: `${selectedNode.cpu}%` }} />
                  </div>
                  {/* Mem Progress Bar */}
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#8b5cf6]" style={{ width: `${selectedNode.memory}%` }} />
                  </div>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-white/30 tracking-widest block mb-1">Active requests rate</span>
                  <p className="text-sm font-extrabold text-white">{selectedNode.traffic.toLocaleString()} req/sec</p>
                </div>
              </div>

              {selectedNode.status === 'degraded' && (
                <div className="p-3.5 bg-warning/10 border border-warning/20 rounded-lg flex gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5 animate-bounce" />
                  <div className="text-[11px] leading-normal text-warning/90 font-medium">
                    <span className="font-bold">Gemini Recommendation:</span> Proactive self-healing connection scales advised to prevent imminent pool locks.
                  </div>
                </div>
              )}
            </div>

            {/* Footer action trigger */}
            <button
              onClick={() => setSelectedNode(null)}
              className="w-full py-2 bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] hover:from-[#06b6d4] hover:to-[#0ea5e9] text-white text-xs font-bold rounded-lg shadow-lg shadow-[#0ea5e9]/10 transition-all cursor-pointer text-center"
            >
              Close Details
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Galaxy Map Controls hint overlay */}
      {!selectedNode && (
        <div className="absolute bottom-6 right-6 pointer-events-none z-10">
          <div className="bg-[#13151c]/60 backdrop-blur-md rounded-lg px-3 py-1.5 border border-white/5 text-[10px] text-white/40 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>Drag mouse to orbit. Click node to inspect details.</span>
          </div>
        </div>
      )}

    </div>
  );
}
