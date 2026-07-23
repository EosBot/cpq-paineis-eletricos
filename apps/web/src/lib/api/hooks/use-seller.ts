'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  inventoryService,
  salesService,
  customersService,
  financialService,
  procurementService,
  sellerProductsService,
  ordersService,
} from '../services/seller.service';
import type {
  InventoryProduct,
  StockLevel,
  SalesOrder,
  Customer,
  FinancialTransaction,
  Supplier,
  PurchaseOrder,
  Order,
} from '../types';

// Query Keys
export const sellerKeys = {
  inventory: ['seller', 'inventory'] as const,
  inventoryProduct: (id: string) => ['seller', 'inventory', id] as const,
  stockLevels: ['seller', 'stock-levels'] as const,
  salesOrders: ['seller', 'sales-orders'] as const,
  salesOrder: (id: string) => ['seller', 'sales-orders', id] as const,
  customers: ['seller', 'customers'] as const,
  customer: (id: string) => ['seller', 'customers', id] as const,
  financial: ['seller', 'financial'] as const,
  financialTransactions: ['seller', 'financial-transactions'] as const,
  agingReport: ['seller', 'aging-report'] as const,
  suppliers: ['seller', 'suppliers'] as const,
  purchaseOrders: ['seller', 'purchase-orders'] as const,
  sellerProducts: ['seller', 'products'] as const,
  orders: ['seller', 'orders'] as const,
  order: (id: string) => ['seller', 'orders', id] as const,
};

// Inventory
export function useInventoryProducts(params?: { includeInactive?: boolean }) {
  return useQuery<{ data: InventoryProduct[] }>({
    queryKey: [...sellerKeys.inventory, params],
    queryFn: () => inventoryService.getProducts(params) as unknown as Promise<{ data: InventoryProduct[] }>,
  });
}

export function useStockLevels() {
  return useQuery<{ data: StockLevel[] }>({
    queryKey: sellerKeys.stockLevels,
    queryFn: () => inventoryService.getStockLevels() as unknown as Promise<{ data: StockLevel[] }>,
  });
}

// Sales Orders
export function useSalesOrders(params?: { status?: string }) {
  return useQuery<{ data: SalesOrder[] }>({
    queryKey: [...sellerKeys.salesOrders, params],
    queryFn: () => salesService.getOrders(params) as unknown as Promise<{ data: SalesOrder[] }>,
  });
}

export function useCreateSalesOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => salesService.createOrder(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: sellerKeys.salesOrders });
    },
  });
}

// Customers
export function useCustomers() {
  return useQuery<{ data: Customer[] }>({
    queryKey: sellerKeys.customers,
    queryFn: () => customersService.getCustomers() as unknown as Promise<{ data: Customer[] }>,
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => customersService.createCustomer(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: sellerKeys.customers });
    },
  });
}

// Financial
export function useFinancialTransactions(params?: { accountId?: string; fromDate?: string; toDate?: string }) {
  return useQuery<{ data: FinancialTransaction[] }>({
    queryKey: [...sellerKeys.financialTransactions, params],
    queryFn: () => financialService.getTransactions(params) as unknown as Promise<{ data: FinancialTransaction[] }>,
  });
}

// Suppliers
export function useSuppliers() {
  return useQuery<{ data: Supplier[] }>({
    queryKey: sellerKeys.suppliers,
    queryFn: () => procurementService.getSuppliers() as unknown as Promise<{ data: Supplier[] }>,
  });
}

export function useCreateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => procurementService.createSupplier(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: sellerKeys.suppliers });
    },
  });
}

// Purchase Orders
export function usePurchaseOrders(params?: { status?: string }) {
  return useQuery<{ data: PurchaseOrder[] }>({
    queryKey: [...sellerKeys.purchaseOrders, params],
    queryFn: () => procurementService.getPurchaseOrders(params) as unknown as Promise<{ data: PurchaseOrder[] }>,
  });
}

// Seller Products (marketplace catalog)
export function useSellerProducts(params?: { page?: number; limit?: number }) {
  return useQuery<{ data: import('../types').Product[] }>({
    queryKey: [...sellerKeys.sellerProducts, params],
    queryFn: () => sellerProductsService.list(params) as unknown as Promise<{ data: import('../types').Product[] }>,
  });
}

export function useCreateSellerProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => sellerProductsService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: sellerKeys.sellerProducts });
    },
  });
}

export function useUpdateSellerProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      sellerProductsService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: sellerKeys.sellerProducts });
    },
  });
}

export function useDeleteSellerProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sellerProductsService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: sellerKeys.sellerProducts });
    },
  });
}

// Orders
export function useOrders() {
  return useQuery<{ data: Order[] }>({
    queryKey: sellerKeys.orders,
    queryFn: () => ordersService.list() as unknown as Promise<{ data: Order[] }>,
  });
}
