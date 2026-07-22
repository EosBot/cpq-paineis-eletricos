'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const { data: session } = useSession();
  const router = useRouter();

  async function handleLogout() {
    await signOut({ redirect: false });
    router.push('/login');
    router.refresh();
  }

  if (!session?.user) return null;

  const { user } = session;
  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || user.email[0].toUpperCase();

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b px-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold tracking-tight">CPQ</span>
        {user.isSuperAdmin && (
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
            SUPER ADMIN
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className={cn(
            'flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white',
            user.isSuperAdmin ? 'bg-red-600' : 'bg-primary',
          )}>
            {initials}
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-medium">{user.firstName} {user.lastName}</div>
            <div className="text-[10px] text-muted-foreground">
              {user.isSuperAdmin ? 'Plataforma' : user.roleCode}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
