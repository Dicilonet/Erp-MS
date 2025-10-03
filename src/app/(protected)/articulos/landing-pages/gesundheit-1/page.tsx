'use client';

import { HeroSection } from '@/components/landing/gesundheit-1/hero-section';
import { ServicesGrid } from '@/components/landing/gesundheit-1/services-grid';
import { TeamSection } from '@/components/landing/gesundheit-1/team-section';
import { Testimonials } from '@/components/landing/gesundheit-1/testimonials';
import { ContactForm } from '@/components/landing/gesundheit-1/contact-form';
import { LocationMap } from '@/components/landing/gesundheit-1/location-map';
import { Footer } from '@/components/landing/gesundheit-1/footer';
import { ProductsSection } from '@/components/landing/gesundheit-1/products-section';

export default function LandingGesundheitPage() {
  return (
    <div className="bg-white text-gray-800 dark:bg-gray-950 dark:text-gray-200">
      <HeroSection />
      <main>
        <ServicesGrid />
        <TeamSection />
        <ProductsSection />
        <Testimonials />
        <ContactForm />
        <LocationMap />
      </main>
      <Footer />
    </div>
  );
}
