'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Wrench } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/api/types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  index?: number;
}

export function ProductCard({ product, onAddToCart, index = 0 }: ProductCardProps) {
  const isCPQ = product.type === 'CPQ_CONFIGURABLE';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
    >
      <Card className="group relative overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden">
            {product.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.images[0].url}
                alt={product.images[0].altText || product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                {isCPQ ? (
                  <Wrench className="h-12 w-12 text-muted-foreground/40" />
                ) : (
                  <ShoppingCart className="h-12 w-12 text-muted-foreground/40" />
                )}
              </div>
            )}
            <div className="absolute top-3 left-3">
              {isCPQ ? (
                <Badge variant="secondary" className="gap-1">
                  <Wrench className="h-3 w-3" />
                  Configure
                </Badge>
              ) : (
                <Badge variant="secondary">Padrão</Badge>
              )}
            </div>
          </div>
        </Link>
        <CardContent className="p-4">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          {product.category && (
            <p className="mt-1 text-xs text-muted-foreground">{product.category.name}</p>
          )}
          <div className="mt-3 flex items-center justify-between">
            {product.price != null ? (
              <span className="text-lg font-bold text-primary">
                R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            ) : (
              <span className="text-sm font-medium text-muted-foreground">Sob consulta</span>
            )}
            {!isCPQ && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCart?.(product.id);
                }}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
