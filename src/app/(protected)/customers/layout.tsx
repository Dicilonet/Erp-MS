
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

  const getCurrentTab = () => {
    // Exact match first
    if (pathname === '/customers/metrics') {
      return '/customers/metrics';
    }
    // Default to management for the root or any other sub-path like customer details
    return '/customers';
  };
  
  return (
    <div className="space-y-6">
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <Users className="h-8 w-8" />
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{t('page.title')}</h1>
                <p className="text-muted-foreground">{t('page.description')}</p>
            </div>
        </div>

        <Tabs value={getCurrentTab()} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                {customerNavItems.map(item => (
                    <TabsTrigger key={item.href} value={item.href} asChild>
                        <Link href={item.href}>
                             {item.icon}
                             <span className="ml-2">{t(item.labelKey as any)}</span>
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
