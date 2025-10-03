
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { LayoutTemplate, Construction } from 'lucide-react';
import Link from 'next/link';

// Datos de ejemplo que usaremos para mostrar la estructura
const landingPageCategories = [
  {
    id: 'commerce',
    titleKey: 'landingPages.categories.commerce',
    descriptionKey: 'landingPages.categories.commerceDescription',
    pages: [
      { id: 'comercio-1', name: 'Landing E-commerce Moderna', href: '/articulos/landing-pages/comercio-1' },
    ]
  },
  {
    id: 'gastronomy',
    titleKey: 'landingPages.categories.gastronomy',
    descriptionKey: 'landingPages.categories.gastronomyDescription',
    pages: [
      { id: 'gastronomia-1', name: 'Landing para Restaurantes', href: '/articulos/landing-pages/gastronomia-1' },
    ]
  },
  {
    id: 'b2b-services',
    titleKey: 'landingPages.categories.b2b',
    descriptionKey: 'landingPages.categories.b2bDescription',
    pages: []
  },
  {
    id: 'event-promotion',
    titleKey: 'landingPages.categories.events',
    descriptionKey: 'landingPages.categories.eventsDescription',
    pages: []
  },
  {
    id: 'product-launch',
    titleKey: 'landingPages.categories.productLaunch',
    descriptionKey: 'landingPages.categories.productLaunchDescription',
    pages: []
  }
];


export default function LandingPagesPage() {
  const { t } = useTranslation(['articles', 'common']);

  return (
    <div>
        <div className="flex items-center gap-4 mb-6">
            <LayoutTemplate className="h-6 w-6" />
            <div>
                <h2 className="text-xl font-bold">{t('landingPages.title')}</h2>
                <p className="text-muted-foreground">{t('landingPages.description')}</p>
            </div>
        </div>

        <div className="space-y-8">
            {landingPageCategories.map(category => (
                <Card key={category.id}>
                    <CardHeader>
                        <CardTitle>{t(category.titleKey)}</CardTitle>
                        <CardDescription>{t(category.descriptionKey)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {category.pages.length > 0 ? (
                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {category.pages.map(page => (
                                    <Link key={page.id} href={page.href} passHref>
                                        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer h-full">
                                            <p className="font-semibold">{page.name}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 border-2 border-dashed rounded-lg">
                                <Construction className="mx-auto h-12 w-12 text-muted-foreground" />
                                <p className="mt-4 text-muted-foreground">{t('landingPages.emptyCategory')}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
  );
}
