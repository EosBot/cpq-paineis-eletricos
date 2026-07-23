'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useStockLevels } from '@/lib/api/hooks/use-seller';

export default function SellerInventoryPage() {
  const { data, isLoading } = useStockLevels();
  const stockLevels = data?.data ?? [];

  const lowStockItems = stockLevels.filter(
    (item) => item.minimumStock > 0 && item.quantity <= item.minimumStock,
  );

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold tracking-tight">Estoque</h1>
        <p className="mt-1 text-muted-foreground">
          Controle de inventário e movimentações
        </p>
      </motion.div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4"
        >
          <div className="flex items-center gap-2 text-amber-500">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium text-sm">
              {lowStockItems.length} {lowStockItems.length === 1 ? 'produto com estoque baixo' : 'produtos com estoque baixo'}
            </span>
          </div>
        </motion.div>
      )}

      {/* Stock Table */}
      <div className="mt-6 rounded-xl border border-border/50 bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40 bg-muted/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Quantidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Custo Médio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Mínimo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-muted-foreground">
                    Carregando...
                  </td>
                </tr>
              ) : stockLevels.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-muted-foreground">
                    Nenhum item no estoque.
                  </td>
                </tr>
              ) : (
                stockLevels.map((item) => {
                  const isLow = item.minimumStock > 0 && item.quantity <= item.minimumStock;
                  return (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                            <Package className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <span className="text-sm font-medium">
                            {item.product?.name ?? item.productId}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">{item.quantity}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {item.averageCost > 0
                          ? `R$ ${item.averageCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                          : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{item.minimumStock}</td>
                      <td className="px-6 py-4">
                        <Badge variant={isLow ? 'destructive' : 'success'}>
                          {isLow ? 'Baixo' : 'Normal'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
