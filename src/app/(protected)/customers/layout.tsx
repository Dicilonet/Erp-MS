'use client';

import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, BarChart } from 'lucide-react';
import Link from 'next/link';

const customerNavItems = [
  { href: '/customers', labelKey: 'nav.management', icon: <Users className="h-5 w-5" /> },
  { href: '/customers/metrics', labelKey: 'nav.metrics', icon: <BarChart className="h-5 w-5" /> },
];

export default function CustomersLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation('customers');
  const pathname = usePathname();

  // Encuentra la pestaña activa, incluso para subrutas como /customers/[id]
  const getCurrentTab = () => {
    const bestMatch = customerNavItems
        .filter(item => pathname.startsWith(item.href))
        .sort((a, b) => b.href.length - a.href.length)[0];
    return bestMatch ? bestMatch.href : '/customers';
  };
  
  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <h1 className="text-2xl sm:text-3xl font-bold">{t('page.title')}</h1>
       </div>
      <Tabs value={getCurrentTab()} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 md:grid-cols-8 h-auto">
            {customerNavItems.map(item => (
                <TabsTrigger key={item.href} value={item.href} asChild className="flex-col sm:flex-row h-auto py-2 sm:py-1.5">
                    <Link href={item.href} className="flex items-center gap-2">
                        {item.icon}
                        <span>{t(item.labelKey as any)}</span>
                    </Link>
                </TabsTrigger>
            ))}
        </TabsList>
         <div className="mt-6">
            {children}
        </div>
      </Tabs>
    </div>
  );
}
