
'use client';

// No se necesita useTranslation aquí, viene del layout padre
import { Ticket } from 'lucide-react';
import { CouponDashboard } from '@/components/marketing/coupons/coupon-dashboard';
import { useTranslation } from 'react-i18next';

export default function CouponsPage() {
  const { t } = useTranslation('marketing');

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4 self-start">
          <Ticket className="h-8 w-8" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{t('coupons.title')}</h1>
            <p className="text-muted-foreground">{t('coupons.description')}</p>
          </div>
        </div>
      </div>
      <CouponDashboard />
    </>
  );
}
