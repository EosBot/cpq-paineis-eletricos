# 🔄 Plano de Reestruturação Completa — CPQ Marketplace

## Estado Atual do Ambiente

### Infraestruta WSL
- **Node.js**: v20.20.2 (instalado via nvm)
- **pnpm**: v9.15.9
- **Prisma**: v5.22.0
- **Git**: configurado e funcionando

### Repositório
- **URL**: https://github.com/EosBot/cpq-paineis-eletricos.git
- **Branch**: master
- **Últimos commits**:
  - `3bd967` — Reestruturação documentação marketplace
  - `055a4c6` — Fase 1 Marketplace foundation (models, services, controllers)
  - `5da5054` — Fix body parser e isSuperAdmin
  - `97464a8` — Fix runtime bugs nos serviços e DTOs
  - `8429f0e` — Security: correções críticas de auth e tenant isolation

### Problemas Identificados pelo Usuário

1. **Pesquisa de mercado incorreta** — dados errados ou incompletos
2. **Sistema montado incorretamente** — não reflete o mercado brasileiro real
3. **Panel Builder incompleto** — faltam normas (NR-10, NBR 5410, IEC 64139), boas práticas, componentes reais
4. **Interface sem graça** — sem animações, sem identidade visual, "mais do mesmo"
5. **Não segue padrões brasileiros** — tensão por estado, clima, normas técnicas

---

## Plano de Ação Detalhado

### Fase 0 — Pesquisa de Mercado (REFAZER)

#### 0.1 Normas Técnicas Brasileiras
- **NR-10**: Segurança em instalações elétricas (obrigatória)
- **NBR 5410**: Instalações elétricas de baixa tensão
- **IEC 61439-1/2**: Conjuntos de comando e distribuição
- **NR-12**: Segurança em máquinas
- **ABNT NBR IEC 60947**: Dispositivos de manobra e proteção

#### 0.2 Componentes Elétricos Reais (Brasil)
Marcas disponíveis: ABB, Schneider, Siemens, WEG, Steck, Elgin, Soprano

| Categoria | Componentes | Faixa de Preço (BRL) |
|-----------|-------------|---------------------|
| Disjuntores MCB | Steck SDD, Schneider Easy9, ABB S200 | R$7–60 |
| Disjuntores MCCB | ABB Tmax, Schneider NSX, Siemens 3VL | R$400–18.000 |
| Contatores | ABB AF, Schneider LC1D, Siemens 3RT, WEG CWC | R$60–35.000 |
| Relés | Finder 40/44/55/60/62, Omny, Phoenix Contact | R$25–140 |
| Bornes/Terminais | Phoenix Contact UT/ST/UK, Wago 280, Weidmüller W | R$4–75 |
| Fontes 24VDC | Phoenix Contact QUINT/TRIO/UNO, Mean Well, Siemens SITOP | R$100–12.000 |
| Inversores (VFD) | WEG CFW11/CFW500, ABB ACS355/ACS380/ACS580, Schneider ATV320/ATTV630, Siemens V20/G120 | R$1.500–90.000 |
| CLPs | Siemens S7-1200/S7-1500, Schneider M221/M241/M262, Wago PFC200 | R$1.800–70.000 |
| IHM (Interfaces) | Siemens KTP, Schneider HMIGTO | R$3.000–15.000 |
| Seccionadoras | ABB OT, Schneider INS | R$120–8.500 |
| Botoeiras/Sinalização | Schneider XB4/XB5/XB7, ABB CPM, Siemens 3SB3 | R$25–180 |
| DPS (Protetores) | Phoenix Contact VALVETRAB/VAL-MS, Dehn | R$150–1.800 |
| Transformadores | WEG, ABB, Schneider (50–2000VA) | R$150–1.800 |

#### 0.3 Variações Regionais (Brasil)
| Região | Estados | Tensão Fase | Clima | IP Mínimo |
|--------|---------|-------------|-------|-----------|
| Sudeste | SP, RJ, MG, ES | 380V | Subtropical | IP41 |
| Sul | PR, SC, RS | 380V | Subtropical/frio | IP41 |
| Nordeste | AL, BA, CE, MA, PB, PE, PI, RN, SE | 380V/2220V | Quente/semi-árido | IP54 |
| Norte | AC, AM, AP, PA, RO, RR, TO | 220V/380V | Úmido equatorial | IP55 |
| Centro-Oeste | DF, GO, MT, MS | 380V | Tropical sazonal | IP41 |

