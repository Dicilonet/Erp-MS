
'use client';

import { HeroSection } from '@/components/landing/lebensmittel-1/hero-section';
import { PhilosophySection } from '@/components/landing/lebensmittel-1/philosophy-section';
import { ProductsSection } from '@/components/landing/lebensmittel-1/products-section';
import { GallerySection } from '@/components/landing/lebensmittel-1/gallery-section';
import { OffersSection } from '@/components/landing/lebensmittel-1/offers-section';
import { TestimonialsSection } from '@/components/landing/lebensmittel-1/testimonials-section';
import { LocationSection } from '@/components/landing/lebensmittel-1/location-section';
import { Footer } from '@/components/landing/lebensmittel-1/footer';

export default function LandingLebensmittelPage() {
  return (
    <div className="bg-white text-gray-800 dark:bg-gray-950 dark:text-gray-200 font-sans">
      <HeroSection />
      <main>
        <PhilosophySection />
        <ProductsSection />
        <GallerySection />
        <OffersSection />
        <TestimonialsSection />
        <LocationSection />
      </main>
      <Footer />
    </div>
  );
}
