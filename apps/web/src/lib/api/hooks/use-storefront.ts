'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService, categoriesService, cartService, checkoutService } from '../services/storefront.service';
import type { Cart, Category, Product, Order } from '../types';

// Query Keys
export const storefrontKeys = {
  products: ['products'] as const,
  product: (id: string) => ['products', id] as const,
  categories: ['categories'] as const,
  cart: ['cart'] as const,
};

interface PaginatedProducts {
  data: Product[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

// Products
export function useProducts(params?: {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  type?: 'STANDARD' | 'CPQ_CONFIGURABLE';
}) {
  return useQuery<PaginatedProducts>({
    queryKey: [...storefrontKeys.products, params],
    queryFn: () => productsService.list(params) as unknown as PaginatedProducts,
  });
}

export function useProduct(slug: string) {
  return useQuery<Product>({
    queryKey: storefrontKeys.product(slug),
    queryFn: () => productsService.getBySlug(slug).then((r) => (r as unknown as { data: Product }).data),
    enabled: !!slug,
  });
}

// Categories
export function useCategories() {
  return useQuery<Category[]>({
    queryKey: storefrontKeys.categories,
    queryFn: () => categoriesService.list().then((r) => (r as unknown as { data: Category[] }).data),
  });
}

// Cart
export function useCart() {
  return useQuery<Cart>({
    queryKey: storefrontKeys.cart,
    queryFn: () => cartService.get().then((r) => (r as unknown as { data: Cart }).data),
  });
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { productId: string; quantity: number; configurationId?: string; configurationData?: Record<string, unknown> }) =>
      cartService.addItem(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: storefrontKeys.cart });
    },
  });
}

export function useRemoveFromCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => cartService.removeItem(itemId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: storefrontKeys.cart });
    },
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartService.updateItem(itemId, quantity),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: storefrontKeys.cart });
    },
  });
}

// Orders
export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => checkoutService.listOrders(),
  });
}

// Checkout
export function useCheckout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { shippingAddress?: Record<string, string>; shippingMethod?: string; notes?: string }) =>
      checkoutService.checkout(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: storefrontKeys.cart });
    },
  });
}

export function useOrder(id: string) {
  return useQuery<Order>({
    queryKey: ['order', id],
    queryFn: () => checkoutService.getOrder(id).then((r) => (r as unknown as { data: Order }).data),
    enabled: !!id,
  });
}
