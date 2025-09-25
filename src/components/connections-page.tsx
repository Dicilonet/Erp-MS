
'use client';

import { FolderSync } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ServiceCatalog } from '@/components/service-catalog';

export default function ConnectionsPage() {
    const { t } = useTranslation('connections');
    
    return (
        <>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 sm:mt-0 mb-6">
                <div className="flex items-center gap-4 self-start">
                    <FolderSync className="h-8 w-8" />
                    <h1 className="text-2xl sm:text-3xl font-bold">{t('title')}</h1>
                </div>
            </div>

            <ServiceCatalog />
        </>
    );
}
