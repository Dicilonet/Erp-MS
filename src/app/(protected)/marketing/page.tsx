'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FullScreenLoader } from '@/components/ui/fullscreen-loader';

export default function MarketingRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/marketing/coupons');
  }, [router]);

  return <FullScreenLoader />;
}
