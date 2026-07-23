import { api } from '../client';

// Products
export const productsService = {
  async list(params?: Record<string, string | boolean | number | undefined>) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return api.get(`/products${query ? `?${query}` : ''}`);
  },

  async getBySlug(slug: string) {
    return api.get(`/products/slug/${slug}`);
  },

  async getById(id: string) {
    return api.get(`/products/${id}`);
  },
};

// Categories
export const categoriesService = {
  async list() {
    return api.get('/categories');
  },

  async getBySlug(slug: string) {
    return api.get(`/categories/slug/${slug}`);
  },
};

// Cart
export const cartService = {
  async get() {
    return api.get('/cart');
  },

  async addItem(data: Record<string, unknown>) {
    return api.post('/cart/items', data);
  },

  async updateItem(itemId: string, quantity: number) {
    return api.patch(`/cart/items/${itemId}`, { quantity });
  },

  async removeItem(itemId: string) {
    return api.delete(`/cart/items/${itemId}`);
  },

  async clear() {
    return api.delete('/cart');
  },
};

// Checkout & Orders
export const checkoutService = {
  async checkout(data: { shippingAddress?: Record<string, string>; shippingMethod?: string; notes?: string }) {
    return api.post('/orders/checkout', data);
  },

  async getOrder(id: string) {
    return api.get(`/orders/${id}`);
  },

  async listOrders() {
    return api.get('/orders');
  },
};
