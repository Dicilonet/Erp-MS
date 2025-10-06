'use client';

import type { Customer, Campaign } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { Ticket, Map, Brush, Send, ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// Datos de ejemplo para la campaña. Esto debería venir de Firestore.
const sampleCampaign: Campaign = {
  source: 'Dicilo',
  tasks: {
    done: ['Análisis inicial de la competencia', 'Configuración de la cuenta en redes'],
    todo: ['Crear primer borrador de contenido', 'Definir KPIs de la campaña'],
    nextSteps: ['Llamada de seguimiento el Viernes', 'Enviar propuesta de diseño de logo'],
  },
};

interface CampaignDetailViewProps {
  customer: Customer;
  onBack?: () => void;
}

export function CampaignDetailView({ customer, onBack }: CampaignDetailViewProps) {
  const { t } = useTranslation('marketing');

  const renderTaskList = (title: string, tasks: string[]) => (
    <div className="space-y-3">
      <h4 className="font-semibold">{title}</h4>
      <div className="pl-4 border-l-2 space-y-3">
        {tasks.map((task, index) => (
          <div key={index} className="flex items-center">
            <Checkbox id={`${title}-${index}`} checked={title === t('campaigns.tasks.done')} disabled />
            <Label htmlFor={`${title}-${index}`} className="ml-3 text-sm">
              {task}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            {onBack && <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack}><ArrowLeft/></Button>}
            <div>
              <CardTitle>{t('campaigns.details.title', { customerName: customer.name })}</CardTitle>
              <div className="flex items-center gap-2 pt-1">
                <CardDescription>{t('campaigns.details.source')}:</CardDescription>
                <Badge variant={sampleCampaign.source === 'Dicilo' ? 'default' : 'secondary'}>
                    {sampleCampaign.source}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderTaskList(t('campaigns.tasks.done'), sampleCampaign.tasks.done)}
          <Separator />
          {renderTaskList(t('campaigns.tasks.todo'), sampleCampaign.tasks.todo)}
           <Separator />
          {renderTaskList(t('campaigns.tasks.nextSteps'), sampleCampaign.tasks.nextSteps)}
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
            <CardTitle>{t('campaigns.tools.title')}</CardTitle>
            <CardDescription>{t('campaigns.tools.description', { customerName: customer.name })}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <Button variant="outline" className="flex-col h-24">
                <Ticket className="h-6 w-6 mb-2"/>
                <span>{t('nav.coupons')}</span>
             </Button>
             <Button variant="outline" className="flex-col h-24">
                <Map className="h-6 w-6 mb-2"/>
                <span>{t('nav.geomarketing')}</span>
             </Button>
             <Button variant="outline" className="flex-col h-24">
                <Brush className="h-6 w-6 mb-2"/>
                <span>{t('nav.designer')}</span>
             </Button>
             <Button variant="outline" className="flex-col h-24">
                <Send className="h-6 w-6 mb-2"/>
                <span>{t('nav.automation')}</span>
             </Button>
        </CardContent>
      </Card>
    </div>
  );
}
