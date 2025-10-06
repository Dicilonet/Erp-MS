'use client';

import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Library, Map, Ticket, ScanLine, Brush, Link as LinkIcon, CalendarDays, Rocket, ClipboardList } from 'lucide-react';
import Link from 'next/link';

const marketingNavItems = [
  { href: '/marketing/campaigns', labelKey: 'nav.campaigns', icon: <Rocket className="h-5 w-5" /> },
  { href: '/marketing/forms', labelKey: 'nav.forms', icon: <ClipboardList className="h-5 w-5" /> },
  { href: '/marketing/coupons', labelKey: 'nav.coupons', icon: <Ticket className="h-5 w-5" /> },
  { href: '/marketing/coupons/scanner', labelKey: 'nav.scanner', icon: <ScanLine className="h-5 w-5" /> },
  { href: '/marketing/designer', labelKey: 'nav.designer', icon: <Brush className="h-5 w-5" /> },
  { href: '/marketing/content-pool', labelKey: 'nav.contentPool', icon: <Library className="h-5 w-5" /> },
  { href: '/marketing/geomarketing', labelKey: 'nav.geomarketing', icon: <Map className="h-5 w-5" /> },
  { href: '/marketing/connections', labelKey: 'nav.connections', icon: <LinkIcon className="h-5 w-5" /> },
  { href: '/marketing/automation', labelKey: 'nav.automation', icon: <CalendarDays className="h-5 w-5" /> },
];

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation('marketing');
  const pathname = usePathname();

  const getCurrentTab = () => {
    // Busca la coincidencia más específica primero
    const specificMatch = marketingNavItems.find(item => pathname === item.href);
    if (specificMatch) return specificMatch.href;
    
    // Fallback para rutas anidadas, por ejemplo /marketing/coupons/scanner debe activar la pestaña /marketing/coupons
    const bestMatch = marketingNavItems
        .filter(item => pathname.startsWith(item.href))
        .sort((a, b) => b.href.length - a.href.length)[0];

    return bestMatch ? bestMatch.href : '/marketing/campaigns';
  };
  
  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <h1 className="text-2xl sm:text-3xl font-bold">{t('page.title')}</h1>
       </div>
      <Tabs value={getCurrentTab()} className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 md:grid-cols-9 h-auto p-1">
            {marketingNavItems.map(item => (
                <TabsTrigger key={item.href} value={item.href} asChild className="flex-col h-auto py-2 gap-1.5 text-xs sm:text-sm">
                    <Link href={item.href} className="flex flex-col items-center justify-center gap-1.5">
                        {item.icon}
                        <span className="text-center">{t(item.labelKey as any)}</span>
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
