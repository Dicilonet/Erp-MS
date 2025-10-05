'use client';

import { HeroSection } from '@/components/landing/musik-1/hero-section';
import { AboutSection } from '@/components/landing/musik-1/about-section';
import { MediaGallerySection } from '@/components/landing/musik-1/media-gallery-section';
import { EventsSection } from '@/components/landing/musik-1/events-section';
import { TestimonialsSection } from '@/components/landing/musik-1/testimonials-section';
import { RecommendationSection } from '@/components/landing/musik-1/recommendation-section';
import { Footer } from '@/components/landing/musik-1/footer';

export default function LandingMusikPage() {
  const clientId = "demo-musik-1"; // ID de cliente de ejemplo
  const products = [ // Eventos, álbumes o merchandising que se pueden recomendar
      { id: 'tour2025', name: 'Gira 2025' },
      { id: 'album', name: 'Nuevo Álbum "Eclipse"' },
      { id: 'merch', name: 'Merchandising Oficial' },
  ];

  return (
    <div className="bg-gray-900 text-white font-sans">
      <HeroSection />
      <main>
        <AboutSection />
        <MediaGallerySection />
        <EventsSection />
        <TestimonialsSection />
        <RecommendationSection clientId={clientId} products={products} />
      </main>
      <Footer />
    </div>
  );
}
