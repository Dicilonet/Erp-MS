'use client';

import { HeroSection } from '@/components/landing/wellness-1/hero-section';
import { ServicesGrid } from '@/components/landing/wellness-1/services-grid';
import { PhilosophySection } from '@/components/landing/wellness-1/philosophy-section';
import { GallerySection } from '@/components/landing/wellness-1/gallery-section';
import { Testimonials } from '@/components/landing/wellness-1/testimonials';
import { ContactForm } from '@/components/landing/wellness-1/contact-form';
import { LocationMap } from '@/components/landing/wellness-1/location-map';
import { Footer } from '@/components/landing/wellness-1/footer';
import { ProductsSection } from '@/components/landing/wellness-1/products-section';

export default function LandingWellnessPage() {
  return (
    <div className="bg-white text-gray-800 dark:bg-gray-950 dark:text-gray-200 font-sans">
      <HeroSection />
      <main>
        <ServicesGrid />
        <PhilosophySection />
        <GallerySection />
        <ProductsSection />
        <Testimonials />
        <ContactForm />
        <LocationMap />
      </main>
      <Footer />
    </div>
  );
}
