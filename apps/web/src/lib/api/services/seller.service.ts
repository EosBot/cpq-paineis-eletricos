import { api } from '../client';

// Inventory Products
export const inventoryService = {
  async getProducts(params?: { includeInactive?: boolean }) {
    const query = params?.includeInactive ? '?includeInactive=true' : '';
    return api.get(`/erp/inventory/products${query}`);
  },

  async getProduct(id: string) {
    return api.get(`/erp/inventory/products/${id}`);
  },

  async createProduct(data: Record<string, unknown>) {
    return api.post('/erp/inventory/products', data);
  },

  async getStockLevels(params?: { productId?: string }) {
    const query = params?.productId ? `?productId=${params.productId}` : '';
    return api.get(`/erp/inventory/stock-levels${query}`);
  },

  async createStockMovement(data: Record<string, unknown>) {
    return api.post('/erp/inventory/stock-movements', data);
  },
};

// Sales Orders
export const salesService = {
  async getOrders(params?: { status?: string }) {
    const query = params?.status ? `?status=${params.status}` : '';
    return api.get(`/erp/sales/orders${query}`);
  },

  async getOrder(id: string) {
    return api.get(`/erp/sales/orders/${id}`);
  },

  async createOrder(data: Record<string, unknown>) {
    return api.post('/erp/sales/orders', data);
  },

  async confirmOrder(id: string) {
    return api.patch(`/erp/sales/orders/${id}/confirm`, {});
  },

  async cancelOrder(id: string) {
    return api.patch(`/erp/sales/orders/${id}/cancel`, {});
  },
};

// Customers
export const customersService = {
  async getCustomers() {
    return api.get('/customers');
  },

  async getCustomer(id: string) {
    return api.get(`/customers/${id}`);
  },

  async createCustomer(data: Record<string, unknown>) {
    return api.post('/customers', data);
  },

  async updateCustomer(id: string, data: Record<string, unknown>) {
    return api.patch(`/customers/${id}`, data);
  },

  async deleteCustomer(id: string) {
    return api.delete(`/customers/${id}`);
  },
};

// Financial
export const financialService = {
  async getAccounts(params?: { type?: string }) {
    const query = params?.type ? `?type=${params.type}` : '';
    return api.get(`/erp/financial/accounts${query}`);
  },

  async getTransactions(params?: { accountId?: string; fromDate?: string; toDate?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.accountId) searchParams.set('accountId', params.accountId);
    if (params?.fromDate) searchParams.set('fromDate', params.fromDate);
    if (params?.toDate) searchParams.set('toDate', params.toDate);
    const query = searchParams.toString();
    return api.get(`/erp/financial/transactions${query ? `?${query}` : ''}`);
  },

  async getAgingReport() {
    return api.get('/erp/financial/aging-report');
  },
};

// Procurement
export const procurementService = {
  async getSuppliers() {
    return api.get('/erp/procurement/suppliers');
  },

  async createSupplier(data: Record<string, unknown>) {
    return api.post('/erp/procurement/suppliers', data);
  },

  async getPurchaseOrders(params?: { status?: string }) {
    const query = params?.status ? `?status=${params.status}` : '';
    return api.get(`/erp/procurement/purchase-orders${query}`);
  },

  async createPurchaseOrder(data: Record<string, unknown>) {
    return api.post('/erp/procurement/purchase-orders', data);
  },

  async receivePurchaseOrder(id: string) {
    return api.patch(`/erp/procurement/purchase-orders/${id}/receive`, {});
  },
};

// Marketplace Products (for seller catalog management)
export const sellerProductsService = {
  async list(params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    const query = searchParams.toString();
    return api.get(`/products${query ? `?${query}` : ''}`);
  },

  async create(data: Record<string, unknown>) {
    return api.post('/products', data);
  },

  async update(id: string, data: Record<string, unknown>) {
    return api.patch(`/products/${id}`, data);
  },

  async remove(id: string) {
    return api.delete(`/products/${id}`);
  },
};

// Orders
export const ordersService = {
  async list() {
    return api.get('/orders');
  },

  async getById(id: string) {
    return api.get(`/orders/${id}`);
  },

  async advance(id: string) {
    return api.patch(`/orders/${id}/advance`, {});
  },

  async cancel(id: string) {
    return api.patch(`/orders/${id}/cancel`, {});
  },

  async checkout(data: Record<string, unknown>) {
    return api.post('/orders/checkout', data);
  },
};
