'use client';

import { HeroSection } from '@/components/landing/sport-1/hero-section';
import { PromoBanner } from '@/components/landing/sport-1/promo-banner';
import { DisciplinesSection } from '@/components/landing/sport-1/disciplines-section';
import { MediaGallerySection } from '@/components/landing/sport-1/media-gallery-section';
import { LocationsSection } from '@/components/landing/sport-1/locations-section';
import { TrialSection } from '@/components/landing/sport-1/trial-section';
import { RecommendationSection } from '@/components/landing/sport-1/recommendation-section';
import { Footer } from '@/components/landing/sport-1/footer';

export default function LandingSportPage() {
  const clientId = "demo-sport-1";
  const products = [
      { id: 'membresia-anual', name: 'Membresía Anual' },
      { id: 'clases-yoga', name: 'Pack 10 Clases de Yoga' },
      { id: 'entrenamiento-personal', name: 'Entrenamiento Personal' },
  ];

  return (
    <div className="bg-gray-900 text-white font-sans">
      <PromoBanner />
      <HeroSection />
      <main>
        <DisciplinesSection />
        <MediaGallerySection />
        <LocationsSection />
        <TrialSection />
        <RecommendationSection clientId={clientId} products={products} />
      </main>
      <Footer />
    </div>
  );
}
