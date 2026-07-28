'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { panelBuilderService } from '../services/panel-builder.service';

export const panelBuilderKeys = {
  catalog: ['panel-builder', 'catalog'] as const,
  categories: ['panel-builder', 'categories'] as const,
  templates: ['panel-builder', 'templates'] as const,
  regions: ['panel-builder', 'regions'] as const,
  configurations: ['panel-builder', 'configurations'] as const,
  configuration: (id: string) => ['panel-builder', 'configurations', id] as const,
  pricing: (id: string) => ['panel-builder', 'pricing', id] as const,
};

export function useCatalog(params?: { categoryId?: string; search?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: [...panelBuilderKeys.catalog, params],
    queryFn: () => panelBuilderService.getCatalog(params).then((r) => (r as unknown as { data: unknown }).data),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: panelBuilderKeys.categories,
    queryFn: () => panelBuilderService.getCategories(),
  });
}

export function useRegions() {
  return useQuery({
    queryKey: panelBuilderKeys.regions,
    queryFn: () => panelBuilderService.getRegions(),
  });
}

export function useConfigurations() {
  return useQuery({
    queryKey: panelBuilderKeys.configurations,
    queryFn: () => panelBuilderService.getConfigurations(),
  });
}

export function useConfiguration(id: string | null) {
  return useQuery({
    queryKey: panelBuilderKeys.configuration(id!),
    queryFn: () => panelBuilderService.getConfiguration(id!),
    enabled: !!id,
  });
}

export function useCreateConfiguration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof panelBuilderService.createConfiguration>[0]) =>
      panelBuilderService.createConfiguration(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: panelBuilderKeys.configurations });
    },
  });
}

export function useAddRail(configurationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { type: string; lengthMm: number; positionY: number }) =>
      panelBuilderService.addRail(configurationId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: panelBuilderKeys.configuration(configurationId) });
      qc.invalidateQueries({ queryKey: panelBuilderKeys.pricing(configurationId) });
    },
  });
}

export function useAddCircuit(configurationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; type: string; voltage: number }) =>
      panelBuilderService.addCircuit(configurationId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: panelBuilderKeys.configuration(configurationId) });
    },
  });
}

export function useAddPlacement(configurationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { componentId: string; railId: string; circuitId?: string; positionMm: number; moduleWidth: number }) =>
      panelBuilderService.addPlacement(configurationId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: panelBuilderKeys.configuration(configurationId) });
      qc.invalidateQueries({ queryKey: panelBuilderKeys.pricing(configurationId) });
    },
  });
}

export function useRemovePlacement(configurationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (placementId: string) => panelBuilderService.removePlacement(placementId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: panelBuilderKeys.configuration(configurationId) });
      qc.invalidateQueries({ queryKey: panelBuilderKeys.pricing(configurationId) });
    },
  });
}

export function usePricing(configurationId: string | null) {
  return useQuery({
    queryKey: panelBuilderKeys.pricing(configurationId!),
    queryFn: () => panelBuilderService.getPricing(configurationId!),
    enabled: !!configurationId,
  });
}

export function useSubmitForReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (configurationId: string) => panelBuilderService.submitForReview(configurationId),
    onSuccess: (_data, configurationId) => {
      qc.invalidateQueries({ queryKey: panelBuilderKeys.configuration(configurationId) });
    },
  });
}
