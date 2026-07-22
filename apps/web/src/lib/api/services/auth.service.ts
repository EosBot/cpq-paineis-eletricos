'use client';

import { signIn as nextAuthSignIn, signOut as nextAuthSignOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { api, type LoginResponse } from '@/lib/api';

export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';
  const isSuperAdmin = session?.user?.isSuperAdmin ?? false;

  async function login(email: string, password: string, tenantId?: string) {
    const result = await nextAuthSignIn('credentials', {
      email,
      password,
      tenantId,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: 'Credenciais inválidas' };
    }

    if (session?.accessToken) {
      api.setAccessToken(session.accessToken);
    }
    if (session?.user?.tenantId) {
      api.setTenantId(session.user.tenantId);
    }

    return { success: true };
  }

  async function logout() {
    await nextAuthSignOut({ redirect: false });
    api.setAccessToken(null);
    api.setTenantId(null);
    router.push('/login');
    router.refresh();
  }

  function setApiAuth() {
    if (session?.accessToken) {
      api.setAccessToken(session.accessToken);
    }
    if (session?.user?.tenantId) {
      api.setTenantId(session.user.tenantId);
    }
  }

  return {
    session,
    status,
    isLoading,
    isAuthenticated,
    isSuperAdmin,
    user: session?.user,
    login,
    logout,
    update,
    setApiAuth,
  };
}

export type { LoginResponse };
