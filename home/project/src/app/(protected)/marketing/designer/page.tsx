
'use client';

import { SocialMediaDesigner } from '@/components/marketing/designer/social-media-designer';
import { useTranslation } from 'react-i18next';
import { Brush } from 'lucide-react';
import i18next from 'i18next';

export default function DesignerPage() {
  const { t, i18n } = useTranslation('marketing');

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4 self-start">
          <Brush className="h-8 w-8" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{t('designer.title')}</h1>
            <p className="text-muted-foreground">{t('designer.description')}</p>
          </div>
        </div>
      </div>
      <SocialMediaDesigner t={t} i18n={i18n} />
    </>
  );
}
