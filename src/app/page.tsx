'use client';

import { HeroSection } from '@/components/landing/main/hero-section';
import { FeaturesSection } from '@/components/landing/main/features-section';
import { ModulesSection } from '@/components/landing/main/modules-section';
import { CtaSection } from '@/components/landing/main/cta-section';
import { Footer } from '@/components/landing/main/footer';

export default function LandingPage() {
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