#### 0.4 Regras de Negócio para Painéis
- **Clearances mínimos**: 3mm (≤250V), 5.5mm (251–690V), 10mm (691–1000V)
- **Dissipação térmica**: VFD = 3-5% da potência, Soft-starter = 1-2%, Fonte = 15-20%
- **Bitolas mínimas**: Potência = 1.5mm², Comando = 0.75mm², PE = 2.5mm²
- **Coordenação de proteção**: Tipo 1 (contator + relé + disjuntor), Tipo 2 (sem danos)
- **Seletividade**: Tempo a montante ≥ 1.3× tempo a jusante

---

### Fase 1 — Reconstrução do Panel Builder (Backend)

#### 1.1 Schema do Banco (Novo)

```prisma
model PanelTemplate {
  id          String   @id @default(cuid())
  name        String   // "CCM", "QGBT", "Automação", etc.
  description String
  type        String   // PanelType enum
  complexity  String   // SIMPLE, MEDIUM, COMPLEX
  // Configuração padrão
  defaultEnclosure Json?
  defaultBusbar Json?
}

model Region {
  id          String  @id @default(cuid())
  stateCode   String  @unique // SP, RJ, MG...
  stateName   String
  voltage     String  // 380V, 220V
  frequency   Int     @default(60)
  climateZone String  // COASTAL, AMAZON, SEMI_ARID, etc.
  minIPRating String  // IP41, IP54, IP55
  altitude    Int?    // metros
  avgTempC    Int?    // temperatura média
}

model PanelConfiguration {
  id              String   @id @default(cuid())
  tenantId        String
  customerId      String?
  name            String
  status          String   // DRAFT, CONFIGURED, IN_CART, ORDERED
  
  // Especificações técnicas
  panelType       String   // CCM, QGBT, AUTOMACAO, etc.
  regionId        String?
  
  // Invólucro
  enclosureType   String?  // WALL_MOUNT, FLOOR_STANDING
  enclosureMaterial String? // STEEL, SS304, SS316, POLYESTER
  widthMm         Int?
  heightMm        Int?
  depthMm         Int?
  ipRating        String?  // IP41, IP54, IP55, IP65
  color           String?  // RAL 7035 (padrão)
  
  // Elétrico
  supplyVoltage   String?  // 380V, 220V
  supplyPhases    Int?     // 3
  totalLoadA      Decimal?
  mainBreakerA    Int?
  shortCircuitRating String? // 10kA, 25kA, 36kA, 50kA
  
  // Barramento
  busbarMaterial  String?  // COPPER, ALUMINUM
  busbarRatingA   Int?
  
  // Componentes
  rails           Rail[]
  circuits        Circuit[]
  placements      Placement[]
  
  // Cálculos
  totalHeatW      Decimal?
  coolingMethod   String?  // NATURAL, FORCED_AIR, AC
  totalWeightKg   Decimal?
  
  // Dimensionamento
  layoutData      Json?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Rail {
  id              String   @id @default(cuid())
  configurationId String
  type            String   // DIN_35MM
  lengthMm        Int
  positionY       Decimal
  label           String?
  moduleCapacity  Int      // número de módulos (18mm cada)
  usedModules     Int      @default(0)
  
  configuration   PanelConfiguration @relation(...)
  placements      Placement[]
}

model Circuit {
  id              String   @id @default(cuid())
  configurationId String
  name            String
  type            String   // POWER, CONTROL
  voltage         String?
  phases          Int?
  color           String?  // Vermelho, Preto, Cinza (fases R, S, T)
  
  configuration   PanelConfiguration @relation(...)
  placements      Placement[]
}

model Placement {
  id              String   @id @default(cuid())
  configurationId String
  componentId     String
  railId          String
  circuitId       String?
  positionMm      Decimal
  quantity        Int      @default(1)
  
  component       Component @relation(...)
  rail            Rail @relation(...)
  circuit         Circuit? @relation(...)
}
```

#### 1.2 Componentes Reais (Seed Data)

