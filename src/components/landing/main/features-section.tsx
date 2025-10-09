
'use client';

import { useTranslation } from 'react-i18next';
import { Zap, ShieldCheck, BrainCircuit, Users } from 'lucide-react';
import Image from 'next/image';

export function FeaturesSection() {
  const { t } = useTranslation('landing');
  const features = [
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: t('features.automation.title'),
      description: t('features.automation.description'),
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: t('features.crm.title'),
      description: t('features.crm.description'),
    },
    {
      icon: <BrainCircuit className="h-10 w-10 text-primary" />,
      title: t('features.intelligence.title'),
      description: t('features.intelligence.description'),
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-primary" />,
      title: t('features.security.title'),
      description: t('features.security.description'),
    },
  ];

  return (
    <section id="features" className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
            <Image 
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2073&auto=format&fit=crop"
                alt="Fondo de características"
                fill
                className="object-cover opacity-5 dark:opacity-10"
                data-ai-hint="team meeting"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background"></div>
        </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t('features.title')}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            {t('features.subtitle')}
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="text-center p-6 rounded-lg hover:bg-card/50 transition-colors">
              <div className="flex justify-center items-center h-20">
                {feature.icon}
              </div>
              <h3 className="mt-6 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-base text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
