'use client';

// Este componente es una maqueta funcional de la interfaz.
// La lógica para llamar a `getScheduledPosts` y manejar los datos reales debe implementarse.

import { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'moment/locale/de';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { UnifiedPostComposer } from './unified-post-composer';

const localizer = momentLocalizer(moment);

const sampleEvents = [
  {
    id: 1,
    title: 'Lanzamiento campaña de verano',
    start: new Date(2024, 7, 15, 10, 0, 0),
    end: new Date(2024, 7, 15, 11, 0, 0),
    status: 'published',
  },
  {
    id: 2,
    title: 'Post sobre nuevo producto',
    start: new Date(2024, 7, 20, 15, 0, 0),
    end: new Date(2024, 7, 20, 16, 0, 0),
    status: 'scheduled',
  },
];

export function CampaignCalendarView() {
  const { t, i18n } = useTranslation(['marketing', 'common']);
  const [events, setEvents] = useState(sampleEvents);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const messages = {
    allDay: t('calendar.allDay', { ns: 'common' }),
    previous: t('calendar.previous', { ns: 'common' }),
    next: t('calendar.next', { ns: 'common' }),
    today: t('calendar.today', { ns: 'common' }),
    month: t('calendar.month', { ns: 'common' }),
    week: t('calendar.week', { ns: 'common' }),
    day: t('calendar.day', { ns: 'common' }),
    agenda: t('calendar.agenda', { ns: 'common' }),
    date: t('calendar.date', { ns: 'common' }),
    time: t('calendar.time', { ns: 'common' }),
    event: t('calendar.event', { ns: 'common' }),
    noEventsInRange: t('calendar.noEventsInRange', { ns: 'common' }),
    showMore: (total: number) => `+${total} ${t('calendar.more', { ns: 'common' })}`,
  };
  
  const handleSelectSlot = (slotInfo: { start: Date }) => {
    setSelectedDate(slotInfo.start);
    setIsComposerOpen(true);
  };

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-end mb-4">
            <Button onClick={() => handleSelectSlot({ start: new Date() })}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('marketingSuite.composer.createButton')}
            </Button>
          </div>
          <div style={{ height: '70vh' }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              messages={messages}
              culture={i18n.language}
              selectable
              onSelectSlot={handleSelectSlot}
            />
          </div>
        </CardContent>
      </Card>
      <UnifiedPostComposer
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        selectedDate={selectedDate}
      />
    </>
  );
}
