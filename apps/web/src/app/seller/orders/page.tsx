'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOrders } from '@/lib/api/hooks/use-seller';
import type { Order } from '@/lib/api/types';

function OrderRow({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);

  const statusColor: Record<string, string> = {
    Draft: 'bg-muted text-muted-foreground',
    CONFIRMED: 'bg-emerald-500/15 text-emerald-500',
    CustomerApproved: 'bg-emerald-500/15 text-emerald-500',
    IN_PRODUCTION: 'bg-blue-500/15 text-blue-500',
    READY_TO_SHIP: 'bg-amber-500/15 text-amber-500',
    Shipped: 'bg-purple-500/15 text-purple-500',
    Delivered: 'bg-emerald-500/15 text-emerald-500',
    Cancelled: 'bg-destructive/15 text-destructive',
  };

  return (
    <div className="border-b border-border/40 last:border-0">
      <div
        className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">#{order.orderNumber}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(order.createdAt).toLocaleDateString('pt-BR')}
          </p>
        </div>
        <div className="hidden sm:block text-sm text-muted-foreground">
          {order.items?.length ?? 0} itens
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold">
            R$ {(order.totalAmount ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <Badge className={statusColor[order.status] ?? 'bg-muted text-muted-foreground'}>
          {order.status}
        </Badge>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {expanded && order.items && order.items.length > 0 && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="overflow-hidden bg-muted/20"
        >
          <div className="px-6 py-4 space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.productName} x{item.quantity}
                </span>
                <span className="font-medium">
                  R$ {(item.totalPrice ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function SellerOrdersPage() {
  const { data, isLoading } = useOrders();
  const orders = data?.data ?? [];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold tracking-tight">Pedidos</h1>
        <p className="mt-1 text-muted-foreground">
          Gerencie os pedidos dos seus clientes
        </p>
      </motion.div>

      <div className="mt-6 rounded-xl border border-border/50 bg-card overflow-hidden">
        {isLoading ? (
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">
            Carregando...
          </div>
        ) : orders.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">
            Nenhum pedido ainda.
          </div>
        ) : (
          <div>{orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}</div>
        )}
      </div>
    </div>
  );
}
