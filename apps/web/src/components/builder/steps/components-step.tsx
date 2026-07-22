'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBuilderStore, type ComponentPlacement } from '@/store/builder';
import { cn } from '@/lib/utils';

const MOCK_COMPONENTS = [
  { id: 'comp-001', brand: 'ABB', model: 'S201-C10', category: 'BREAKER', moduleWidth: 1, unitPrice: 89.50 },
  { id: 'comp-002', brand: 'ABB', model: 'S201-C16', category: 'BREAKER', moduleWidth: 1, unitPrice: 95.00 },
  { id: 'comp-003', brand: 'ABB', model: 'S203-C25', category: 'BREAKER', moduleWidth: 3, unitPrice: 210.00 },
  { id: 'comp-004', brand: 'Schneider', model: 'LC1D09', category: 'CONTACTOR', moduleWidth: 1, unitPrice: 120.00 },
  { id: 'comp-005', brand: 'Schneider', model: 'LC1D18', category: 'CONTACTOR', moduleWidth: 1, unitPrice: 185.00 },
  { id: 'comp-006', brand: 'Siemens', model: '3RT2015', category: 'CONTACTOR', moduleWidth: 1, unitPrice: 165.00 },
  { id: 'comp-007', brand: 'Phoenix Contact', model: 'REL-IR-BL/L-24/21', category: 'RELAY', moduleWidth: 1, unitPrice: 45.00 },
  { id: 'comp-008', brand: 'Weidmüller', model: 'TRS 4 24VDC', category: 'RELAY', moduleWidth: 1, unitPrice: 52.00 },
  { id: 'comp-009', brand: 'ABB', model: 'SU202MR-C10', category: 'RCBO', moduleWidth: 2, unitPrice: 310.00 },
  { id: 'comp-010', brand: 'Siemens', model: 'S7-1200 CPU 1214C', category: 'PLC', moduleWidth: 6, unitPrice: 2450.00 },
  { id: 'comp-011', brand: 'Mean Well', model: 'EDR-120-24', category: 'PSU', moduleWidth: 3, unitPrice: 180.00 },
  { id: 'comp-012', brand: 'Phoenix Contact', model: 'UT 4', category: 'TERMINAL', moduleWidth: 1, unitPrice: 8.50 },
  { id: 'comp-013', brand: 'Wago', model: '280-901', category: 'TERMINAL', moduleWidth: 1, unitPrice: 6.20 },
  { id: 'comp-014', brand: 'Schneider', model: 'ATS48C14Q', category: 'VFD', moduleWidth: 12, unitPrice: 5800.00 },
];

const CATEGORY_LABELS: Record<string, string> = {
  BREAKER: 'Disjuntores',
  CONTACTOR: 'Contatores',
  RELAY: 'Relés',
  RCBO: 'Disjuntores DR',
  PLC: 'CLPs',
  PSU: 'Fontes',
  TERMINAL: 'Bornes',
  VFD: 'Inversores',
};

