'use client';

import { HeroSection } from '@/components/landing/umwelt-1/hero-section';
import { MissionSection } from '@/components/landing/umwelt-1/mission-section';
import { ProjectsSection } from '@/components/landing/umwelt-1/projects-section';
import { MediaGallerySection } from '@/components/landing/umwelt-1/media-gallery-section';
import { HowToHelpSection } from '@/components/landing/umwelt-1/how-to-help-section';
import { ContactForm } from '@/components/landing/umwelt-1/contact-form';
import { RecommendationSection } from '@/components/landing/umwelt-1/recommendation-section';
import { Footer } from '@/components/landing/umwelt-1/footer';

export default function LandingUmweltPage() {
  const clientId = "demo-umwelt-1";
  const products = [
    { id: 'reforestacion', name: 'Proyecto de Reforestación' },
    { id: 'oceanos', name: 'Limpieza de Océanos' },
    { id: 'educacion', name: 'Programa de Educación Ambiental' },
  ];

  return (
    <div className="bg-white text-gray-800 dark:bg-gray-950 dark:text-gray-200 font-sans">
      <HeroSection />
      <main>
        <MissionSection />
        <ProjectsSection />
        <MediaGallerySection />
        <HowToHelpSection />
        <RecommendationSection clientId={clientId} products={products} />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