**Disjuntores Térmicos (MCB)**:
- Steck SDD61C06 (6A, 1P) — R$8
- Steck SDD61C16 (16A, 1P) — R$10
- Steck SDD61C32 (32A, 1P) — R$15
- Schneider Easy9 EZ9F331xx (10-63A, 1P) — R$25–60

**Disjuntores Moldados (MCCB)**:
- ABB Tmax T1B 125 (125A, 3P) — R$400
- Schneider NSX100F (100A, 3P) — R$800
- Siemens 3VL160 (160A, 3P) — R$1.200

**Contatores**:
- ABB AF09 (9A, AC-3) — R$350
- ABB AF25 (25A, AC-3) — R$500
- Schneider LC1D09 (9A) — R$60
- WEG CWC09 (9A, compacto) — R$70

**Inversores de Frequência (VFD)**:
- WEG CFW11 00075 T 2 (0.75 HP, 220V) — R$1.500
- WEG CFW500 A07P0 T 2 (7.5 HP, 220V) — R$3.800
- ABB ACS355-03E-05A6-4 (3 kW) — R$3.000

#### 1.3 Regras de Negócio (Engine)

```typescript
// Validação de clearance (IEC 61439)
function validateClearance(voltage: number, placement1: Placement, placement2: Placement): boolean {
  const minClearance = voltage <= 250 ? 3 : voltage <= 690 ? 5.5 : 10;
  const distance = Math.abs(placement1.positionMm - placement2.positionMm);
  return distance >= minClearance;
}

// Cálculo de dissipação térmica
function calculateHeatDissipation(placements: Placement[]): number {
  return placements.reduce((total, p) => {
    const component = p.component;
    if (component.type === 'VFD') {
      return total + (component.ratedPowerW * 0.04); // 4% perdas
    }
    if (component.type === 'POWER_SUPPLY') {
      return total + (component.ratedPowerW * 0.15); // 15% perdas
    }
    return total;
  }, 0);
}

// Dimensionamento de bitola (NBR 5410)
function calculateWireSize(currentA: number, circuitType: 'POWER' | 'CONTROL'): string {
  const sizes = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120];
  const capacity = [15.5, 21, 28, 36, 50, 68, 89, 110, 134, 171, 207, 239];
  const minSize = circuitType === 'POWER' ? 1.5 : 0.75;
  
  for (let i = 0; i < sizes.length; i++) {
    if (capacity[i] >= currentA) {
      return `${Math.max(sizes[i], minSize)}mm²`;
    }
  }
  return '120mm²';
}

// Coordenação de proteção (Tipo 2)
function validateProtectionCoordination(contactor: Component, breaker: Component): boolean {
  // Contator deve suportar corrente de partida (8× In)
  // Disjuntor deve coordenar com curva do contator
  return breaker.breakingCapacity >= contactor.ratedCurrent * 8;
}
```

---

### Fase 2 — Frontend (Redesign Completo)

#### 2.1 Design System

