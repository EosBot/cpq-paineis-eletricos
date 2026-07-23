'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrder } from '@/lib/api/hooks/use-storefront';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  IN_PRODUCTION: 'Em Produção',
  READY_TO_SHIP: 'Pronto para Envio',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
  REFUNDED: 'Reembolsado',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  CONFIRMED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  IN_PRODUCTION: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  READY_TO_SHIP: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  SHIPPED: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
  DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  REFUNDED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { data: order, isLoading } = useOrder(params.id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando pedido...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-xl font-semibold">Pedido não encontrado</h2>
          <Link href="/products">
            <Button className="mt-6">Ver Catálogo</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link href="/account/orders" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Voltar aos Meus Pedidos
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Pedido {order.orderNumber}</h1>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-800'}`}>
              {STATUS_LABELS[order.status] ?? order.status}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {new Date(order.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </div>
        </motion.div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Items */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-border/50 bg-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Itens do Pedido</h2>
            </div>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.productName} x{item.quantity}
                  </span>
                  <span className="font-medium">
                    R$ {item.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R$ {order.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                {order.taxAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Impostos</span>
                    <span>R$ {order.taxAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Desconto</span>
                    <span>- R$ {order.discountAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-lg font-bold">
                    R$ {order.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Shipping */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-border/50 bg-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Entrega</h2>
            </div>
            {order.shippingAddress ? (
              <div className="text-sm text-muted-foreground space-y-1">
                <p>{order.shippingAddress.street}, {order.shippingAddress.number}</p>
                {order.shippingAddress.complement && <p>{order.shippingAddress.complement}</p>}
                <p>{order.shippingAddress.neighborhood}</p>
                <p>{order.shippingAddress.city}/{order.shippingAddress.state}</p>
                <p>CEP: {order.shippingAddress.zipCode}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Endereço não informado</p>
            )}
            {order.shippingMethod && (
              <div className="mt-4 pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground">Método: </span>
                <span className="text-sm font-medium">
                  {order.shippingMethod === 'express' ? 'Expresso' : 'Padrão'}
                </span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Order Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 rounded-xl border border-border/50 bg-card p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Progresso do Pedido</h2>
          <div className="flex items-center gap-2 overflow-x-auto">
            {['PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED'].map((step, idx, arr) => {
              const stepOrder = arr.indexOf(order.status);
              const isCompleted = idx <= stepOrder;
              const isCurrent = idx === stepOrder;
              return (
                <div key={step} className="flex items-center gap-2">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isCompleted ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  {idx < arr.length - 1 && (
                    <div className={`w-8 h-0.5 ${isCompleted && idx < stepOrder ? 'bg-green-500' : 'bg-muted'}`} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-3 grid grid-cols-6 gap-1 text-center">
            {['Pendente', 'Confirmado', 'Produção', 'Pronto', 'Enviado', 'Entregue'].map((label) => (
              <span key={label} className="text-[10px] text-muted-foreground">{label}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
