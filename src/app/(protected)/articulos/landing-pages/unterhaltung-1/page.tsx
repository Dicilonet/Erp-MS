'use client';

import { HeroSection } from '@/components/landing/unterhaltung-1/hero-section';
import { AboutSection } from '@/components/landing/unterhaltung-1/about-section';
import { MediaGallerySection } from '@/components/landing/unterhaltung-1/media-gallery-section';
import { EventsSection } from '@/components/landing/unterhaltung-1/events-section';
import { RecommendationSection } from '@/components/landing/unterhaltung-1/recommendation-section';
import { ContactSection } from '@/components/landing/unterhaltung-1/contact-section';
import { Footer } from '@/components/landing/unterhaltung-1/footer';

export default function LandingUnterhaltungPage() {
  const clientId = "demo-unterhaltung-1";
  const products = [
      { id: 'show-vip', name: 'Entradas VIP' },
      { id: 'merch', name: 'Merchandising Oficial' },
      { id: 'meet-greet', name: 'Meet & Greet' },
  ];

  return (
    <div className="bg-gray-900 text-white font-sans">
      <HeroSection />
      <main>
        <AboutSection />
        <MediaGallerySection />
        <EventsSection />
        <RecommendationSection clientId={clientId} products={products} />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
