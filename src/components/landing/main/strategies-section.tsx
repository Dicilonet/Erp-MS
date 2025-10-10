
'use client';

import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Handshake, Heart, Zap, Star, BrainCircuit } from 'lucide-react';

export function StrategiesSection() {
  const { t } = useTranslation('landing');
  const strategies = [
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: t('strategies.localMarketing.title'),
      description: t('strategies.localMarketing.description'),
    },
    {
      icon: <Handshake className="h-8 w-8 text-primary" />,
      title: t('strategies.alliances.title'),
      description: t('strategies.alliances.description'),
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: t('strategies.sponsorship.title'),
      description: t('strategies.sponsorship.description'),
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: t('strategies.connectedService.title'),
      description: t('strategies.connectedService.description'),
    },
    {
      icon: <Star className="h-8 w-8 text-primary" />,
      title: t('strategies.reputation.title'),
      description: t('strategies.reputation.description'),
    },
    {
      icon: <BrainCircuit className="h-8 w-8 text-primary" />,
      title: t('strategies.expertise.title'),
      description: t('strategies.expertise.description'),
    },
  ];

  return (
    <section id="strategies" className="py-16 lg:py-24 bg-gray-50/50 dark:bg-black/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t('strategies.title')}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            {t('strategies.subtitle')}
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {strategies.map((strategy) => (
            <Card key={strategy.title} className="hover:shadow-lg hover:-translate-y-1 transition-transform bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-4">
                  {strategy.icon}
                  <CardTitle className="text-lg">{strategy.title}</CardTitle>
                </div>
                 <p className="pt-2 text-sm text-muted-foreground">{strategy.description}</p>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
