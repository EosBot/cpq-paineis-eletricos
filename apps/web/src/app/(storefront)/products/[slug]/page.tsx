'use client';

import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Wrench, ArrowLeft, Zap, Shield, Truck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProduct, useAddToCart } from '@/lib/api/hooks/use-storefront';

function ProductDetailContent() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: product, isLoading } = useProduct(slug);
  const addToCart = useAddToCart();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-2xl bg-muted" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
              <div className="h-24 w-full animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Produto não encontrado</h1>
          <Link href="/products" className="mt-4 inline-block">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao catálogo
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isCPQ = product.type === 'CPQ_CONFIGURABLE';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-foreground transition-colors">
            Catálogo
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </motion.nav>

        {/* Product Detail */}
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-muted to-muted/50"
          >
            {product.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.images[0].url}
                alt={product.images[0].altText || product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                {isCPQ ? (
                  <Wrench className="h-20 w-20 text-muted-foreground/30" />
                ) : (
                  <ShoppingCart className="h-20 w-20 text-muted-foreground/30" />
                )}
              </div>
            )}
            <div className="absolute top-4 left-4">
              {isCPQ ? (
                <Badge variant="secondary" className="gap-1 text-sm">
                  <Wrench className="h-3.5 w-3.5" />
                  Configurável
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-sm">
                  Produto Padrão
                </Badge>
              )}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col"
          >
            {product.category && (
              <span className="text-sm font-medium text-primary">{product.category.name}</span>
            )}
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{product.name}</h1>

            {product.description && (
              <p className="mt-4 text-muted-foreground leading-relaxed">{product.description}</p>
            )}

            {/* Price */}
            <div className="mt-6">
              {product.price != null ? (
                <div>
                  <span className="text-3xl font-bold text-primary">
                    R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <p className="mt-1 text-sm text-muted-foreground">
                    ou 12x de R$ {(product.price / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ) : (
                <span className="text-xl font-medium text-muted-foreground">Preço sob consulta</span>
              )}
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {isCPQ ? (
                <Link href={`/configure?productId=${product.id}`} className="flex-1">
                  <Button size="lg" className="w-full h-12 text-base gap-2">
                    <Wrench className="h-5 w-5" />
                    Monte seu Painel
                  </Button>
                </Link>
              ) : (
                <Button
                  size="lg"
                  className="flex-1 h-12 text-base gap-2"
                  onClick={() => addToCart.mutate({ productId: product.id, quantity: 1 })}
                  disabled={addToCart.isPending}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {addToCart.isPending ? 'Adicionando...' : 'Adicionar ao Carrinho'}
                </Button>
              )}
            </div>

            {/* Trust Badges */}
            <div className="mt-10 grid grid-cols-3 gap-4 rounded-xl border border-border/50 bg-card p-4">
              <div className="flex flex-col items-center gap-2 text-center">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground">Garantia</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground">Entrega Nacional</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <Zap className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground">Pronta Entrega</span>
              </div>
            </div>
          </motion.div>
        </div>
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

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ProductDetailContent />
    </Suspense>
  );
}
