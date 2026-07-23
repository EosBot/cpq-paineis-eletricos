'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrder } from '@/lib/api/hooks/use-storefront';

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
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
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
          >
            <CheckCircle className="h-10 w-10 text-green-600" />
          </motion.div>

          <h1 className="mt-6 text-3xl font-bold tracking-tight">Pedido Confirmado!</h1>
          <p className="mt-2 text-muted-foreground">
            Seu pedido <span className="font-semibold text-foreground">{order.orderNumber}</span> foi realizado com sucesso.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 max-w-2xl mx-auto rounded-xl border border-border/50 bg-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Detalhes do Pedido</h2>
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
            <div className="border-t border-border pt-3 flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="text-lg font-bold">
                R$ {order.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {order.shippingAddress && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Endereço de Entrega</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {order.shippingAddress.street}, {order.shippingAddress.number}
                {order.shippingAddress.complement && ` - ${order.shippingAddress.complement}`}
                <br />
                {order.shippingAddress.neighborhood} — {order.shippingAddress.city}/{order.shippingAddress.state}
                <br />
                CEP: {order.shippingAddress.zipCode}
              </p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:text-yellow-300">
                {order.status}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/products" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">
              Continuar Comprando
            </Button>
          </Link>
          <Link href="/account/orders" className="w-full sm:w-auto">
            <Button className="w-full">
              Meus Pedidos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
