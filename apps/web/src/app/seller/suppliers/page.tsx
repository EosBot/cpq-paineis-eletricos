'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSuppliers, useCreateSupplier } from '@/lib/api/hooks/use-seller';
import type { Supplier } from '@/lib/api/types';

export default function SellerSuppliersPage() {
  const { data, isLoading } = useSuppliers();
  const createSupplier = useCreateSupplier();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    legalName: '',
    taxId: '',
    contactName: '',
    email: '',
    phone: '',
  });

  const suppliers = data?.data ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createSupplier.mutateAsync(formData);
    setShowForm(false);
    setFormData({ name: '', legalName: '', taxId: '', contactName: '', email: '', phone: '' });
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fornecedores</h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie seus fornecedores e compras
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Fornecedor
        </Button>
      </motion.div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-xl bg-card p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Novo Fornecedor</h2>
                <button onClick={() => setShowForm(false)} className="rounded-lg p-1.5 hover:bg-muted">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Nome Fantasia</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="WEG Componentes"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Razão Social</label>
                  <Input
                    value={formData.legalName}
                    onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                    placeholder="WEG S.A."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">CNPJ</label>
                  <Input
                    value={formData.taxId}
                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                    placeholder="00.000.000/0001-00"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Contato</label>
                    <Input
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      placeholder="João Silva"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Telefone</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(11) 3333-3333"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contato@fornecedor.com"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createSupplier.isPending}>
                    {createSupplier.isPending ? 'Salvando...' : 'Criar'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suppliers List */}
      {isLoading ? (
        <div className="mt-6 rounded-xl border border-border/50 bg-card px-6 py-10 text-center text-sm text-muted-foreground">
          Carregando...
        </div>
      ) : suppliers.length === 0 ? (
        <div className="mt-6 rounded-xl border border-border/50 bg-card px-6 py-10 text-center text-sm text-muted-foreground">
          Nenhum fornecedor cadastrado.
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-border/50 bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40 bg-muted/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Fornecedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  CNPJ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {suppliers.map((supplier: Supplier) => (
                <tr key={supplier.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{supplier.name}</p>
                        {supplier.legalName && (
                          <p className="text-xs text-muted-foreground">{supplier.legalName}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm">{supplier.contactName}</p>
                    <p className="text-xs text-muted-foreground">{supplier.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{supplier.taxId ?? '-'}</td>
                  <td className="px-6 py-4">
                    <Badge variant={supplier.isActive ? 'success' : 'outline'}>
                      {supplier.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
