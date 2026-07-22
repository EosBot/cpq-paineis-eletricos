'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useBuilderStore } from '@/store/builder';
import { motion } from 'framer-motion';

function PanelModel() {
  const { enclosure, rails, placements } = useBuilderStore();

  if (!enclosure) return null;

  const scale = 0.012;
  const w = enclosure.widthMm * scale;
  const h = enclosure.heightMm * scale;
  const d = enclosure.depthMm * scale;

  return (
    <group>
      {/* Enclosure body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Enclosure frame */}
      <mesh position={[0, 0, d / 2 + 0.01]}>
        <boxGeometry args={[w - 0.05, h - 0.05, 0.02]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.5} transparent opacity={0.8} />
      </mesh>

      {/* DIN Rails */}
      {rails.map((rail, idx) => {
        const railY = (idx - (rails.length - 1) / 2) * (h / 4);
        return (
          <mesh key={rail.id} position={[0, railY, d / 2 - 0.02]}>
            <boxGeometry args={[w * 0.85, 0.015, 0.02]} />
            <meshStandardMaterial color="#a16207" metalness={0.8} roughness={0.3} />
          </mesh>
        );
      })}

      {/* Components on rails */}
      {rails.map((rail, railIdx) => {
        const railY = (railIdx - (rails.length - 1) / 2) * (h / 4);
        const railPlacements = placements.filter((p) => p.railId === rail.id);

        return railPlacements.map((placement, pIdx) => {
          const componentWidth = placement.moduleWidth * 18 * scale * 0.9;
          const startX = -(w * 0.85) / 2;
          const placementX = startX + placement.positionMm * scale + componentWidth / 2;
          const componentHeight = railIdx === 0 ? 0.06 : railIdx === 1 ? 0.04 : 0.025;

          const colors = ['#3b82f6', '#ef4444', '#22c55e', '#f97316', '#8b5cf6', '#eab308'];
          const color = colors[(railIdx + pIdx) % colors.length];

          return (
            <group key={placement.id}>
              <mesh position={[placementX, railY, d / 2 - 0.02 - componentHeight / 2 - 0.005]}>
                <boxGeometry args={[componentWidth, componentHeight, 0.04]} />
                <meshStandardMaterial color={color} metalness={0.4} roughness={0.6} />
              </mesh>
              {/* Brand dot indicator */}
              <mesh position={[placementX, railY + componentHeight / 2 + 0.005, d / 2 - 0.02 - 0.005]}>
                <sphereGeometry args={[0.005, 8, 8]} />
                <meshStandardMaterial color="#1e293b" />
              </mesh>
            </group>
          );
        });
      })}
    </group>
  );
}

export function PanelViewer3D() {
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-lg bg-gradient-to-br from-slate-900 to-slate-800">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 3]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-3, 2, 4]} intensity={0.5} />
        <PanelModel />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={1.5}
          maxDistance={5}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Interaction hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-[10px] text-white backdrop-blur-sm">
        Arraste para girar · Scroll para zoom
      </div>
    </div>
  );
}
