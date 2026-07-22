'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBuilderStore } from '@/store/builder';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { EnclosureSpec } from '@/store/builder';

const ENCLOSURES: EnclosureSpec[] = [
  { id: 'enc-4030', name: '400×300×150', widthMm: 400, heightMm: 300, depthMm: 150, ipRating: 'IP55', material: 'STEEL' },
  { id: 'enc-6040', name: '600×400×200', widthMm: 600, heightMm: 400, depthMm: 200, ipRating: 'IP55', material: 'STEEL' },
  { id: 'enc-8060', name: '800×600×250', widthMm: 800, heightMm: 600, depthMm: 250, ipRating: 'IP65', material: 'STEEL' },
  { id: 'enc-10080', name: '1000×800×300', widthMm: 1000, heightMm: 800, depthMm: 300, ipRating: 'IP65', material: 'STEEL' },
  { id: 'enc-12080', name: '1200×800×400', widthMm: 1200, heightMm: 800, depthMm: 400, ipRating: 'IP65', material: 'STAINLESS' },
  { id: 'enc-16010', name: '1600×1000×500', widthMm: 1600, heightMm: 1000, depthMm: 500, ipRating: 'IP65', material: 'STAINLESS' },
];

const MATERIAL_LABELS: Record<string, string> = {
  STEEL: 'Aço Pintado',
  STAINLESS: 'Aço Inox',
  ALUMINUM: 'Alumínio',
  POLYESTER: 'Poliéster',
};

export function EnclosureStep() {
  const { enclosure, setEnclosure } = useBuilderStore();
  const [filter, setFilter] = useState<string>('ALL');

  const filtered = filter === 'ALL' ? ENCLOSURES : ENCLOSURES.filter((e) => e.material === filter);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Selecione o Invólucro</h1>
        <p className="mt-2 text-muted-foreground">
          O invólucro define as dimensões físicas e o grau de proteção (IP) do painel.
        </p>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['ALL', 'STEEL', 'STAINLESS'].map((mat) => (
          <button
            key={mat}
            onClick={() => setFilter(mat)}
            className={cn(
              'rounded-full px-4 py-1.5 text-xs font-medium transition-colors',
              filter === mat
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            )}
          >
            {mat === 'ALL' ? 'Todos' : MATERIAL_LABELS[mat]}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((enc) => {
          const isSelected = enclosure?.id === enc.id;
          const scale = Math.min(enc.widthMm, 800) / 800;
          const previewW = 100 * scale;
          const previewH = (enc.heightMm / enc.widthMm) * previewW;

          return (
            <motion.button
              key={enc.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setEnclosure(enc)}
              className={cn(
                'flex flex-col items-center rounded-xl border-2 p-5 transition-all duration-150 ease-out',
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border hover:border-primary/50 hover:shadow-sm',
              )}
            >
              {/* Enclosure Preview */}
              <div className="relative mb-4 flex h-28 items-center justify-center">
                <motion.div
                  className="rounded border-2 border-muted-foreground/30 bg-background/60"
                  style={{ width: `${previewW}px`, height: `${previewH}px` }}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: isSelected ? 1 : 0.6 }}
                >
                  {/* Rail slots indicators */}
                  <div className="absolute inset-2 flex flex-col justify-evenly">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="h-0.5 rounded bg-muted-foreground/20" />
                    ))}
                  </div>
                </motion.div>

                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground"
                  >
                    ✓
                  </motion.div>
                )}
              </div>

              <span className="text-sm font-semibold">{enc.name}</span>
              <span className="mt-1 text-[11px] text-muted-foreground">
                IP {enc.ipRating} · {MATERIAL_LABELS[enc.material]}
              </span>
              <span className="mt-0.5 text-[10px] text-muted-foreground">
                {enc.depthMm}mm prof.
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Selected Info */}
      {enclosure && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle>Invólucro Selecionado</CardTitle>
              <CardDescription>
                Capacidade estimada: ~{Math.floor(enclosure.widthMm / 18)} módulos DIN por trilho
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold">{enclosure.widthMm}</div>
                  <div className="text-xs text-muted-foreground">Largura (mm)</div>
                </div>
                <div>
                  <div className="text-lg font-bold">{enclosure.heightMm}</div>
                  <div className="text-xs text-muted-foreground">Altura (mm)</div>
                </div>
                <div>
                  <div className="text-lg font-bold">{enclosure.depthMm}</div>
                  <div className="text-xs text-muted-foreground">Profundidade (mm)</div>
                </div>
                <div>
                  <div className="text-lg font-bold">{enclosure.ipRating}</div>
                  <div className="text-xs text-muted-foreground">IP Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
