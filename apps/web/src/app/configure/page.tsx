'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ConfigureRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const newId = `config-${Date.now()}`;
    router.replace(`/configure/${newId}`);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">Carregando...</p>
    </div>
  );
}
