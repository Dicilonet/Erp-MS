'use client';

import { CalendarDays } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CampaignCalendarView } from '@/components/marketing/automation/campaign-calendar-view';

export default function AutomationPage() {
  const { t } = useTranslation('marketing');
  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4 self-start">
          <CalendarDays className="h-8 w-8" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{t('marketingSuite.calendar.title')}</h1>
            <p className="text-muted-foreground">{t('marketingSuite.calendar.description')}</p>
          </div>
        </div>
      </div>
      <CampaignCalendarView />
    </>
  );
}
