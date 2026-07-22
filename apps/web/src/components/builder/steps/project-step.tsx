'use client';

import { motion } from 'framer-motion';
import { useBuilderStore, PanelType } from '@/store/builder';

const PANEL_TYPES: { id: PanelType; label: string; desc: string; icon: string }[] = [
  { id: 'CCM', label: 'CCM', desc: 'Centro de Controle de Motores', icon: '⚡' },
  { id: 'QGBT', label: 'QGBT', desc: 'Quadro Geral de Baixa Tensão', icon: '🔌' },
  { id: 'CCMI', label: 'CCMI', desc: 'CCM com Inversores', icon: '🔄' },
  { id: 'AUTOMACAO', label: 'Automação', desc: 'Painel de Automação com CLP', icon: '🖥️' },
  { id: 'DISTRIBUICAO', label: 'Distribuição', desc: 'Quadro de Distribuição', icon: '📦' },
];

export function ProjectStep() {
  const { project, setProject, nextStep, catalog, catalogCategories, regions, setCatalog, setCatalogCategories, setRegions } = useBuilderStore();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Novo Projeto de Painel</h2>
        <p className="mt-2 text-white/50">Configure as especificações básicas do seu painel elétrico</p>
      </div>

      {/* Project Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/70">Nome do Projeto</label>
        <input
          type="text"
          value={project.name}
          onChange={(e) => setProject({ name: e.target.value })}
          placeholder="Ex: CCM Linha de Produção A"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {/* Panel Type */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-white/70">Tipo de Painel</label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PANEL_TYPES.map((type, i) => (
            <motion.button
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setProject({ panelType: type.id })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`rounded-xl border p-4 text-left transition-all ${
                project.panelType === type.id
                  ? 'border-blue-500/50 bg-blue-500/10 shadow-lg shadow-blue-500/10'
                  : 'border-white/5 bg-white/[0.02] hover:border-white/10'
              }`}
            >
              <span className="text-2xl">{type.icon}</span>
              <p className="mt-2 text-sm font-semibold text-white">{type.label}</p>
              <p className="text-xs text-white/40">{type.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Region & Voltage */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Estado (UF)</label>
          <select
            value={project.stateCode}
            onChange={(e) => setProject({ stateCode: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-blue-500/50 focus:outline-none"
          >
            {regions.map((r: any) => (
              <option key={r.stateCode} value={r.stateCode} className="bg-[#1a1a2e]">
                {r.stateName} ({r.stateCode})
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Tensão de Alimentação</label>
          <select
            value={project.supplyVoltage}
            onChange={(e) => setProject({ supplyVoltage: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-blue-500/50 focus:outline-none"
          >
            <option value="380V" className="bg-[#1a1a2e]">380V (3F)</option>
            <option value="220V" className="bg-[#1a1a2e]">220V (3F)</option>
            <option value="220V-127V" className="bg-[#1a1a2e]">220/127V (3F+N)</option>
          </select>
        </div>
      </div>

      {/* Environmental */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Ambiente</label>
          <div className="flex gap-2">
            {['INDOOR', 'OUTDOOR'].map((env) => (
              <button
                key={env}
                onClick={() => setProject({ indoorOutdoor: env as 'INDOOR' | 'OUTDOOR' })}
                className={`flex-1 rounded-lg border py-2 text-xs font-medium transition-all ${
                  project.indoorOutdoor === env
                    ? 'border-blue-500/50 bg-blue-500/10 text-blue-400'
                    : 'border-white/5 text-white/40 hover:text-white/60'
                }`}
              >
                {env === 'INDOOR' ? 'Interno' : 'Externo'}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Temp. Ambiente (°C)</label>
          <input
            type="number"
            value={project.ambientTempC}
            onChange={(e) => setProject({ ambientTempC: parseInt(e.target.value) || 25 })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-blue-500/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={nextStep}
          disabled={!project.name}
          className="rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 disabled:opacity-50"
        >
          Próximo →
        </motion.button>
      </div>
    </div>
  );
}
