'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { BuilderWizard } from '@/components/builder/builder-wizard';
import { useBuilderStore } from '@/store/builder';

export default function ConfigurePage() {
  const searchParams = useSearchParams();
  const setProductId = useBuilderStore((s) => s.setProductId);

  useEffect(() => {
    const productId = searchParams.get('productId');
    if (productId) {
      setProductId(productId);
    }
  }, [searchParams, setProductId]);

  return <BuilderWizard />;
}
