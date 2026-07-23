'use client';

import { motion } from 'framer-motion';
import {
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useOrders, useSellerProducts, useCustomers } from '@/lib/api/hooks/use-seller';

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  index,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  trendUp?: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="rounded-xl border border-border/50 bg-card p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-medium ${
              trendUp ? 'text-emerald-500' : 'text-destructive'
            }`}
          >
            {trendUp ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {trend}
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="mt-1 text-2xl font-bold">{value}</p>
      </div>
    </motion.div>
  );
}

export default function SellerDashboard() {
  const { data: ordersData } = useOrders();
  const { data: productsData } = useSellerProducts();
  const { data: customersData } = useCustomers();

  const orders = ordersData?.data ?? [];
  const products = productsData?.data ?? [];
  const customers = customersData?.data ?? [];

  const totalRevenue = orders.reduce(
    (sum: number, o) => sum + (o.totalAmount ?? 0),
    0,
  );

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Visão geral do seu negócio
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Receita Total"
          value={`R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          trend="+12.5%"
          trendUp
          index={0}
        />
        <StatCard
          title="Pedidos"
          value={String(orders.length)}
          icon={ShoppingCart}
          trend="+3.2%"
          trendUp
          index={1}
        />
        <StatCard
          title="Produtos"
          value={String(products.length)}
          icon={Package}
          index={2}
        />
        <StatCard
          title="Clientes"
          value={String(customers.length)}
          icon={TrendingUp}
          trend="+8.1%"
          trendUp
          index={3}
        />
      </div>

      {/* Recent Activity */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-xl border border-border/50 bg-card"
        >
          <div className="border-b border-border/40 px-6 py-4">
            <h2 className="font-semibold">Pedidos Recentes</h2>
          </div>
          <div className="divide-y divide-border/40">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium">#{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    R$ {(order.totalAmount ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <span
                    className={`inline-block mt-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      order.status === 'CONFIRMED' || order.status === 'CustomerApproved'
                        ? 'bg-emerald-500/15 text-emerald-500'
                        : order.status === 'Draft'
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-amber-500/15 text-amber-500'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="px-6 py-10 text-center text-sm text-muted-foreground">
                Nenhum pedido ainda.
              </div>
            )}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-xl border border-border/50 bg-card"
        >
          <div className="border-b border-border/40 px-6 py-4">
            <h2 className="font-semibold">Produtos em Destaque</h2>
          </div>
          <div className="divide-y divide-border/40">
            {products.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {product.type === 'CPQ_CONFIGURABLE' ? 'Configurável' : 'Padrão'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {product.price
                      ? `R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                      : 'Sob consulta'}
                  </p>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <div className="px-6 py-10 text-center text-sm text-muted-foreground">
                Nenhum produto cadastrado.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
