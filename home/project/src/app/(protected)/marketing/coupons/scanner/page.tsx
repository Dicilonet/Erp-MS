
'use client';

import { useTranslation } from 'react-i18next';
import { ScanLine } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// CORRECCIÓN: Carga dinámica del componente para evitar errores de SSR con la API del navegador.
const CouponScanner = dynamic(
  () => import('@/components/marketing/coupons/coupon-scanner').then(mod => mod.CouponScanner),
  { 
    ssr: false,
    loading: () => (
        <div className="space-y-4">
            <Skeleton className="w-full aspect-video rounded-lg" />
            <Skeleton className="h-10 w-40 mx-auto" />
            <Skeleton className="h-20 w-full" />
        </div>
    )
  }
);


export default function CouponScannerPage() {
  const { t } = useTranslation('marketing');

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4 self-start">
          <ScanLine className="h-8 w-8" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{t('scanner.title')}</h1>
            <p className="text-muted-foreground">{t('scanner.description')}</p>
          </div>
        </div>
      </div>
      {/* CORRECCIÓN: Pasar la función `t` como prop al componente. */}
      <CouponScanner t={t} />
    </>
  );
}
