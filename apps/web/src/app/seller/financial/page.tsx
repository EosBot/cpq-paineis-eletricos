'use client';

import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useFinancialTransactions } from '@/lib/api/hooks/use-seller';
import type { FinancialTransaction } from '@/lib/api/types';

export default function SellerFinancialPage() {
  const { data, isLoading } = useFinancialTransactions();
  const transactions = data?.data ?? [];

  const totalCredits = transactions
    .filter((t: FinancialTransaction) => t.direction === 'CREDIT')
    .reduce((sum: number, t: FinancialTransaction) => sum + t.amount, 0);

  const totalDebits = transactions
    .filter((t: FinancialTransaction) => t.direction === 'DEBIT')
    .reduce((sum: number, t: FinancialTransaction) => sum + t.amount, 0);

  const balance = totalCredits - totalDebits;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold tracking-tight">Financeiro</h1>
        <p className="mt-1 text-muted-foreground">
          Contas a pagar e a receber
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border/50 bg-card p-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">A Receber</p>
              <p className="text-xl font-bold text-emerald-500">
                R$ {totalCredits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border/50 bg-card p-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <TrendingDown className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">A Pagar</p>
              <p className="text-xl font-bold text-destructive">
                R$ {totalDebits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-border/50 bg-card p-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Saldo</p>
              <p className={`text-xl font-bold ${balance >= 0 ? 'text-emerald-500' : 'text-destructive'}`}>
                R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Transactions Table */}
      <div className="mt-8 rounded-xl border border-border/50 bg-card overflow-hidden">
        <div className="border-b border-border/40 px-6 py-4">
          <h2 className="font-semibold">Lançamentos Recentes</h2>
        </div>
        {isLoading ? (
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">
            Carregando...
          </div>
        ) : transactions.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">
            Nenhuma transação encontrada.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40 bg-muted/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Vencimento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {transactions.slice(0, 20).map((tx: FinancialTransaction) => (
                  <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium">{tx.description ?? '-'}</p>
                      <p className="text-xs text-muted-foreground">{tx.counterpartName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(tx.dueDate).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={tx.direction === 'CREDIT' ? 'success' : 'destructive'}>
                        {tx.direction === 'CREDIT' ? 'Receita' : 'Despesa'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          tx.status === 'PAGO'
                            ? 'success'
                            : tx.status === 'PENDENTE'
                            ? 'outline'
                            : 'destructive'
                        }
                      >
                        {tx.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-sm font-semibold ${
                        tx.direction === 'CREDIT' ? 'text-emerald-500' : 'text-destructive'
                      }`}>
                        {tx.direction === 'CREDIT' ? '+' : '-'} R${' '}
                        {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
