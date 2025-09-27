'use client';

import { Rocket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CampaignDashboard } from '@/components/marketing/campaigns/campaign-dashboard';

export default function CampaignsPage() {
  const { t } = useTranslation('marketing');
  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4 self-start">
          <Rocket className="h-8 w-8" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{t('campaigns.title')}</h1>
            <p className="text-muted-foreground">{t('campaigns.description')}</p>
          </div>
        </div>
      </div>
      <CampaignDashboard />
    </>
  );
}
