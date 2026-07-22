'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useBuilderStore } from '@/store/builder';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export function PricingSidebar() {
  const { placements, circuits, rails, nextStep, prevStep, currentStep, project } =
    useBuilderStore();

  const componentTotal = placements.reduce((sum, p) => sum + p.unitPrice, 0);
  const enclosureCost = 0;
  const laborHours = Math.max(4, placements.length * 0.3 + rails.length * 0.5);
  const laborRate = 75;
  const laborCost = laborHours * laborRate;
  const subtotal = componentTotal + enclosureCost + laborCost;
  const overhead = subtotal * 0.15;
  const total = subtotal + overhead;

  return (
    <aside className="flex w-80 shrink-0 flex-col border-l bg-card">
      {/* Panel Preview Mini */}
      <div className="relative flex h-48 items-center justify-center border-b bg-gradient-to-b from-secondary/50 to-card">
        <div className="relative">
          {/* Enclosure representation */}
          <div
            className="rounded-md border-2 border-border bg-background/80 shadow-lg"
            style={{
              width: '120px',
              height: '160px',
            }}
          >
            {/* Rails */}
            {rails.map((rail, idx) => (
              <motion.div
                key={rail.id}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                className="absolute left-2 right-2 h-1 rounded-full bg-muted-foreground/40"
                style={{ top: `${25 + idx * 30}%` }}
              />
            ))}

            {/* Components count */}
            <AnimatePresence>
              {placements.length > 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -right-3 -top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
                >
                  {placements.length}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Brand label */}
          {placements.length > 0 && (
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-muted-foreground">
              {placements[placements.length - 1]?.brand}
            </div>
          )}
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Resumo de Preço
        </h3>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Componentes ({placements.length})</span>
            <span className="font-medium">{formatCurrency(componentTotal)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Mão de obra</span>
            <span className="font-medium">{formatCurrency(laborCost)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Overhead (15%)</span>
            <span className="font-medium">{formatCurrency(overhead)}</span>
          </div>

          <div className="my-3 border-t" />

          <div className="flex justify-between">
            <span className="text-sm font-semibold">Total</span>
            <motion.span
              key={total}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              className="text-lg font-bold tracking-tight"
            >
              {formatCurrency(total)}
            </motion.span>
          </div>
        </div>

        {/* Component List */}
        {placements.length > 0 && (
          <div className="mt-6">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Itens
            </h4>
            <div className="space-y-1.5">
              <AnimatePresence>
                {placements.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between overflow-hidden rounded px-2 py-1 text-xs hover:bg-secondary"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-primary/60" />
                      <span className="truncate">{p.brand} {p.model}</span>
                    </div>
                    <span className="shrink-0 text-muted-foreground">
                      {formatCurrency(p.unitPrice)}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Circuit Summary */}
        {circuits.length > 0 && (
          <div className="mt-4">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Circuitos ({circuits.length})
            </h4>
            <div className="space-y-1">
              {circuits.map((c) => (
                <div key={c.id} className="flex items-center gap-2 text-xs">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                  <span>{c.name}</span>
                  <span className="text-muted-foreground">({c.voltage})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="shrink-0 border-t p-4">
        {currentStep !== 'PROJECT' && (
          <Button variant="outline" className="mb-2 w-full" onClick={prevStep}>
            Voltar
          </Button>
        )}
        {currentStep !== 'REVIEW' ? (
          <Button className="w-full" onClick={nextStep}>
            Continuar
          </Button>
        ) : (
          <Button className="w-full" variant="default">
            Gerar Quote
          </Button>
        )}
      </div>
    </aside>
  );
}
