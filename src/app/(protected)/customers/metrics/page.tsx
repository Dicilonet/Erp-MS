'use client';

import { CustomerMetricsDashboard } from '@/components/customers/customer-metrics-dashboard';
import { useTranslation } from 'react-i18next';

export default function MetricsPage() {
  const { t } = useTranslation('customers');

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">{t('metrics.title')}</h2>
      <p className="text-muted-foreground mb-6">{t('metrics.description')}</p>
      <CustomerMetricsDashboard />
    </div>
  );
}
