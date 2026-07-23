'use client';

import { create } from 'zustand';

export type PanelType = 'CCM' | 'QGBT' | 'CCMI' | 'AUTOMACAO' | 'DISTRIBUICAO';
export type StepId = 'PROJECT' | 'ENCLOSURE' | 'CIRCUITS' | 'COMPONENTS' | 'REVIEW';

export interface EnclosureSpec {
  id: string;
  name: string;
  widthMm: number;
  heightMm: number;
  depthMm: number;
  ipRating: string;
  material: 'STEEL' | 'SS304' | 'SS316' | 'POLYESTER';
}

export interface DINRail {
  id: string;
  type: 'TOP_HAT_7_5' | 'TOP_HAT_15' | 'C_SECTION' | 'G_SECTION';
  lengthMm: number;
  positionY: number;
  label?: string;
  moduleCapacity: number;
  usedModules: number;
}

export interface Circuit {
  id: string;
  name: string;
  type: 'POWER' | 'CONTROL' | 'SIGNAL';
  voltage: string;
  color: string;
}

export interface ComponentPlacement {
  id: string;
  componentId: string;
  railId: string;
  positionMm: number;
  moduleWidth: number;
  circuitId: string | null;
  brand: string;
  model: string;
  unitPrice: number;
  category: string;
}

export interface ProjectSpec {
  panelType: PanelType;
  name: string;
  description: string;
  ambientTempC: number;
  indoorOutdoor: 'INDOOR' | 'OUTDOOR';
  supplyVoltage: string;
  supplyPhases: number;
  totalLoadA: number;
  shortCircuitRating: string;
  stateCode: string;
}

export interface ComponentCatalogItem {
  id: string;
  tenantId: string;
  sku: string;
  name: string;
  description: string | null;
  brand: string | null;
  isActive: boolean;
  moduleWidth: number;
  ratedCurrent: any | null;
  ratedVoltage: string | null;
  poles: any | null;
  mountingType: any;
  formFactorGroup: string | null;
  typicalPrice: any | null;
  componentCategoryId: string;
  componentCategory: {
    id: string;
    code: string;
    name: string;
  };
}

export interface BuilderState {
  currentStep: StepId;
  projectId: string | null;
  configurationId: string | null;
  productId: string | null;
  project: ProjectSpec;
  enclosure: EnclosureSpec | null;
  rails: DINRail[];
  circuits: Circuit[];
  placements: ComponentPlacement[];
  selectedRailId: string | null;
  selectedComponentId: string | null;
  catalog: ComponentCatalogItem[];
  catalogCategories: any[];
  regions: any[];
  templates: any[];
  isSaving: boolean;
  pricing: {
    componentCost: number;
    laborHours: number;
    laborRate: number;
    laborCost: number;
    overhead: number;
    subtotal: number;
    total: number;
    componentCount: number;
  } | null;
}

export interface BuilderActions {
  setStep: (step: StepId) => void;
  nextStep: () => void;
  prevStep: () => void;
  setProject: (project: Partial<ProjectSpec>) => void;
  setProductId: (id: string) => void;
  setEnclosure: (enclosure: EnclosureSpec) => void;
  addRail: (rail: DINRail) => void;
  removeRail: (id: string) => void;
  addCircuit: (circuit: Circuit) => void;
  removeCircuit: (id: string) => void;
  addPlacement: (placement: ComponentPlacement) => void;
  removePlacement: (id: string) => void;
  selectRail: (id: string | null) => void;
  selectComponent: (id: string | null) => void;
  setConfigurationId: (id: string) => void;
  setCatalog: (catalog: ComponentCatalogItem[]) => void;
  setCatalogCategories: (categories: any[]) => void;
  setRegions: (regions: any[]) => void;
  setTemplates: (templates: any[]) => void;
  setPricing: (pricing: BuilderState['pricing']) => void;
  reset: () => void;
}

const STEPS: StepId[] = ['PROJECT', 'ENCLOSURE', 'CIRCUITS', 'COMPONENTS', 'REVIEW'];

const initialProject: ProjectSpec = {
  panelType: 'CCM',
  name: '',
  description: '',
  ambientTempC: 25,
  indoorOutdoor: 'INDOOR',
  supplyVoltage: '380V',
  supplyPhases: 3,
  totalLoadA: 0,
  shortCircuitRating: '10kA',
  stateCode: 'SP',
};

export const useBuilderStore = create<BuilderState & BuilderActions>((set, get) => ({
  currentStep: 'PROJECT',
  projectId: null,
  configurationId: null,
  productId: null,
  project: initialProject,
  enclosure: null,
  rails: [],
  circuits: [],
  placements: [],
  selectedRailId: null,
  selectedComponentId: null,
  catalog: [],
  catalogCategories: [],
  regions: [],
  templates: [],
  isSaving: false,
  pricing: null,

  setStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const idx = STEPS.indexOf(get().currentStep);
    if (idx < STEPS.length - 1) set({ currentStep: STEPS[idx + 1] });
  },

  prevStep: () => {
    const idx = STEPS.indexOf(get().currentStep);
    if (idx > 0) set({ currentStep: STEPS[idx - 1] });
  },

  setProject: (project) => set((s) => ({ project: { ...s.project, ...project } })),

  setEnclosure: (enclosure) => set({ enclosure }),

  addRail: (rail) => set((s) => ({ rails: [...s.rails, rail] })),

  removeRail: (id) => set((s) => ({ rails: s.rails.filter((r) => r.id !== id) })),

  addCircuit: (circuit) => set((s) => ({ circuits: [...s.circuits, circuit] })),

  removeCircuit: (id) => set((s) => ({ circuits: s.circuits.filter((c) => c.id !== id) })),

  addPlacement: (placement) =>
    set((s) => {
      const rail = s.rails.find((r) => r.id === placement.railId);
      if (!rail) return s;
      const updatedRails = s.rails.map((r) =>
        r.id === placement.railId
          ? { ...r, usedModules: r.usedModules + placement.moduleWidth }
          : r,
      );
      return { placements: [...s.placements, placement], rails: updatedRails };
    }),

  removePlacement: (id) =>
    set((s) => {
      const placement = s.placements.find((p) => p.id === id);
      if (!placement) return s;
      const updatedRails = s.rails.map((r) =>
        r.id === placement.railId
          ? { ...r, usedModules: Math.max(0, r.usedModules - placement.moduleWidth) }
          : r,
      );
      return { placements: s.placements.filter((p) => p.id !== id), rails: updatedRails };
    }),

  selectRail: (id) => set({ selectedRailId: id }),
  selectComponent: (id) => set({ selectedComponentId: id }),
  setConfigurationId: (id) => set({ configurationId: id }),
  setProductId: (id) => set({ productId: id }),
  setCatalog: (catalog) => set({ catalog }),
  setCatalogCategories: (categories) => set({ catalogCategories: categories }),
  setRegions: (regions) => set({ regions }),
  setTemplates: (templates) => set({ templates }),
  setPricing: (pricing) => set({ pricing }),

  reset: () =>
    set({
      currentStep: 'PROJECT',
      projectId: null,
      configurationId: null,
      productId: null,
      project: initialProject,
      enclosure: null,
      rails: [],
      circuits: [],
      placements: [],
      selectedRailId: null,
      selectedComponentId: null,
      catalog: [],
      catalogCategories: [],
      regions: [],
      templates: [],
      isSaving: false,
      pricing: null,
    }),
}));
