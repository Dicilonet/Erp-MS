'use client';

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CtaSection() {
  const { t } = useTranslation('landing');
  return (
    <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {t('cta.title')}
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          {t('cta.subtitle')}
        </p>
        <div className="mt-8">
          <Button size="lg" asChild>
            <Link href="/signup">
              {t('cta.button')} <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}