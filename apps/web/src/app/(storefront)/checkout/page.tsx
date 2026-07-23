'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Truck, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart, useCheckout } from '@/lib/api/hooks/use-storefront';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cart, isLoading: cartLoading } = useCart();
  const checkout = useCheckout();

  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [notes, setNotes] = useState('');

  const subtotal = cart?.items.reduce((sum: number, item) => sum + item.unitPrice * item.quantity, 0) ?? 0;
  const shippingCost = shippingMethod === 'express' ? 49.90 : 0;
  const total = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await checkout.mutateAsync({
        shippingAddress,
        shippingMethod,
        notes: notes || undefined,
      });
      const orderId = (result as unknown as { data: { id: string } }).data.id;
      router.push(`/orders/${orderId}/confirmation`);
    } catch (err) {
      console.error('Checkout failed:', err);
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!cart?.items.length) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-xl font-semibold">Seu carrinho está vazio</h2>
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
          <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Carrinho
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Finalizar Compra</h1>
        </motion.div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-border/50 bg-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Endereço de Entrega</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Logradouro</label>
                  <Input
                    required
                    placeholder="Rua, Avenida..."
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Número</label>
                  <Input
                    required
                    placeholder="123"
                    value={shippingAddress.number}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, number: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Complemento</label>
                  <Input
                    placeholder="Apto, Sala..."
                    value={shippingAddress.complement}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, complement: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Bairro</label>
                  <Input
                    required
                    placeholder="Bairro"
                    value={shippingAddress.neighborhood}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, neighborhood: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">CEP</label>
                  <Input
                    required
                    placeholder="00000-000"
                    value={shippingAddress.zipCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Cidade</label>
                  <Input
                    required
                    placeholder="Cidade"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Estado</label>
                  <Input
                    required
                    placeholder="UF"
                    maxLength={2}
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value.toUpperCase() })}
                  />
                </div>
              </div>
            </motion.div>

            {/* Shipping Method */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-border/50 bg-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Método de Entrega</h2>
              </div>
              <div className="space-y-3">
                <label className="flex items-center justify-between rounded-lg border border-border/50 p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      value="standard"
                      checked={shippingMethod === 'standard'}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="h-4 w-4"
                    />
                    <div>
                      <p className="font-medium">Padrão</p>
                      <p className="text-sm text-muted-foreground">10-15 dias úteis</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-green-600">Grátis</span>
                </label>
                <label className="flex items-center justify-between rounded-lg border border-border/50 p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      value="express"
                      checked={shippingMethod === 'express'}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="h-4 w-4"
                    />
                    <div>
                      <p className="font-medium">Expresso</p>
                      <p className="text-sm text-muted-foreground">3-5 dias úteis</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold">R$ 49,90</span>
                </label>
              </div>
            </motion.div>

            {/* Notes */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border border-border/50 bg-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Observações</h2>
              </div>
              <textarea
                className="w-full rounded-lg border border-border/50 bg-background p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                rows={3}
                placeholder="Instruções especiais de entrega..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-border/50 bg-card p-6">
              <h2 className="text-lg font-semibold">Resumo do Pedido</h2>
              <div className="mt-4 space-y-3">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground truncate pr-2">
                      {item.product?.name ?? 'Produto'} x{item.quantity}
                    </span>
                    <span className="font-medium">
                      R$ {(item.unitPrice * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
                <div className="border-t border-border pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete</span>
                    <span>{shippingCost > 0 ? `R$ ${shippingCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Grátis'}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-lg font-bold">
                      R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                className="mt-6 w-full h-12 text-base"
                size="lg"
                disabled={checkout.isPending}
              >
                {checkout.isPending ? 'Processando...' : 'Confirmar Pedido'}
              </Button>
              {checkout.isError && (
                <p className="mt-2 text-sm text-destructive text-center">
                  Erro ao processar pedido. Tente novamente.
                </p>
              )}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3" />
                <span>Pagamento mockado — sem cobrança real</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
