'use client';

import { motion } from 'framer-motion';
import { useBuilderStore } from '@/store/builder';

export function PricingSidebar() {
  const { placements, pricing, nextStep, currentStep } = useBuilderStore();

  return (
    <aside className="flex w-80 shrink-0 flex-col border-l border-white/5 bg-[#0d0d14]">
      {/* Live Preview Header */}
      <div className="border-b border-white/5 p-4">
        <h3 className="text-sm font-semibold text-white/90">Resumo em Tempo Real</h3>
        <p className="mt-1 text-xs text-white/40">{placements.length} componentes</p>
      </div>

      {/* Component List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {placements.length === 0 ? (
            <p className="text-center text-xs text-white/30 py-8">
              Adicione componentes para ver o resumo
            </p>
          ) : (
            placements.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-lg border border-white/5 bg-white/[0.02] p-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-white/80">{p.brand}</p>
                    <p className="text-[10px] text-white/40">{p.model}</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400">
                    R$ {p.unitPrice.toFixed(2)}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Pricing Footer */}
      {pricing && (
        <div className="border-t border-white/5 p-4 space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Componentes</span>
              <span className="text-white/80">R$ {pricing.componentCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Mão de Obra ({pricing.laborHours}h)</span>
              <span className="text-white/80">R$ {pricing.laborCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Overhead (15%)</span>
              <span className="text-white/80">R$ {pricing.overhead.toFixed(2)}</span>
            </div>
            <div className="border-t border-white/5 pt-2">
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-white">Total</span>
                <motion.span
                  key={pricing.total}
                  initial={{ scale: 1.2, color: '#4ade80' }}
                  animate={{ scale: 1, color: '#ffffff' }}
                  className="text-lg font-bold text-emerald-400"
                >
                  R$ {pricing.total.toFixed(2)}
                </motion.span>
              </div>
            </div>
          </div>

          {currentStep === 'REVIEW' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all"
            >
              Adicionar ao Carrinho
            </motion.button>
          )}
        </div>
      )}
    </aside>
  );
}
