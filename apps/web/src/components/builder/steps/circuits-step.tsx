'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBuilderStore, type Circuit } from '@/store/builder';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const CIRCUIT_TYPES = [
  { value: 'POWER', label: 'Potência', color: '#ef4444' },
  { value: 'CONTROL', label: 'Controle', color: '#3b82f6' },
  { value: 'SIGNAL', label: 'Sinal', color: '#22c55e' },
] as const;

const CIRCUIT_PRESETS = [
  { name: 'Alimentação Principal', type: 'POWER' as const, voltage: '380V' },
  { name: 'Controle Motor M1', type: 'CONTROL' as const, voltage: '24V' },
  { name: 'Iluminação', type: 'POWER' as const, voltage: '220V' },
  { name: 'Sinal Analógico', type: 'SIGNAL' as const, voltage: '4-20mA' },
];

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];

export function CircuitsStep() {
  const { circuits, addCircuit, removeCircuit } = useBuilderStore();
  const [name, setName] = useState('');
  const [type, setType] = useState<'POWER' | 'CONTROL' | 'SIGNAL'>('POWER');
  const [voltage, setVoltage] = useState('380V');

  const handleAdd = () => {
    if (!name) return;
    const circuit: Circuit = {
      id: `circuit-${Date.now()}`,
      name,
      type,
      voltage,
      color: COLORS[circuits.length % COLORS.length],
    };
    addCircuit(circuit);
    setName('');
  };

  const handlePreset = (preset: typeof CIRCUIT_PRESETS[number]) => {
    addCircuit({
      id: `circuit-${Date.now()}`,
      name: preset.name,
      type: preset.type,
      voltage: preset.voltage,
      color: COLORS[circuits.length % COLORS.length],
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Defina os Circuitos</h1>
        <p className="mt-2 text-muted-foreground">
          Circuitos agrupam componentes por função elétrica. Cada circuito pode ter proteção e fiação dedicada.
        </p>
      </div>

      {/* Presets */}
      <Card>
        <CardHeader>
          <CardTitle>Rápido</CardTitle>
          <CardDescription>Adicione circuitos comuns com um clique.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {CIRCUIT_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handlePreset(preset)}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary hover:bg-primary/5"
              >
                + {preset.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Circuit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Circuito Personalizado</CardTitle>
          <CardDescription>Crie um circuito com nome, tipo e tensão específicos.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Nome do circuito..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value as typeof type)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {CIRCUIT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Tensão"
              value={voltage}
              onChange={(e) => setVoltage(e.target.value)}
              className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
            />

            <Button onClick={handleAdd}>Adicionar</Button>
          </div>
        </CardContent>
      </Card>

      {/* Circuit List */}
      <div className="space-y-3">
        <AnimatePresence>
          {circuits.map((circuit) => (
            <motion.div
              key={circuit.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <Card className="flex items-center gap-4 px-4 py-3">
                <span
                  className="h-4 w-4 shrink-0 rounded-full"
                  style={{ backgroundColor: circuit.color }}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">{circuit.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {circuit.type} · {circuit.voltage}
                  </div>
                </div>
                <button
                  onClick={() => removeCircuit(circuit.id)}
                  className="rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  ✕
                </button>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {circuits.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-muted-foreground">
            <p className="text-sm">Nenhum circuito definido.</p>
            <p className="mt-1 text-xs">Use os atalhos acima ou crie um personalizado.</p>
          </div>
        )}
      </div>
    </div>
  );
}
