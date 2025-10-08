
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
      { id: 'gastronomia-2', name: 'Landing para Cafeterías', href: '/articulos/landing-pages/gastronomia-2' },
    ]
  },
  {
    id: 'reisen',
    titleKey: 'landingPages.categories.travel',
    descriptionKey: 'landingPages.categories.travelDescription',
    pages: [
      { id: 'reisen-1', name: 'Landing para Agencias de Viajes', href: '/articulos/landing-pages/reisen-1' },
      { id: 'reisen-2', name: 'Landing para Tours Urbanos', href: '/articulos/landing-pages/reisen-2' },
    ]
  },
  {
    id: 'immobilien',
    titleKey: 'landingPages.categories.realEstate',
    descriptionKey: 'landingPages.categories.realEstateDescription',
    pages: [
      { id: 'immobilien-1', name: 'Landing para Inmobiliarias', href: '/articulos/landing-pages/immobilien-1' },
    ]
  },
  {
    id: 'hotellerie',
    titleKey: 'landingPages.categories.hospitality',
    descriptionKey: 'landingPages.categories.hospitalityDescription',
    pages: [
        { id: 'hotellerie-1', name: 'Landing para Hoteles', href: '/articulos/landing-pages/hotellerie-1' },
    ]
  },
   {
    id: 'gesundheit',
    titleKey: 'landingPages.categories.health',
    descriptionKey: 'landingPages.categories.healthDescription',
    pages: [
        { id: 'gesundheit-1', name: 'Landing para Praxis / Clínicas', href: '/articulos/landing-pages/gesundheit-1' },
        { id: 'wellness-1', name: 'Landing para Wellness y Masajes', href: '/articulos/landing-pages/wellness-1' },
        { id: 'gesundheit-2', name: 'Landing para Audiología (Hörgeräte)', href: '/articulos/landing-pages/gesundheit-2' },
        { id: 'optik-1', name: 'Landing para Ópticas', href: '/articulos/landing-pages/optik-1' },
    ]
  },
  {
    id: 'beratung',
    titleKey: 'landingPages.categories.consulting',
    descriptionKey: 'landingPages.categories.consultingDescription',
    pages: [
      { id: 'beratung-1', name: 'Landing para Coaches y Consultores', href: '/articulos/landing-pages/beratung-1' },
    ]
  },
   {
    id: 'lebensmittel',
    titleKey: 'landingPages.categories.food',
    descriptionKey: 'landingPages.categories.foodDescription',
    pages: [
      { id: 'lebensmittel-1', name: 'Landing para Tiendas de Alimentación', href: '/articulos/landing-pages/lebensmittel-1' },
    ]
  },
   {
    id: 'haustiere',
    titleKey: 'landingPages.categories.pets',
    descriptionKey: 'landingPages.categories.petsDescription',
    pages: [
      { id: 'haustiere-1', name: 'Landing para Servicios de Mascotas', href: '/articulos/landing-pages/haustiere-1' },
    ]
  },
  {
    id: 'kleidung',
    titleKey: 'landingPages.categories.fashion',
    descriptionKey: 'landingPages.categories.fashionDescription',
    pages: [
      { id: 'kleidung-1', name: 'Landing para Moda y Ropa', href: '/articulos/landing-pages/kleidung-1' },
    ]
  },
  {
    id: 'bildung',
    titleKey: 'landingPages.categories.education',
    descriptionKey: 'landingPages.categories.educationDescription',
    pages: [
      { id: 'bildung-1', name: 'Landing para Centros Educativos', href: '/articulos/landing-pages/bildung-1' },
    ]
  },
  {
    id: 'finanzdienste',
    titleKey: 'landingPages.categories.financial',
    descriptionKey: 'landingPages.categories.financialDescription',
    pages: [
      { id: 'finanz-1', name: 'Landing para Asesores Financieros', href: '/articulos/landing-pages/finanz-1' },
    ]
  },
  {
    id: 'musik',
    titleKey: 'landingPages.categories.music',
    descriptionKey: 'landingPages.categories.musicDescription',
    pages: [
      { id: 'musik-1', name: 'Landing para Artistas y Eventos', href: '/articulos/landing-pages/musik-1' },
    ]
  },
  {
    id: 'soziales',
    titleKey: 'landingPages.categories.social',
    descriptionKey: 'landingPages.categories.socialDescription',
    pages: [
        { id: 'soziales-1', name: 'Landing para ONGs y Causas Sociales', href: '/articulos/landing-pages/soziales-1' },
    ]
  },
  {
    id: 'sport',
    titleKey: 'landingPages.categories.sports',
    descriptionKey: 'landingPages.categories.sportsDescription',
    pages: [
        { id: 'sport-1', name: 'Landing para Gimnasios y Deporte', href: '/articulos/landing-pages/sport-1' },
    ]
  },
  {
    id: 'technologie',
    titleKey: 'landingPages.categories.technology',
    descriptionKey: 'landingPages.categories.technologyDescription',
    pages: [
        { id: 'technologie-1', name: 'Landing para Start-ups y SaaS', href: '/articulos/landing-pages/technologie-1' },
    ]
  },
  {
    id: 'transport',
    titleKey: 'landingPages.categories.transport',
    descriptionKey: 'landingPages.categories.transportDescription',
    pages: [
        { id: 'transport-1', name: 'Landing para Logística y Transporte', href: '/articulos/landing-pages/transport-1' },
    ]
  },
  {
    id: 'umwelt',
    titleKey: 'landingPages.categories.environment',
    descriptionKey: 'landingPages.categories.environmentDescription',
    pages: [
        { id: 'umwelt-1', name: 'Landing para Proyectos Ecológicos', href: '/articulos/landing-pages/umwelt-1' },
    ]
  },
  {
    id: 'unterhaltung',
    titleKey: 'landingPages.categories.entertainment',
    descriptionKey: 'landingPages.categories.entertainmentDescription',
    pages: [
        { id: 'unterhaltung-1', name: 'Landing para Eventos y Shows', href: '/articulos/landing-pages/unterhaltung-1' },
    ]
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
