'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'moment/locale/de';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import type { MarketingEvent } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ScheduleAssetModal } from '@/components/schedule-asset-modal';
import { useTranslation } from 'react-i18next';

const localizer = momentLocalizer(moment);

interface ProjectMarketingCalendarProps {
    projectId: string;
    customerId?: string | null;
}

export function ProjectMarketingCalendar({ projectId, customerId }: ProjectMarketingCalendarProps) {
  const { t, i18n } = useTranslation(['marketing', 'common']);
  const [events, setEvents] = useState<MarketingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState<{ isOpen: boolean; date?: Date }>({ isOpen: false });
  const { toast } = useToast();

  useEffect(() => {
    moment.locale(i18n.language);
  }, [i18n.language]);

  useEffect(() => {
    if (!projectId) {
      setEvents([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const q = query(collection(db, "marketingSchedule"), where("projectId", "==", projectId));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const eventsData = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                title: data.finalContent.text.substring(0, 30) + '...',
                start: data.scheduledDate.toDate(),
                end: moment(data.scheduledDate.toDate()).add(1, 'hours').toDate(),
            } as MarketingEvent;
        });
        setEvents(eventsData);
        setIsLoading(false);
    }, (error) => {
        console.error("Error al cargar eventos de marketing: ", error);
        toast({ variant: "destructive", title: t('toasts.loadError.title'), description: t('toasts.loadError.description') });
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [projectId, toast, t]);

  const handleSelectSlot = useCallback((slotInfo: { start: Date, end: Date }) => {
    if (!customerId) {
        toast({
            variant: "destructive",
            title: t('toasts.customerNeeded.title'),
            description: t('toasts.customerNeeded.descriptionProject'),
        });
        return;
    }
    setModalState({ isOpen: true, date: slotInfo.start });
    
  }, [customerId, toast, t]);

  const messages = {
    allDay: t('calendar.allDay', {ns: 'common'}),
    previous: t('calendar.previous', {ns: 'common'}),
    next: t('calendar.next', {ns: 'common'}),
    today: t('calendar.today', {ns: 'common'}),
    month: t('calendar.month', {ns: 'common'}),
    week: t('calendar.week', {ns: 'common'}),
    day: t('calendar.day', {ns: 'common'}),
    agenda: t('calendar.agenda', {ns: 'common'}),
    date: t('calendar.date', {ns: 'common'}),
    time: t('calendar.time', {ns: 'common'}),
    event: t('calendar.event', {ns: 'common'}),
    noEventsInRange: t('calendar.noEventsInRange', {ns: 'common'}),
    showMore: (total: number) => `+${total} ${t('calendar.more', {ns: 'common'})}`,
  };

  return (
    <>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>{t('projectCalendar.title')}</CardTitle>
                    <CardDescription>{t('projectCalendar.description')}</CardDescription>
                </div>
                <Button onClick={() => handleSelectSlot({ start: new Date(), end: new Date() })}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t('projectCalendar.scheduleButton')}
                </Button>
            </CardHeader>
            <CardContent className="p-4">
            <div style={{ height: '75vh' }}>
                {isLoading ? (
                    <Skeleton className="w-full h-full" />
                ) : (
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '100%' }}
                        selectable
                        onSelectSlot={handleSelectSlot}
                        defaultView={Views.MONTH}
                        messages={messages}
                    />
                )}
            </div>
            </CardContent>
        </Card>
      
        {modalState.isOpen && customerId && projectId && (
            <ScheduleAssetModal 
                isOpen={modalState.isOpen}
                onClose={() => setModalState({ isOpen: false })}
                customerId={customerId}
                projectId={projectId}
                selectedDate={modalState.date!}
            />
        )}
    </>
  );
}
