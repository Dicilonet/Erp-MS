
'use client';

import { Link as LinkIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ConnectionManager } from '@/components/marketing/connections/connection-manager';

export default function ConnectionsPage() {
  const { t } = useTranslation('marketing');
  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4 self-start">
          <LinkIcon className="h-8 w-8" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{t('marketingSuite.connections.title')}</h1>
            <p className="text-muted-foreground">{t('marketingSuite.connections.description')}</p>
          </div>
        </div>
      </div>
      <ConnectionManager />
    </>
  );
}
