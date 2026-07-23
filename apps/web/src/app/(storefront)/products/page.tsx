'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/storefront/product-card';
import { useProducts, useCategories } from '@/lib/api/hooks/use-storefront';
import type { Product, Category } from '@/lib/api/types';

function CatalogContent() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId') || undefined;
  const search = searchParams.get('search') || undefined;

  const { data: productsData, isLoading } = useProducts({
    limit: 20,
    categoryId,
    search,
  });
  const { data: categories } = useCategories();

  const selectedCategory = categories?.find((c: typeof categories[number]) => c.id === categoryId);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">
            {selectedCategory ? selectedCategory.name : search ? `Resultados para "${search}"` : 'Catálogo de Produtos'}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {productsData ? `${productsData.meta.total} produtos encontrados` : 'Carregando...'}
          </p>
        </motion.div>

        {/* Search & Filters */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <form action="/products" method="GET" className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="search"
                placeholder="Buscar produtos..."
                defaultValue={search}
                className="pl-10"
              />
            </div>
          </form>
        </div>

        {/* Category Filter Pills */}
        {categories && categories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href="/products"
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                !categoryId
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Todos
            </a>
            {categories.map((cat: typeof categories[number]) => (
              <a
                key={cat.id}
                href={`/products?categoryId=${cat.id}`}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  categoryId === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {cat.name}
              </a>
            ))}
          </div>
        )}

        {/* Products Grid */}
        <div className="mt-8">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_: unknown, i: number) => (
                <div key={i} className="h-72 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : productsData && productsData.data.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {productsData.data.map((product: typeof productsData.data[number], i: number) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border py-20 text-center">
              <Search className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <p className="mt-4 text-muted-foreground">
                Nenhum produto encontrado.
              </p>
            </div>
          )}
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

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <CatalogContent />
    </Suspense>
  );
}
