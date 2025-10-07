
'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BatchCreator } from './batch-creator';
import { AdminList } from './admin-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IndividualCouponCreator } from './individual-coupon-creator';


export function CouponDashboard() {
  const { t } = useTranslation('marketing');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreation = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
     <Tabs defaultValue="batch" className="w-full">
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
        <TabsTrigger value="batch">{t('coupons.tabs.batch')}</TabsTrigger>
        <TabsTrigger value="individual">{t('coupons.tabs.individual')}</TabsTrigger>
        <TabsTrigger value="list">{t('coupons.tabs.list')}</TabsTrigger>
      </TabsList>
      <TabsContent value="batch" className="mt-6">
        <BatchCreator onCreated={handleCreation} />
      </TabsContent>
      <TabsContent value="individual" className="mt-6">
        <IndividualCouponCreator />
      </TabsContent>
      <TabsContent value="list" className="mt-6">
        <AdminList key={refreshKey} />
      </TabsContent>
    </Tabs>
  );
}
