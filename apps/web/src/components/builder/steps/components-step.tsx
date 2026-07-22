'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBuilderStore } from '@/store/builder';

export function ComponentsStep() {
  const { catalog, placements, addPlacement, removePlacement, rails, nextStep, prevStep, setPricing, pricing } = useBuilderStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedRailId, setSelectedRailId] = useState<string>('');

  const filteredCatalog = selectedCategory
    ? catalog.filter((c) => c.componentCategory.code === selectedCategory)
    : catalog;

  const handleAddToRail = (component: any) => {
    if (!selectedRailId) return;
    const rail = rails.find((r) => r.id === selectedRailId);
    if (!rail || rail.usedModules + component.moduleWidth > rail.moduleCapacity) return;

    addPlacement({
      id: `placement-${Date.now()}`,
      componentId: component.id,
      railId: selectedRailId,
      positionMm: rail.usedModules * 18,
      moduleWidth: component.moduleWidth,
      circuitId: null,
      brand: component.brand || '',
      model: component.name,
      unitPrice: component.typicalPrice?.toNumber() || 0,
      category: component.componentCategory.code,
    });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Adicione Componentes</h2>
        <p className="mt-2 text-white/50">Selecione o trilho e adicione componentes do catálogo</p>
      </div>

      {/* Rail Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/70">Trilho Alvo</label>
        <div className="flex gap-2">
          {rails.map((rail) => (
            <button
              key={rail.id}
              onClick={() => setSelectedRailId(rail.id)}
              className={`rounded-lg border px-4 py-2 text-sm transition-all ${
                selectedRailId === rail.id
                  ? 'border-blue-500/50 bg-blue-500/10 text-blue-400'
                  : 'border-white/5 text-white/50'
              }`}
            >
              {rail.label || `Trilho ${rails.indexOf(rail) + 1}`}
              <span className="ml-2 text-xs text-white/30">
                {rail.usedModules}/{rail.moduleCapacity}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto">
        <button
          onClick={() => setSelectedCategory('')}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
            !selectedCategory ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white/40'
          }`}
        >
          Todos
        </button>
        {Array.from(new Set(catalog.map((c) => c.componentCategory.code))).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
              selectedCategory === cat ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Component Grid */}
      <div className="grid max-h-64 grid-cols-2 gap-2 overflow-y-auto lg:grid-cols-3">
        {filteredCatalog.map((comp) => (
          <motion.button
            key={comp.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAddToRail(comp)}
            disabled={!selectedRailId}
            className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-left transition-all hover:border-white/10 disabled:opacity-30"
          >
            <p className="text-xs font-medium text-white/70">{comp.brand}</p>
            <p className="mt-1 truncate text-sm text-white/90">{comp.name}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] text-white/30">{comp.moduleWidth}M</span>
              <span className="text-xs font-semibold text-emerald-400">
                R$ {(comp.typicalPrice?.toNumber() || 0).toFixed(2)}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Current Placements */}
      {placements.length > 0 && (
        <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
          <h4 className="text-sm font-medium text-white/70">Componentes no Painel ({placements.length})</h4>
          <div className="mt-2 space-y-1">
            {placements.map((p) => (
              <div key={p.id} className="flex items-center justify-between text-xs">
                <span className="text-white/60">{p.brand} {p.model}</span>
                <button onClick={() => removePlacement(p.id)} className="text-red-400 hover:text-red-300">remover</button>
              </div>
            ))}
          </div>
        </div>
      )}

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
