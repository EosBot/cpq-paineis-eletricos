export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  fields?: Record<string, string>;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface TenantContext {
  tenantId: string;
  roleCode: string;
  permissions: Record<string, string[]>;
}

export interface Product {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  description?: string;
  type: 'STANDARD' | 'CPQ_CONFIGURABLE';
  price?: number;
  categoryId?: string;
  category?: Category;
  images?: ProductImage[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText?: string;
  sortOrder: number;
}

export interface Category {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  parentId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  customerId?: string;
  sessionId?: string;
  status: 'ACTIVE' | 'CHECKOUT' | 'COMPLETED' | 'ABANDONED';
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  configurationId?: string;
  configurationData?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// Seller ERP Types
export interface InventoryProduct {
  id: string;
  tenantId: string;
  sku: string;
  name: string;
  description?: string;
  unitCost: number;
  sellingPrice: number;
  unit: string;
  taxCode?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StockLevel {
  id: string;
  productId: string;
  product?: InventoryProduct;
  locationId: string;
  quantity: number;
  reservedQuantity: number;
  averageCost: number;
  minimumStock: number;
}

export interface SalesOrder {
  id: string;
  tenantId: string;
  orderNumber: string;
  customerId: string;
  customer?: Customer;
  status: 'RASCUNHO' | 'CONFIRMADO' | 'FATURADO' | 'ENTREGUE' | 'CANCELADO';
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  notes?: string;
  items: SalesOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface SalesOrderItem {
  id: string;
  salesOrderId: string;
  productId: string;
  product?: InventoryProduct;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxAmount: number;
  total: number;
}

export interface Customer {
  id: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  taxId?: string;
  address?: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialAccount {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  parentAccountId?: string;
  level: number;
  isAnalytical: boolean;
  isActive: boolean;
}

export interface FinancialTransaction {
  id: string;
  tenantId: string;
  accountId: string;
  account?: FinancialAccount;
  type: string;
  amount: number;
  direction: 'CREDIT' | 'DEBIT';
  status: 'PENDENTE' | 'PAGO' | 'CANCELADO';
  dueDate: string;
  paidDate?: string;
  description?: string;
  counterpartName?: string;
  paymentMethod?: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  tenantId: string;
  name: string;
  legalName?: string;
  taxId?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrder {
  id: string;
  tenantId: string;
  orderNumber: string;
  supplierId: string;
  supplier?: Supplier;
  status: 'RASCUNHO' | 'ENVIADO' | 'RECEBIDO' | 'CANCELADO';
  totalAmount: number;
  expectedDelivery?: string;
  receivedAt?: string;
  notes?: string;
  items: PurchaseOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  id: string;
  purchaseOrderId: string;
  productId: string;
  product?: InventoryProduct;
  quantity: number;
  quantityReceived: number;
  unitCost: number;
  total: number;
}

export interface ShippingAddress {
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface Order {
  id: string;
  tenantId: string;
  orderNumber: string;
  status: string;
  currencyCode: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  shippingAddress?: ShippingAddress;
  shippingMethod?: string;
  trackingCode?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
