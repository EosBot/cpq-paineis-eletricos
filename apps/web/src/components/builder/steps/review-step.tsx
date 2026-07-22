'use client';

import { motion } from 'framer-motion';
import { useBuilderStore } from '@/store/builder';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PanelViewer3D } from '../panel-viewer-3d';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export function ReviewStep() {
  const { project, enclosure, rails, circuits, placements } = useBuilderStore();

  const componentTotal = placements.reduce((sum, p) => sum + p.unitPrice, 0);
  const laborHours = Math.max(4, placements.length * 0.3 + rails.length * 0.5);
  const laborCost = laborHours * 75;
  const subtotal = componentTotal + laborCost;
  const overhead = subtotal * 0.15;
  const total = subtotal + overhead;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Revisão Final</h1>
        <p className="mt-2 text-muted-foreground">
          Verifique todos os detalhes antes de gerar o quote.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* 3D Preview */}
        <Card className="col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Visualização 3D</CardTitle>
          </CardHeader>
          <CardContent>
            <PanelViewer3D />
          </CardContent>
        </Card>

        {/* Specs Summary */}
        <Card className="col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Especificações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Projeto:</span>
                <p className="font-medium">{project.name || '—'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Tipo:</span>
                <p className="font-medium">{project.panelType === 'WALL_MOUNT' ? 'Parede' : project.panelType === 'FLOOR_MOUNT' ? 'Piso' : 'Modular'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Invólucro:</span>
                <p className="font-medium">{enclosure ? `${enclosure.name} (${enclosure.ipRating})` : '—'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Tensão:</span>
                <p className="font-medium">{project.supplyVoltage} · {project.supplyPhases}P</p>
              </div>
              <div>
                <span className="text-muted-foreground">Trilhos DIN:</span>
                <p className="font-medium">{rails.length}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Circuitos:</span>
                <p className="font-medium">{circuits.length}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Componentes:</span>
                <p className="font-medium">{placements.length}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Temp. Ambiente:</span>
                <p className="font-medium">{project.ambientTempC}°C · {project.indoorOutdoor === 'INDOOR' ? 'Interno' : 'Externo'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BOM */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Materiais (BOM)</CardTitle>
        </CardHeader>
        <CardContent>
          {placements.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum componente adicionado.</p>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 border-b pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span className="col-span-1">#</span>
                <span className="col-span-4">Componente</span>
                <span className="col-span-2">Categoria</span>
                <span className="col-span-2">Marca</span>
                <span className="col-span-1">Qtd</span>
                <span className="col-span-2 text-right">Preço</span>
              </div>
              {placements.map((p, idx) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="grid grid-cols-12 gap-2 items-center text-sm"
                >
                  <span className="col-span-1 text-muted-foreground">{idx + 1}</span>
                  <span className="col-span-4 truncate font-medium">{p.model}</span>
                  <span className="col-span-2 text-muted-foreground">{p.category}</span>
                  <span className="col-span-2 text-muted-foreground">{p.brand}</span>
                  <span className="col-span-1">1</span>
                  <span className="col-span-2 text-right font-medium">{formatCurrency(p.unitPrice)}</span>
                </motion.div>
              ))}

              <div className="mt-4 space-y-1 border-t pt-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal Componentes</span>
                  <span>{formatCurrency(componentTotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Mão de Obra ({laborHours.toFixed(1)}h × R$75)</span>
                  <span>{formatCurrency(laborCost)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Overhead (15%)</span>
                  <span>{formatCurrency(overhead)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-base font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
