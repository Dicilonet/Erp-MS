
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { LayoutTemplate, Construction } from 'lucide-react';

// Datos de ejemplo que usaremos para mostrar la estructura
const landingPageCategories = [
  {
    id: 'b2b-services',
    title: 'Servicios B2B',
    description: 'Plantillas diseñadas para la captación de clientes empresariales.',
    pages: [
      { id: 'b2b-1', name: 'Landing Page Corporativa Clásica' },
    ]
  },
  {
    id: 'event-promotion',
    title: 'Promoción de Eventos',
    description: 'Páginas para promocionar webinars, conferencias o eventos locales.',
    pages: []
  },
  {
    id: 'product-launch',
    title: 'Lanzamiento de Productos',
    description: 'Diseños de alto impacto para presentar un nuevo producto al mercado.',
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
                        <CardTitle>{category.title}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {category.pages.length > 0 ? (
                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {category.pages.map(page => (
                                    <div key={page.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                                        <p className="font-semibold">{page.name}</p>
                                    </div>
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