**Identidade Visual**:
- **Cores**: Azul elétrico (#0066FF), Laranja energético (#FF6B35), Cinza técnico (#2D3748)
- **Tipografia**: Inter (títulos), JetBrains Mono (dados técnicos)
- **Estilo**: Industrial-moderno, dark mode padrão
- **Animações**: Framer Motion (Apple-style springs)

#### 2.2 Interface do Panel Builder (Reconstruída)

```
┌─────────────────────────────────────────────────────────────────┐
│  CPQ PANEL BUILDER                          [💡] [⚙️] [👤]     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐  ┌──────────────────────────────────────────────┐ │
│  │ STEPS    │  │  CANVAS 3D                                     │ │
│  │          │  │  ┌─────────────────────────────────────────┐  │ │
│  │ ① Projeto│  │  │                                         │  │ │
│  │ ② Invól.│  │  │   [3D Preview do Painel]                │  │ │
│  │ ③ Circuit│  │  │   - Invólucro realista                  │  │ │
│  │ ④ Comp. │  │  │   - Trilhos DIN visíveis                │  │ │
│  │ ⑤ Review│  │  │   - Componentes em 3D                    │  │ │
│  │          │  │  │   - Fios/conexões                       │  │ │
│  │          │  │  │                                         │  │ │
│  │          │  │  └─────────────────────────────────────────┘  │ │
│  │          │  │                                                │ │
│  │          │  │  ┌─────────────────────────────────────────┐  │ │
│  │          │  │  │  TRILHOS DIN (Drag & Drop)              │  │ │
│  │          │  │  │  ├── Rail 1 [████████░░░░] 8/12 módulos  │  │ │
│  │          │  │  │  ├── Rail 2 [████░░░░░░░░] 4/12 módulos  │  │ │
│  │          │  │  │  └── Rail 3 [░░░░░░░░░░░░] 0/12 módulos  │  │ │
│  │          │  │  └─────────────────────────────────────────┘  │ │
│  └──────────┘  └──────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────────┐
│  │  PAINEL LATERAL                                              │
│  │  ├── BOM (lista de materiais)                                │
│  │  ├── Preço total: R$ 12.450,00                               │
│  │  ├── Calor dissipado: 245W                                   │
│  │  ├── Dimensões: 800×600×250mm                                │
│  │  └── [Adicionar ao Carrinho]                                 │
│  └──────────────────────────────────────────────────────────────┘
│
└─────────────────────────────────────────────────────────────────┘
```

#### 2.3 Animações (Framer Motion)

```typescript
// Transições de página
const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.98 }
};

// Drag & drop de componentes
const dragConstraints = {
  left: 0,
  right: railWidth,
  top: 0,
  bottom: 0
};

// Feedback visual ao adicionar componente
const placementAnimation = {
  initial: { scale: 0, rotate: -10 },
  animate: { scale: 1, rotate: 0 },
  transition: { type: 'spring', stiffness: 300, damping: 20 }
};

// Validação em tempo real
const validationPulse = {
  animate: { 
    boxShadow: hasError 
      ? ['0 0 0 0 rgba(239,68,68,0)', '0 0 0 8px rgba(239,68,68,0.3)', '0 0 0 0 rgba(239,68,68,0)']
      : 'none'
  },
  transition: { duration: 1.5, repeat: Infinity }
};
```

#### 2.4 Componentes 3D (React Three Fiber)

```typescript
// Invólucro 3D realista
function Enclosure3D({ width, height, depth, material }) {
  return (
    <group>
      {/* Corpo principal */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial 
          color={material === 'SS304' ? '#C0C0C0' : '#708090'} 
          metalness={0.8} 
          roughness={0.2} 
        />
      </mesh>
      {/* Porta */}
      <mesh position={[0, 0, depth/2 + 1]}>
        <boxGeometry args={[width - 10, height - 10, 5]} />
        <meshStandardMaterial color="#2D3748" metalness={0.5} />
      </mesh>
      {/* Trilhos DIN visíveis */}
      {rails.map(rail => (
        <DINRail3D key={rail.id} positionY={rail.positionY} length={rail.lengthMm} />
      ))}
    </group>
  );
}

// Componente elétrico 3D
function Component3D({ type, position, rotation }) {
  const geometry = getComponentGeometry(type);
  return (
    <mesh position={position} rotation={rotation}>
      <primitive object={geometry} />
      <meshStandardMaterial color={getComponentColor(type)} />
    </mesh>
  );
}
```

---

### Fase 3 — Implementação (Ordem de Execução)

1. **Pesquisa de mercado** (refazer completamente)
2. **Schema Prisma** (atualizar com novos modelos)
3. **Migrações** (criar e aplicar)
4. **Backend Services** (reconstruir com regras corretas)
5. **Seed data** (componentes reais do mercado brasileiro)
6. **Frontend Store** (Zustand com estado correto)
7. **UI Components** (reconstruir com design system)
8. **Animações** (Framer Motion + Three.js)
9. **Integração CPQ → Marketplace**
10. **Testes e validação**

---

## Resumo para o Usuário

**Repositório**: https://github.com/EosBot/cpq-paineis-eletricos.git

**Branch**: master

**Commits realizados hoje**:
1. Reestruturação completa da documentação (13 ADRs, contexto, status)
2. Fase 1 Marketplace backend (models, services, controllers)
3. Correções de segurança (auth, tenant isolation)
4. Typecheck passando

**Próximos passos**:
1. Refazer pesquisa de mercado com dados corretos
2. Reconstruir Panel Builder com normas brasileiras
3. Redesign completo da UI/UX com animações
4. Implementar regras de negócio reais

---

*Este documento será atualizado conforme o progresso da implementação.*
