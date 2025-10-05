'use client';

import { HeroSection } from '@/components/landing/bildung-1/hero-section';
import { CoursesSection } from '@/components/landing/bildung-1/courses-section';
import { MethodologySection } from '@/components/landing/bildung-1/methodology-section';
import { GallerySection } from '@/components/landing/bildung-1/gallery-section';
import { TestimonialsSection } from '@/components/landing/bildung-1/testimonials-section';
import { InfoFormSection } from '@/components/landing/bildung-1/info-form-section';
import { RecommendationSection } from '@/components/landing/bildung-1/recommendation-section';
import { Footer } from '@/components/landing/bildung-1/footer';

export default function LandingBildungPage() {
  const clientId = "demo-bildung-1"; // ID de cliente de ejemplo
  const products = [ // Cursos o programas que se pueden recomendar
      { id: 'kurs1', name: 'Curso Intensivo de Verano' },
      { id: 'kurs2', name: 'Programa Anual de Música' },
      { id: 'kurs3', name: 'Clases Particulares de Idiomas' },
  ];

  return (
    <div className="bg-white text-gray-800 dark:bg-gray-950 dark:text-gray-200 font-sans">
      <HeroSection />
      <main>
        <CoursesSection />
        <MethodologySection />
        <GallerySection />
        <TestimonialsSection />
        <InfoFormSection />
        <RecommendationSection clientId={clientId} products={products} />
      </main>
      <Footer />
    </div>
  );
}
