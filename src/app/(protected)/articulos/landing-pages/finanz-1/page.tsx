'use client';

import { HeroSection } from '@/components/landing/finanz-1/hero-section';
import { ServicesSection } from '@/components/landing/finanz-1/services-section';
import { AboutSection } from '@/components/landing/finanz-1/about-section';
import { PhilosophySection } from '@/components/landing/finanz-1/philosophy-section';
import { TestimonialsSection } from '@/components/landing/finanz-1/testimonials-section';
import { ContactSection } from '@/components/landing/finanz-1/contact-section';
import { RecommendationSection } from '@/components/landing/finanz-1/recommendation-section';
import { Footer } from '@/components/landing/finanz-1/footer';

export default function LandingFinanzPage() {
  const clientId = "demo-finanz-1"; // ID de cliente de ejemplo
  const products = [
      { id: 'prod1', name: 'Asesoría de Inversión' },
      { id: 'prod2', name: 'Planificación para la Jubilación' },
      { id: 'prod3', name: 'Gestión de Patrimonio' },
  ];

  return (
    <div className="bg-white text-gray-800 dark:bg-gray-950 dark:text-gray-200 font-sans">
      <HeroSection />
      <main>
        <ServicesSection />
        <AboutSection />
        <PhilosophySection />
        <TestimonialsSection />
        <ContactSection />
        <RecommendationSection clientId={clientId} products={products} />
      </main>
      <Footer />
    </div>
  );
}
