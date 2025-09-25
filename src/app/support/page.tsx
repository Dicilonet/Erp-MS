
'use client';

import { SupportTicketList } from '@/components/support-ticket-list';
import { CreateTicketForm } from '@/components/create-ticket-form';
import { LifeBuoy, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export default function SupportPage() {
  const { t } = useTranslation('support');

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 sm:mt-0">
        <div className="flex items-center gap-4 self-start">
          <LifeBuoy className="h-8 w-8" />
          <h1 className="text-2xl sm:text-3xl font-bold">{t('page.title')}</h1>
        </div>
        <div className="w-full sm:w-auto">
            <CreateTicketForm>
              <Button className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                {t('page.createButton')}
              </Button>
            </CreateTicketForm>
        </div>
      </div>
      <SupportTicketList />
    </>
  );
}
