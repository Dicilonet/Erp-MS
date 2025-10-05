'use client';

import { HeroSection } from '@/components/landing/kleidung-1/hero-section';
import { CollectionSection } from '@/components/landing/kleidung-1/collection-section';
import { AboutSection } from '@/components/landing/kleidung-1/about-section';
import { TestimonialsSection } from '@/components/landing/kleidung-1/testimonials-section';
import { RecommendationSection } from '@/components/landing/kleidung-1/recommendation-section';
import { LocationSection } from '@/components/landing/kleidung-1/location-section';
import { Footer } from '@/components/landing/kleidung-1/footer';

export default function LandingKleidungPage() {
  const clientId = "demo-kleidung-1"; // ID de cliente de ejemplo para el formulario
  const products = [
      { id: 'prod1', name: 'Colección Primavera/Verano' },
      { id: 'prod2', name: 'Nueva Línea de Accesorios' },
      { id: 'prod3', name: 'Edición Limitada Otoño' },
  ];

  return (
    <div className="bg-white text-gray-800 dark:bg-gray-950 dark:text-gray-200 font-sans">
      <HeroSection />
      <main>
        <CollectionSection />
        <AboutSection />
        <TestimonialsSection />
        <RecommendationSection clientId={clientId} products={products} />
        <LocationSection />
      </main>
      <Footer />
    </div>
  );
}
