'use client';

import { HeroSection } from '@/components/landing/transport-1/hero-section';
import { ServicesSection } from '@/components/landing/transport-1/services-section';
import { WhyChooseUsSection } from '@/components/landing/transport-1/why-choose-us-section';
import { FleetGallerySection } from '@/components/landing/transport-1/fleet-gallery-section';
import { QuoteSection } from '@/components/landing/transport-1/quote-section';
import { RecommendationSection } from '@/components/landing/transport-1/recommendation-section';
import { Footer } from '@/components/landing/transport-1/footer';

export default function LandingTransportPage() {
  const clientId = "demo-transport-1";
  const products = [
      { id: 'prod1', name: 'Transporte Nacional' },
      { id: 'prod2', name: 'Logística de Almacenamiento' },
      { id: 'prod3', name: 'Carga Internacional' },
  ];

  return (
    <div className="bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200 font-sans">
      <HeroSection />
      <main>
        <ServicesSection />
        <WhyChooseUsSection />
        <FleetGallerySection />
        <QuoteSection />
        <RecommendationSection clientId={clientId} products={products} />
      </main>
      <Footer />
    </div>
  );
}
