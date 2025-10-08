'use client';

import { HeroSection } from '@/components/landing/main/hero-section';
import { FeaturesSection } from '@/components/landing/main/features-section';
import { ModulesSection } from '@/components/landing/main/modules-section';
import { CtaSection } from '@/components/landing/main/cta-section';
import { Footer } from '@/components/landing/main/footer';
import { useTranslation } from 'react-i18next';

export default function LandingPage() {
  // Se añade el hook useTranslation para asegurar que la página se re-renderice al cambiar el idioma.
  const { t } = useTranslation('landing');

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
