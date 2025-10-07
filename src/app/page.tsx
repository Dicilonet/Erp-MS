'use client';

import { useTranslation } from 'react-i18next';
import { HeroSection } from '@/components/landing/main/hero-section';
import { FeaturesSection } from '@/components/landing/main/features-section';
import { ModulesSection } from '@/components/landing/main/modules-section';
import { CtaSection } from '@/components/landing/main/cta-section';
import { Footer } from '@/components/landing/main/footer';

export default function LandingPage() {
  // Carga las traducciones para este componente y sus hijos
  useTranslation('landing');
  
  return (
    <div className="bg-background text-foreground">
      <main>
        <HeroSection />
        <FeaturesSection />
        <ModulesSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
