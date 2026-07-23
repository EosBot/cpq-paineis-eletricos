'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Wrench, Shield, Zap, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/storefront/product-card';
import { useProducts, useCategories } from '@/lib/api/hooks/use-storefront';
import type { Product, Category } from '@/lib/api/types';

export default function StorefrontHome() {
  const { data: productsData, isLoading: productsLoading } = useProducts({ limit: 8 });
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Zap className="h-4 w-4" />
              Marketplace de Painéis Elétricos
            </div>
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Configure seu painel{' '}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                do seu jeito
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Componentes elétricos de qualidade com cotação instantânea.
              Mais de 40 marcas nacionais e internacionais a um clique.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/configure">
                <Button size="lg" className="h-12 px-8 text-base gap-2">
                  <Wrench className="h-5 w-5" />
                  Monte seu Painel
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base gap-2">
                  Ver Catálogo
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-border/40 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Wrench,
                title: 'Configuração Inteligente',
                description: 'Monte seu painel com assistente passo a passo e validação técnica automática.',
              },
              {
                icon: Shield,
                title: 'Normas Brasileiras',
                description: 'Conformidade com NR-10, NBR 5410 e IEC 61439 para projetos seguros.',
              },
              {
                icon: Package,
                title: 'Componentes Reais',
                description: 'Catálogo com WEG, ABB, Schneider, Phoenix Contact e mais de 40 marcas.',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-xl border border-border/50 bg-card p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="border-b border-border/40 py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-10 text-center"
            >
              <h2 className="text-3xl font-bold tracking-tight">Categorias</h2>
              <p className="mt-2 text-muted-foreground">
                Navegue por tipo de componente
              </p>
            </motion.div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {categories.slice(0, 10).map((cat: Category, i: number) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                >
                  <Link
                    href={`/products?categoryId=${cat.id}`}
                    className="group flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-card p-6 text-center transition-all hover:border-primary/50 hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-primary/10">
                      <Package className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <span className="text-sm font-medium leading-tight">{cat.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-10 flex items-center justify-between"
          >
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Produtos em Destaque</h2>
              <p className="mt-2 text-muted-foreground">
                Componentes elétricos de alta qualidade
              </p>
            </div>
            <Link href="/products">
              <Button variant="ghost" className="gap-2">
                Ver todos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          {productsLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_: unknown, i: number) => (
                <div key={i} className="h-72 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : productsData && productsData.data.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {productsData.data.map((product: Product, i: number) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border py-20 text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <p className="mt-4 text-muted-foreground">
                Nenhum produto cadastrado ainda.
              </p>
              <Link href="/configure">
                <Button className="mt-4" variant="outline">
                  Monte seu primeiro painel
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">CPQ Painéis</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; 2026 CPQ Painéis. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
