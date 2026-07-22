'use client';

import { useBuilderStore, type PanelType } from '@/store/builder';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const PANEL_TYPES: { value: PanelType; label: string; desc: string }[] = [
  { value: 'WALL_MOUNT', label: 'Parede', desc: 'Montagem em parede, compacto' },
  { value: 'FLOOR_MOUNT', label: 'Piso', desc: 'Independente, grande porte' },
  { value: 'MODULAR', label: 'Modular', desc: 'Sistema expansível' },
];

const VOLTAGES = ['220V', '380V', '440V', '480V'];

export function ProjectStep() {
  const { project, setProject } = useBuilderStore();

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configure seu Painel</h1>
        <p className="mt-2 text-muted-foreground">
          Defina as especificações básicas do projeto. Tudo poderá ser ajustado depois.
        </p>
      </div>

      {/* Name */}
      <Card>
        <CardHeader>
          <CardTitle>Nome do Projeto</CardTitle>
          <CardDescription>Identifique este painel para referência futura.</CardDescription>
        </CardHeader>
        <CardContent>
          <input
            type="text"
            placeholder="Ex: Painel de controle — Motor M1"
            value={project.name}
            onChange={(e) => setProject({ name: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </CardContent>
      </Card>

      {/* Panel Type */}
      <Card>
        <CardHeader>
          <CardTitle>Tipo de Painel</CardTitle>
          <CardDescription>O tipo define as opções de invólucro disponíveis.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {PANEL_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setProject({ panelType: type.value })}
                className={cn(
                  'flex flex-col items-start rounded-lg border-2 p-4 text-left transition-all duration-150 ease-out',
                  project.panelType === type.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50',
                )}
              >
                <span className="text-sm font-semibold">{type.label}</span>
                <span className="mt-1 text-xs text-muted-foreground">{type.desc}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Electrical Specs */}
      <Card>
        <CardHeader>
          <CardTitle>Especificações Elétricas</CardTitle>
          <CardDescription>Tensão, fases e corrente total do painel.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Tensão de Alimentação
              </label>
              <select
                value={project.supplyVoltage}
                onChange={(e) => setProject({ supplyVoltage: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {VOLTAGES.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Fases</label>
              <div className="flex gap-2">
                {[1, 3].map((ph) => (
                  <button
                    key={ph}
                    onClick={() => setProject({ supplyPhases: ph })}
                    className={cn(
                      'flex-1 rounded-md border py-2 text-sm font-medium transition-colors',
                      project.supplyPhases === ph
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary/50',
                    )}
                  >
                    {ph}P
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Corrente Total (A)
              </label>
              <input
                type="number"
                value={project.totalLoadA || ''}
                onChange={(e) => setProject({ totalLoadA: Number(e.target.value) })}
                placeholder="100"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Capacidade de Curto-circuito
              </label>
              <select
                value={project.shortCircuitRating}
                onChange={(e) => setProject({ shortCircuitRating: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="10kA">10 kA</option>
                <option value="25kA">25 kA</option>
                <option value="50kA">50 kA</option>
                <option value="65kA">65 kA</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environmental */}
      <Card>
        <CardHeader>
          <CardTitle>Condições Ambientais</CardTitle>
          <CardDescription>IP rating e temperatura ambiente (NR-10 / NBR 5410).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Local</label>
              <div className="flex gap-2">
                {(['INDOOR', 'OUTDOOR'] as const).map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setProject({ indoorOutdoor: loc })}
                    className={cn(
                      'flex-1 rounded-md border py-2 text-sm font-medium transition-colors',
                      project.indoorOutdoor === loc
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary/50',
                    )}
                  >
                    {loc === 'INDOOR' ? 'Interno' : 'Externo'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Temperatura Ambiente (°C)
              </label>
              <input
                type="number"
                value={project.ambientTempC}
                onChange={(e) => setProject({ ambientTempC: Number(e.target.value) })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
