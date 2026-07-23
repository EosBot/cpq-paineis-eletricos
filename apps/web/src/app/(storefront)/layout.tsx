'use client';

import { StorefrontHeader } from '@/components/storefront/storefront-header';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <StorefrontHeader />
      {children}
    </div>
  );
}
