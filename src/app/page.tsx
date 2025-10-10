
'use client';

import { HeroSection } from '@/components/landing/main/hero-section';
import { FeaturesSection } from '@/components/landing/main/features-section';
import { ModulesSection } from '@/components/landing/main/modules-section';
import { StrategiesSection } from '@/components/landing/main/strategies-section';
import { CtaSection } from '@/components/landing/main/cta-section';
import { Footer } from '@/components/landing/main/footer';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FullScreenLoader } from '@/components/ui/fullscreen-loader';

export default function LandingPage() {
  const { t } = useTranslation('landing');
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/dashboard');
    }
  }, [isLoading, user, router]);

  if (isLoading || user) {
    return <FullScreenLoader />;
  }
  
  return (
    <div className="bg-background text-foreground">
      <main>
        <HeroSection />
        <FeaturesSection />
        <ModulesSection />
        <StrategiesSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
