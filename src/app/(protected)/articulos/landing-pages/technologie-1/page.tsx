'use client';

import { HeroSection } from '@/components/landing/technologie-1/hero-section';
import { FeaturesSection } from '@/components/landing/technologie-1/features-section';
import { ProductsSection } from '@/components/landing/technologie-1/products-section';
import { AiToolsSection } from '@/components/landing/technologie-1/ai-tools-section';
import { TestimonialsSection } from '@/components/landing/technologie-1/testimonials-section';
import { RecommendationSection } from '@/components/landing/technologie-1/recommendation-section';
import { ContactSection } from '@/components/landing/technologie-1/contact-section';
import { Footer } from '@/components/landing/technologie-1/footer';


export default function LandingTechnologiePage() {
  const clientId = "demo-tech-1";
  const products = [
      { id: 'saas-pro', name: 'SaaS Plan Pro' },
      { id: 'api-access', name: 'Acceso API' },
      { id: 'automation-suite', name: 'Suite de Automatización' },
  ];

  return (
    <div className="bg-gray-900 text-white font-sans">
      <HeroSection />
      <main>
        <FeaturesSection />
        <ProductsSection />
        <AiToolsSection />
        <TestimonialsSection />
        <RecommendationSection clientId={clientId} products={products} />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
