'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBuilderStore } from '@/store/builder';

const CIRCUIT_PRESETS = [
  { name: 'M1 - Bomba Principal', type: 'POWER', voltage: '380V', color: '#ef4444' },
  { name: 'M2 - Bomba Reserva', type: 'POWER', voltage: '380V', color: '#3b82f6' },
  { name: 'M3 - Ventilador', type: 'POWER', voltage: '380V', color: '#22c55e' },
  { name: 'M4 - Compressor', type: 'POWER', voltage: '380V', color: '#f59e0b' },
  { name: 'Iluminação', type: 'POWER', voltage: '220V', color: '#8b5cf6' },
  { name: 'Tomadas 127V', type: 'POWER', voltage: '127V', color: '#06b6d4' },
  { name: 'Automação', type: 'CONTROL', voltage: '24VDC', color: '#ec4899' },
];

export function CircuitsStep() {
  const { circuits, addCircuit, removeCircuit, nextStep, prevStep } = useBuilderStore();
  const [customName, setCustomName] = useState('');

  const handleAddPreset = (preset: typeof CIRCUIT_PRESETS[0]) => {
    addCircuit({
      id: `circuit-${Date.now()}`,
      name: preset.name,
      type: preset.type as 'POWER' | 'CONTROL',
      voltage: preset.voltage,
      color: preset.color,
    });
  };

  const handleAddCustom = () => {
    if (!customName.trim()) return;
    addCircuit({
      id: `circuit-${Date.now()}`,
      name: customName,
      type: 'POWER',
      voltage: '380V',
      color: '#6b7280',
    });
    setCustomName('');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Defina os Circuitos</h2>
        <p className="mt-2 text-white/50">Cada circuito representa um ramo elétrico do painel</p>
      </div>

      {/* Presets */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-white/70">Circuitos Predefinidos</label>
        <div className="flex flex-wrap gap-2">
          {CIRCUIT_PRESETS.map((preset) => (
            <motion.button
              key={preset.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAddPreset(preset)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 transition-all hover:border-white/20 hover:bg-white/10"
            >
              + {preset.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Custom Circuit */}
      <div className="flex gap-2">
        <input
          type="text"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          placeholder="Nome do circuito personalizado"
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/30 focus:border-blue-500/50 focus:outline-none"
        />
        <button
          onClick={handleAddCustom}
          className="rounded-lg bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-400 transition-all hover:bg-blue-500/30"
        >
          Adicionar
        </button>
      </div>

      {/* Circuit List */}
      <div className="space-y-2">
        <AnimatePresence>
          {circuits.map((circuit, i) => (
            <motion.div
              key={circuit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: circuit.color }} />
                <span className="text-sm text-white/80">{circuit.name}</span>
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/40">{circuit.voltage}</span>
              </div>
              <button
                onClick={() => removeCircuit(circuit.id)}
                className="text-white/30 hover:text-red-400"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {circuits.length === 0 && (
          <p className="py-8 text-center text-sm text-white/30">Nenhum circuito adicionado</p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button onClick={prevStep} className="rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white/70">
          ← Voltar
        </button>
        <button onClick={nextStep} className="rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20">
          Próximo →
        </button>
      </div>
    </div>
  );
}
