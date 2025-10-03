'use client';

import { HeroSection } from '@/components/landing/beratung-1/hero-section';
import { ServicesSection } from '@/components/landing/beratung-1/services-section';
import { AboutSection } from '@/components/landing/beratung-1/about-section';
import { GallerySection } from '@/components/landing/beratung-1/gallery-section';
import { TestimonialsSection } from '@/components/landing/beratung-1/testimonials-section';
import { BookingForm } from '@/components/landing/beratung-1/booking-form';
import { LocationSection } from '@/components/landing/beratung-1/location-section';
import { Footer } from '@/components/landing/beratung-1/footer';

export default function LandingBeratungPage() {
  return (
    <div className="bg-white text-gray-800 dark:bg-gray-950 dark:text-gray-200 font-sans">
      <HeroSection />
      <main>
        <ServicesSection />
        <AboutSection />
        <GallerySection />
        <TestimonialsSection />
        <BookingForm />
        <LocationSection />
      </main>
      <Footer />
    </div>
  );
}
