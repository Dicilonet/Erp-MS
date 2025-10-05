'use client';

import { HeroSection } from '@/components/landing/soziales-1/hero-section';
import { MissionSection } from '@/components/landing/soziales-1/mission-section';
import { MediaGallerySection } from '@/components/landing/soziales-1/media-gallery-section';
import { HowToHelpSection } from '@/components/landing/soziales-1/how-to-help-section';
import { ContactSection } from '@/components/landing/soziales-1/contact-section';
import { RecommendationSection } from '@/components/landing/soziales-1/recommendation-section';
import { Footer } from '@/components/landing/soziales-1/footer';

export default function LandingSozialesPage() {
  const clientId = "demo-soziales-1"; // ID de cliente de ejemplo
  const products = [
      { id: 'projekt-wasser', name: 'Proyecto Agua Potable' },
      { id: 'bildung-kinder', name: 'Educación Infantil' },
      { id: 'aufforstung', name: 'Campaña de Reforestación' },
  ];

  return (
    <div className="bg-white text-gray-800 dark:bg-gray-950 dark:text-gray-200 font-sans">
      <HeroSection />
      <main>
        <MissionSection />
        <MediaGallerySection />
        <HowToHelpSection />
        <ContactSection />
        <RecommendationSection clientId={clientId} products={products} />
      </main>
      <Footer />
    </div>
  );
}
