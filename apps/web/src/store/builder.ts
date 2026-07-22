'use client';

import { create } from 'zustand';

export type PanelType = 'WALL_MOUNT' | 'FLOOR_MOUNT' | 'MODULAR';
export type StepId = 'PROJECT' | 'ENCLOSURE' | 'CIRCUITS' | 'COMPONENTS' | 'REVIEW';

export interface EnclosureSpec {
  id: string;
  name: string;
  widthMm: number;
  heightMm: number;
  depthMm: number;
  ipRating: string;
  material: 'STEEL' | 'STAINLESS' | 'ALUMINUM' | 'POLYESTER';
}

export interface DINRail {
  id: string;
  type: 'TOP_HAT_7_5' | 'TOP_HAT_15' | 'C_SECTION' | 'G_SECTION';
  lengthMm: number;
  positionY: number;
  orientation: 'HORIZONTAL' | 'VERTICAL';
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
}

export interface BuilderState {
  currentStep: StepId;
  projectId: string | null;
  configurationId: string | null;
  project: ProjectSpec;
  enclosure: EnclosureSpec | null;
  rails: DINRail[];
  circuits: Circuit[];
  placements: ComponentPlacement[];
  selectedRailId: string | null;
  selectedComponentId: string | null;
  isSaving: boolean;
}

export interface BuilderActions {
  setStep: (step: StepId) => void;
  nextStep: () => void;
  prevStep: () => void;
  setProject: (project: Partial<ProjectSpec>) => void;
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
  reset: () => void;
}

const STEPS: StepId[] = ['PROJECT', 'ENCLOSURE', 'CIRCUITS', 'COMPONENTS', 'REVIEW'];

const initialProject: ProjectSpec = {
  panelType: 'WALL_MOUNT',
  name: '',
  description: '',
  ambientTempC: 25,
  indoorOutdoor: 'INDOOR',
  supplyVoltage: '380V',
  supplyPhases: 3,
  totalLoadA: 0,
  shortCircuitRating: '10kA',
};

export const useBuilderStore = create<BuilderState & BuilderActions>((set, get) => ({
  currentStep: 'PROJECT',
  projectId: null,
  configurationId: null,
  project: initialProject,
  enclosure: null,
  rails: [],
  circuits: [],
  placements: [],
  selectedRailId: null,
  selectedComponentId: null,
  isSaving: false,

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

  reset: () =>
    set({
      currentStep: 'PROJECT',
      projectId: null,
      configurationId: null,
      project: initialProject,
      enclosure: null,
      rails: [],
      circuits: [],
      placements: [],
      selectedRailId: null,
      selectedComponentId: null,
      isSaving: false,
    }),
}));
