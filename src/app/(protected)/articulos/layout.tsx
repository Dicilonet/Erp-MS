
'use client';

import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, LayoutTemplate } from 'lucide-react';

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation(['articles', 'common']);
  const pathname = usePathname();

  const getCurrentTab = () => {
    if (pathname.startsWith('/articulos/landing-pages')) {
      return '/articulos/landing-pages';
    }
    return '/articulos';
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <Package className="h-8 w-8" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{t('title')}</h1>
            <p className="text-muted-foreground">{t('description')}</p>
          </div>
        </div>

      <Tabs value={getCurrentTab()} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="/articulos" asChild>
            <Link href="/articulos">{t('tabs.title')}</Link>
          </TabsTrigger>
          <TabsTrigger value="/articulos/landing-pages" asChild>
            <Link href="/articulos/landing-pages">{t('common:nav.landingPages')}</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-6">{children}</div>
    </div>
  );
}
