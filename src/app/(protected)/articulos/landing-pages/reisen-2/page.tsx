'use client';

import { HeroSection } from '@/components/landing/reisen-2/hero-section';
import { ToursSection } from '@/components/landing/reisen-2/tours-section';
import { GallerySection } from '@/components/landing/reisen-2/gallery-section';
import { TestimonialsSection } from '@/components/landing/reisen-2/testimonials-section';
import { BookingSection } from '@/components/landing/reisen-2/booking-section';
import { LocationSection } from '@/components/landing/reisen-2/location-section';
import { Footer } from '@/components/landing/reisen-2/footer';

export default function LandingCityToursPage() {
  return (
    <div className="bg-white text-gray-800 dark:bg-gray-950 dark:text-gray-200">
      <HeroSection />
      <main>
        <ToursSection />
        <GallerySection />
        <TestimonialsSection />
        <BookingSection />
        <LocationSection />
      </main>
      <Footer />
    </div>
  );
}
