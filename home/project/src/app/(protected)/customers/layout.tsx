'use client';

import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users } from 'lucide-react';

export default function CustomersLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation('customers');
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 sm:mt-0">
        <div className="flex items-center gap-4">
          <Users className="h-8 w-8" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{t('page.title')}</h1>
            <p className="text-muted-foreground">{t('page.description')}</p>
          </div>
        </div>
      </div>

      <Tabs value={pathname} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="/customers" asChild>
            <Link href="/customers">{t('nav.management')}</Link>
          </TabsTrigger>
          <TabsTrigger value="/customers/metrics" asChild>
            <Link href="/customers/metrics">{t('nav.metrics')}</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-6">{children}</div>
    </div>
  );
}
