'use client';

import { HeroSection } from '@/components/landing/haustiere-1/hero-section';
import { ServicesSection } from '@/components/landing/haustiere-1/services-section';
import { AboutSection } from '@/components/landing/haustiere-1/about-section';
import { GallerySection } from '@/components/landing/haustiere-1/gallery-section';
import { TestimonialsSection } from '@/components/landing/haustiere-1/testimonials-section';
import { ContactSection } from '@/components/landing/haustiere-1/contact-section';
import { LocationSection } from '@/components/landing/haustiere-1/location-section';
import { Footer } from '@/components/landing/haustiere-1/footer';

export default function LandingHaustierePage() {
  return (
    <div className="bg-white text-gray-800 dark:bg-gray-950 dark:text-gray-200 font-sans">
      <HeroSection />
      <main>
        <ServicesSection />
        <AboutSection />
        <GallerySection />
        <TestimonialsSection />
        <ContactSection />
        <LocationSection />
      </main>
      <Footer />
    </div>
  );
}
