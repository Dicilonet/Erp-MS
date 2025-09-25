
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { EmailComposer } from '@/components/email-composer';
import { Skeleton } from '@/components/ui/skeleton';

export default function EmailPage() {
  const { t } = useTranslation('communications');
  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 sm:mt-0 mb-6">
        <div className="flex items-center gap-4">
          <Mail className="h-8 w-8" />
          <h1 className="text-2xl sm:text-3xl font-bold">{t('title')}</h1>
        </div>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>{t('composer.title')}</CardTitle>
            <CardDescription>
                {t('composer.description')}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <EmailComposer />
        </CardContent>
      </Card>
    </>
  );
}
