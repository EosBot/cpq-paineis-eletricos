'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart, useUpdateCartItem, useRemoveFromCart } from '@/lib/api/hooks/use-storefront';

export default function CartPage() {
  const router = useRouter();
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveFromCart();

  const subtotal = cart?.items.reduce((sum: number, item) => sum + item.unitPrice * item.quantity, 0) ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">Carrinho de Compras</h1>
          <p className="mt-2 text-muted-foreground">
            {cart?.items?.length ?? 0} {cart?.items?.length === 1 ? 'item' : 'itens'}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="mt-8 space-y-4">
            {Array.from({ length: 3 }).map((_: unknown, i: number) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : cart?.items && cart.items.length > 0 ? (
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item: typeof cart.items[number], i: number) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 rounded-xl border border-border/50 bg-card p-4"
                >
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                    <ShoppingBag className="h-6 w-6 text-muted-foreground/50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{item.product?.name ?? 'Produto'}</h3>
                    <p className="text-sm text-muted-foreground">
                      R$ {item.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / un.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateItem.mutate({ itemId: item.id, quantity: Math.max(1, item.quantity - 1) })}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateItem.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="text-right w-24">
                    <span className="font-semibold">
                      R$ {(item.unitPrice * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem.mutate(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-xl border border-border/50 bg-card p-6">
                <h2 className="text-lg font-semibold">Resumo do Pedido</h2>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete</span>
                    <span className="text-muted-foreground">A calcular</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-lg font-bold">
                      R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                <Button className="mt-6 w-full h-12 text-base" size="lg" onClick={() => router.push('/checkout')}>
                  Finalizar Compra
                </Button>
                <Link href="/products">
                  <Button variant="ghost" className="mt-2 w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continuar Comprando
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-16 text-center">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/30" />
            <h2 className="mt-4 text-xl font-semibold">Seu carrinho está vazio</h2>
            <p className="mt-2 text-muted-foreground">
              Explore nosso catálogo e encontre os melhores componentes.
            </p>
            <Link href="/products">
              <Button className="mt-6" size="lg">
                Ver Catálogo
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border/40 py-10 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <span className="font-semibold">CPQ Painéis</span>
            <p className="text-sm text-muted-foreground">
              &copy; 2026 CPQ Painéis. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
