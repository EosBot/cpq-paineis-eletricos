'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface PlatformStats {
  tenants: number;
  users: number;
  components: number;
  configurations: number;
  quotes: number;
  orders: number;
}

interface Tenant {
  id: string;
  name: string;
  slug: string;
  defaultCurrency: string;
  createdAt: string;
  _count: {
    memberships: number;
    components: number;
    configurations: number;
    quotes: number;
  };
  privacyConfig: {
    dpoName: string | null;
    dpoEmail: string | null;
    lgpdComplianceEnabled: boolean;
  } | null;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

export function SuperAdminDashboard() {
  const [stats] = useState<PlatformStats>({ tenants: 0, users: 0, components: 0, configurations: 0, quotes: 0, orders: 0 });
  const [tenants] = useState<Tenant[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'tenants' | 'users'>('overview');

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b px-6">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold tracking-tight text-red-600">SUPER ADMIN</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-sm text-muted-foreground">CPQ Platform</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Super Admin</span>
        </div>
      </header>

      {/* Tabs */}
      <nav className="flex border-b px-6">
        {(['overview', 'tenants', 'users'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'overview' && 'Visão Geral'}
            {tab === 'tenants' && 'Montadores'}
            {tab === 'users' && 'Usuários'}
            {activeTab === tab && (
              <motion.div
                layoutId="super-admin-tab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"
              />
            )}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Visão Geral da Plataforma</h1>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Montadores', value: stats.tenants, color: 'bg-blue-50 text-blue-700' },
                { label: 'Usuários', value: stats.users, color: 'bg-green-50 text-green-700' },
                { label: 'Componentes', value: stats.components, color: 'bg-purple-50 text-purple-700' },
                { label: 'Configurações', value: stats.configurations, color: 'bg-orange-50 text-orange-700' },
                { label: 'Quotes', value: stats.quotes, color: 'bg-cyan-50 text-cyan-700' },
                { label: 'Pedidos', value: stats.orders, color: 'bg-red-50 text-red-700' },
              ].map((stat) => (
                <div key={stat.label} className={`rounded-lg border p-5 ${stat.color}`}>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="mt-1 text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tenants' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Montadores (Tenants)</h1>
              <button className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 active:scale-[0.97]">
                + Novo Montador
              </button>
            </div>
            <div className="rounded-lg border">
              <table className="w-full text-sm">
                <thead className="border-b bg-secondary/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Nome</th>
                    <th className="px-4 py-3 text-left font-medium">Slug</th>
                    <th className="px-4 py-3 text-center font-medium">Usuários</th>
                    <th className="px-4 py-3 text-center font-medium">Componentes</th>
                    <th className="px-4 py-3 text-center font-medium">Quotes</th>
                    <th className="px-4 py-3 text-center font-medium">LGPD</th>
                    <th className="px-4 py-3 text-left font-medium">Criado em</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map((tenant) => (
                    <tr key={tenant.id} className="border-b transition-colors hover:bg-secondary/30">
                      <td className="px-4 py-3 font-medium">{tenant.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{tenant.slug}</td>
                      <td className="px-4 py-3 text-center">{tenant._count.memberships}</td>
                      <td className="px-4 py-3 text-center">{tenant._count.components}</td>
                      <td className="px-4 py-3 text-center">{tenant._count.quotes}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          tenant.privacyConfig?.lgpdComplianceEnabled
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {tenant.privacyConfig?.lgpdComplianceEnabled ? 'Conforme' : 'Pendente'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(tenant.createdAt)}</td>
                    </tr>
                  ))}
                  {tenants.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                            Nenhum montador cadastrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Todos os Usuários</h1>
            <div className="rounded-lg border">
              <div className="border-b p-4">
                <input
                  type="text"
                  placeholder="Buscar por nome ou email..."
                  className="w-full max-w-sm rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="p-8 text-center text-muted-foreground">
                Use a busca para encontrar usuários.
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
