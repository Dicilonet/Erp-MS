'use client';

import { HeroSection } from '@/components/landing/optik-1/hero-section';
import { ServicesSection } from '@/components/landing/optik-1/services-section';
import { OffersSection } from '@/components/landing/optik-1/offers-section';
import { BrandsGallery } from '@/components/landing/optik-1/brands-gallery';
import { MediaGallerySection } from '@/components/landing/optik-1/media-gallery-section';
import { AboutUsSection } from '@/components/landing/optik-1/about-us-section';
import { BookingSection } from '@/components/landing/optik-1/booking-section';
import { RecommendationSection } from '@/components/landing/optik-1/recommendation-section';
import { LocationSection } from '@/components/landing/optik-1/location-section';
import { Footer } from '@/components/landing/optik-1/footer';

export default function LandingOptikPage() {
  const clientId = "demo-optik-1";
  const products = [
      { id: 'prod1', name: 'Gafas Graduadas' },
      { id: 'prod2', name: 'Gafas de Sol' },
      { id: 'prod3', name: 'Lentes de Contacto' },
  ];

  return (
    <div className="bg-white text-gray-800 dark:bg-gray-950 dark:text-gray-200 font-sans">
      <HeroSection />
      <main>
        <ServicesSection />
        <OffersSection />
        <BrandsGallery />
        <MediaGallerySection />
        <AboutUsSection />
        <BookingSection />
        <RecommendationSection clientId={clientId} products={products} />
        <LocationSection />
      </main>
      <Footer />
    </div>
  );
}
