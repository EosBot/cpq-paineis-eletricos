'use client';

import { motion } from 'framer-motion';
import { useBuilderStore } from '@/store/builder';

export function ReviewStep() {
  const { project, enclosure, rails, circuits, placements, pricing, prevStep } = useBuilderStore();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Revisão Final</h2>
        <p className="mt-2 text-white/50">Confira todos os detalhes do seu painel antes de finalizar</p>
      </div>

      {/* Project Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-white/70">Projeto</h3>
          <dl className="mt-3 space-y-2">
            <div className="flex justify-between">
              <dt className="text-xs text-white/40">Nome</dt>
              <dd className="text-xs text-white/80">{project.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-xs text-white/40">Tipo</dt>
              <dd className="text-xs text-white/80">{project.panelType}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-xs text-white/40">Tensão</dt>
              <dd className="text-xs text-white/80">{project.supplyVoltage} {project.supplyPhases}F</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-xs text-white/40">Ambiente</dt>
              <dd className="text-xs text-white/80">{project.indoorOutdoor === 'INDOOR' ? 'Interno' : 'Externo'}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-white/70">Invólucro</h3>
          {enclosure ? (
            <dl className="mt-3 space-y-2">
              <div className="flex justify-between">
                <dt className="text-xs text-white/40">Modelo</dt>
                <dd className="text-xs text-white/80">{enclosure.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-xs text-white/40">Dimensões</dt>
                <dd className="text-xs text-white/80">{enclosure.widthMm}×{enclosure.heightMm}×{enclosure.depthMm}mm</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-xs text-white/40">IP</dt>
                <dd className="text-xs text-white/80">{enclosure.ipRating}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-xs text-white/40">Material</dt>
                <dd className="text-xs text-white/80">{enclosure.material}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-3 text-xs text-white/30">Não selecionado</p>
          )}
        </div>
      </div>

      {/* Components Summary */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
        <h3 className="text-sm font-semibold text-white/70">Componentes ({placements.length})</h3>
        <div className="mt-3 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-400">{rails.length}</p>
            <p className="text-xs text-white/40">Trilhos</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-400">{circuits.length}</p>
            <p className="text-xs text-white/40">Circuitos</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-400">{placements.length}</p>
            <p className="text-xs text-white/40">Componentes</p>
          </div>
        </div>
      </div>

      {/* Pricing */}
      {pricing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5"
        >
          <h3 className="text-sm font-semibold text-emerald-400">Precificação</h3>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Componentes</span>
              <span className="text-white/80">R$ {pricing.componentCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Mão de Obra ({pricing.laborHours}h × R${pricing.laborRate})</span>
              <span className="text-white/80">R$ {pricing.laborCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Overhead (15%)</span>
              <span className="text-white/80">R$ {pricing.overhead.toFixed(2)}</span>
            </div>
            <div className="border-t border-white/10 pt-2">
              <div className="flex justify-between">
                <span className="text-base font-semibold text-white">Total</span>
                <motion.span
                  key={pricing.total}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  className="text-xl font-bold text-emerald-400"
                >
                  R$ {pricing.total.toFixed(2)}
                </motion.span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button onClick={prevStep} className="rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white/70">
          ← Voltar
        </button>
      </div>
    </div>
  );
}