export function ComponentsStep() {
  const { placements, addPlacement, removePlacement, rails, circuits, enclosure } = useBuilderStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  if (!enclosure) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Selecione um invólucro primeiro.</p>
      </div>
    );
  }

  const filteredComponents = MOCK_COMPONENTS.filter((c) => {
    const matchesCategory = selectedCategory === 'ALL' || c.category === selectedCategory;
    const matchesSearch = searchQuery === '' || `${c.brand} ${c.model}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddComponent = (comp: typeof MOCK_COMPONENTS[number]) => {
    if (rails.length === 0) return;

    const targetRail = rails[0];
    const usedWidthMM = placements
      .filter((p) => p.railId === targetRail.id)
      .reduce((sum, p) => sum + p.moduleWidth * 18, 0);

    if (usedWidthMM + comp.moduleWidth * 18 > targetRail.lengthMm) return;

    const placement: ComponentPlacement = {
      id: `place-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      componentId: comp.id,
      railId: targetRail.id,
      positionMm: usedWidthMM,
      moduleWidth: comp.moduleWidth,
      circuitId: circuits[0]?.id ?? null,
      brand: comp.brand,
      model: comp.model,
      unitPrice: comp.unitPrice,
      category: comp.category,
    };

    addPlacement(placement);
  };

  return (
    <div className="flex h-full gap-0">
      {/* Catalog Panel */}
      <div className="flex w-72 shrink-0 flex-col border-r bg-secondary/20">
        <div className="border-b p-4">
          <h2 className="text-sm font-semibold">Catálogo</h2>
          <input
            type="text"
            placeholder="Buscar componente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mt-2 w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-1 border-b p-3">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={cn(
              'rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors',
              selectedCategory === 'ALL' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-secondary',
            )}
          >
            Todos
          </button>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={cn(
                'rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors',
                selectedCategory === key ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-secondary',
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Component List */}
        <div className="flex-1 overflow-y-auto">
          {filteredComponents.map((comp) => (
            <button
              key={comp.id}
              onClick={() => handleAddComponent(comp)}
              className="flex w-full items-center gap-3 border-b px-4 py-3 text-left transition-colors hover:bg-background"
            >
              {/* Mini representation */}
              <div
                className="flex h-8 shrink-0 items-center justify-center rounded border bg-background text-[8px] font-bold"
                style={{ width: `${Math.max(24, comp.moduleWidth * 8)}px` }}
              >
                {comp.moduleWidth}M
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium">{comp.brand} {comp.model}</div>
                <div className="text-[10px] text-muted-foreground">{CATEGORY_LABELS[comp.category]}</div>
              </div>
              <div className="shrink-0 text-[11px] font-medium">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(comp.unitPrice)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* DIN Rail Layout */}
      <div className="flex-1 overflow-y-auto p-8">
        <h2 className="mb-4 text-sm font-semibold">Layout DIN Rail</h2>

        {rails.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed p-8 text-center text-sm text-muted-foreground">
            Nenhum trilho DIN definido. Adicione trilhos para começar.
          </div>
        ) : (
          <div className="space-y-6">
            {rails.map((rail) => {
              const railPlacements = placements.filter((p) => p.railId === rail.id);
              const totalModules = Math.floor(rail.lengthMm / 18);

              return (
                <div key={rail.id} className="rounded-lg border bg-card p-4">
                  <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Trilho {rail.type === 'TOP_HAT_7_5' ? 'TS35' : rail.type}</span>
                    <span>{railPlacements.reduce((s, p) => s + p.moduleWidth, 0)}/{totalModules} módulos</span>
                  </div>

                  {/* Rail Visual */}
                  <div className="relative h-10 rounded bg-gradient-to-b from-amber-800/20 to-amber-900/20 border border-amber-900/30">
                    {/* Module markers */}
                    <div className="absolute inset-0 flex">
                      {Array.from({ length: Math.min(totalModules, 40) }).map((_, i) => (
                        <div key={i} className="flex-1 border-r border-amber-900/10 last:border-r-0" />
                      ))}
                    </div>

                    {/* Placed Components */}
                    <AnimatePresence>
                      {railPlacements.map((placement) => {
                        const leftPct = (placement.positionMm / rail.lengthMm) * 100;
                        const widthPct = (placement.moduleWidth * 18 / rail.lengthMm) * 100;
                        return (
                          <motion.button
                            key={placement.id}
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            exit={{ scaleX: 0, opacity: 0 }}
                            transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
                            onClick={() => removePlacement(placement.id)}
                            style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                            className="absolute inset-y-1 origin-left rounded-sm bg-primary/70 px-1 text-[8px] text-primary-foreground transition-colors hover:bg-destructive/70"
                            title={`${placement.brand} ${placement.model} — Remover`}
                          >
                            <span className="truncate">{placement.brand}</span>
                          </motion.button>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
