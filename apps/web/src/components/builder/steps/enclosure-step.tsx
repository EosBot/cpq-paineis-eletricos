'use client';

import { motion } from 'framer-motion';
import { useBuilderStore } from '@/store/builder';

const ENCLOSURES = [
  { id: 'wall-small', name: 'Parede Pequeno', widthMm: 400, heightMm: 300, depthMm: 150, ipRating: 'IP54', material: 'STEEL', price: 450 },
  { id: 'wall-medium', name: 'Parede Médio', widthMm: 600, heightMm: 400, depthMm: 200, ipRating: 'IP54', material: 'STEEL', price: 800 },
  { id: 'wall-large', name: 'Parede Grande', widthMm: 800, heightMm: 600, depthMm: 250, ipRating: 'IP55', material: 'STEEL', price: 1200 },
  { id: 'floor-medium', name: 'Piso Médio', widthMm: 1000, heightMm: 1800, depthMm: 500, ipRating: 'IP41', material: 'STEEL', price: 3500 },
  { id: 'floor-large', name: 'Piso Grande', widthMm: 1200, heightMm: 2000, depthMm: 600, ipRating: 'IP55', material: 'SS304', price: 6500 },
  { id: 'outdoor', name: 'Externo', widthMm: 800, heightMm: 800, depthMm: 300, ipRating: 'IP65', material: 'SS316', price: 4500 },
];

export function EnclosureStep() {
  const { enclosure, setEnclosure, nextStep, prevStep } = useBuilderStore();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Selecione o Invólucro</h2>
        <p className="mt-2 text-white/50">Escolha o tipo de gabinete adequado para sua aplicação</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {ENCLOSURES.map((enc, i) => (
          <motion.button
            key={enc.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setEnclosure({ id: enc.id, name: enc.name, widthMm: enc.widthMm, heightMm: enc.heightMm, depthMm: enc.depthMm, ipRating: enc.ipRating, material: enc.material as any })}
              className={`rounded-2xl border p-5 text-left transition-all ${
                enclosure?.id === enc.id
                  ? 'border-blue-500/50 bg-blue-500/10 shadow-xl shadow-blue-500/20'
                  : 'border-white/5 bg-white/[0.02] hover:border-white/10'
              }`}
            >
              <div className="flex h-24 items-center justify-center rounded-lg bg-gradient-to-br from-white/5 to-white/[0.02]">
                <svg viewBox="0 0 100 100" className="h-16 w-16" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="20" y="10" width="60" height="80" rx="4" className="text-white/30" />
                  <rect x="25" y="15" width="50" height="70" rx="2" className="text-blue-400/50" />
                  <line x1="25" y1="50" x2="75" y2="50" className="text-white/20" />
                  <line x1="50" y1="15" x2="50" y2="85" className="text-white/20" />
                </svg>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-white">{enc.name}</h3>
              <p className="mt-1 text-xs text-white/40">{enc.widthMm}×{enc.heightMm}×{enc.depthMm}mm</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">{enc.ipRating}</span>
                <span className="rounded bg-orange-500/20 px-1.5 py-0.5 text-[10px] font-medium text-orange-400">{enc.material}</span>
              </div>
              <p className="mt-2 text-sm font-bold text-emerald-400">R$ {enc.price.toLocaleString('pt-BR')}</p>
            </motion.button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={prevStep}
          className="rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white/70"
        >
          ← Voltar
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={nextStep}
          disabled={!enclosure}
          className="rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 disabled:opacity-50"
        >
          Próximo →
        </motion.button>
      </div>
    </div>
  );
}
