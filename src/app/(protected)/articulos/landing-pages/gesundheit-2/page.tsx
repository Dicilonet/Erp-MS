'use client';

import { HeroSection } from '@/components/landing/gesundheit-2/hero-section';
import { ServicesSection } from '@/components/landing/gesundheit-2/services-section';
import { TipsVideoSection } from '@/components/landing/gesundheit-2/tips-video-section';
import { ProductsGallery } from '@/components/landing/gesundheit-2/products-gallery';
import { SpecialOffersSection } from '@/components/landing/gesundheit-2/special-offers-section';
import { AboutUsSection } from '@/components/landing/gesundheit-2/about-us-section';
import { BookingSection } from '@/components/landing/gesundheit-2/booking-section';
import { RecommendationSection } from '@/components/landing/gesundheit-2/recommendation-section';
import { LocationSection } from '@/components/landing/gesundheit-2/location-section';
import { Footer } from '@/components/landing/gesundheit-2/footer';

export default function LandingAkustikPage() {
  const clientId = "demo-akustik-1";
  const products = [
      { id: 'prod1', name: 'Revisión Auditiva Gratuita' },
      { id: 'prod2', name: 'Audífono Modelo X' },
      { id: 'prod3', name: 'Protección Auditiva a Medida' },
  ];
  
  // URL de ejemplo de Calendly. El cliente podría cambiar esto.
  const calendlyUrl = "https://calendly.com/your-username/30min";

  return (
    <div className="bg-white text-gray-800 dark:bg-gray-950 dark:text-gray-200 font-sans">
      <HeroSection />
      <main>
        <ServicesSection />
        <TipsVideoSection />
        <ProductsGallery />
        <SpecialOffersSection />
        <AboutUsSection />
        <BookingSection calendlyUrl={calendlyUrl} />
        <RecommendationSection clientId={clientId} products={products} />
        <LocationSection />
      </main>
      <Footer />
    </div>
  );
}
