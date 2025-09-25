
'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';
import { PlusCircle, Search, MoreVertical, Zap, Mail, MessageCircle, Send, Facebook, Linkedin, X as XIcon, Link as LinkIcon, Briefcase, Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { DayContent, DayProps } from 'react-day-picker';
import { v4 as uuidv4 } from 'uuid';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// --- TIPOS DE DATOS PARA EVENTOS ---
interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  source: 'google' | 'calendly' | 'apple' | 'custom' | 'turismo'; // De dónde viene el evento
  color: string; // Color para identificar la fuente
  description?: string;
}

// --- DATOS DE EJEMPLO (ESTO VENDRÁ DE FIREBASE) ---
const sampleEvents: CalendarEvent[] = [
  { id: '1', title: 'FITUR 2026', date: new Date('2026-01-28'), source: 'turismo', color: 'bg-blue-500' },
  { id: '2', title: 'Reunión con Cliente A', date: new Date(), source: 'google', color: 'bg-red-500' },
  { id: '3', title: 'ITB Berlin 2026', date: new Date('2026-03-03'), source: 'turismo', color: 'bg-blue-500' },
  { id: '4', title: 'Llamada de Ventas (Calendly)', date: new Date(), source: 'calendly', color: 'bg-green-500' },
  { id: '5', title: 'ANATO 2026', date: new Date('2026-02-25'), source: 'turismo', color: 'bg-blue-500' },
];

// --- SVG Icons para redes que no están en Lucide ---
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M16.1 7.4a4.5 4.5 0 0 0-5.7-5.7l-.4.3c-2.4 1.5-4.3 4-4.7 6.8"/>
        <path d="M12 10.5v8.5a4 4 0 1 0 4-4H12"/>
    </svg>
);


export function CalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  
  const [newEvent, setNewEvent] = useState({ 
    title: '', 
    description: '', 
    startTime: '10:00', 
    endTime: '11:00',
    date: new Date()
  });


  const eventsForSelectedDay = useMemo(() => {
    if (!date) return [];
    return events.filter(
      (event) => event.date.toDateString() === date.toDateString()
    );
  }, [date, events]);

  const filteredEvents = useMemo(() => {
    if (!searchTerm) return [];
    return events.filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, events]);

  const handleOpenAddEventModal = () => {
    setNewEvent({ 
        title: '', 
        description: '', 
        startTime: '10:00', 
        endTime: '11:00',
        date: date || new Date()
    });
    setIsAddEventModalOpen(true);
  };

  const handleSaveEvent = () => {
    if (!newEvent.title || !newEvent.date) return;

    const [startHour, startMinute] = newEvent.startTime.split(':').map(Number);
    const eventDate = new Date(newEvent.date);
    eventDate.setHours(startHour, startMinute);
    
    const newCalEvent: CalendarEvent = {
        id: uuidv4(),
        title: newEvent.title,
        date: eventDate,
        description: newEvent.description,
        source: 'custom',
        color: 'bg-purple-500'
    };

    setEvents(prev => [...prev, newCalEvent]);
    setIsAddEventModalOpen(false);
  };

  const handleSyncCalendars = () => {
    alert('TODO: Implementar la autenticación OAuth con Google, etc. Esta función llamaría a una Firebase Function para sincronizar los calendarios.');
  };
  
  const getShareUrls = (event: CalendarEvent) => {
    const text = encodeURIComponent(`Evento: ${event.title}\nFecha: ${event.date.toLocaleDateString()}`);
    const url = encodeURIComponent(window.location.href);
    return {
        whatsapp: `https://wa.me/?text=${text}`,
        telegram: `https://t.me/share/url?url=${url}&text=${text}`,
        email: `mailto:?subject=${encodeURIComponent(`Invitación: ${event.title}`)}&body=${text}`,
        twitter: `https://twitter.com/intent/tweet?text=${text}%0A${url}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        xing: `https://www.xing.com/spi/shares/new?url=${url}`,
    };
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <CardTitle className="text-lg font-medium">Super Calendario</CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" onClick={handleSyncCalendars} className="flex-1">
                    <Zap className="h-4 w-4 mr-2" />
                    Sincronizar
                </Button>
                <Button variant="default" size="sm" onClick={handleOpenAddEventModal} className="flex-1">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Añadir Evento
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex flex-col lg:flex-row gap-4">
        
        <div className="flex justify-center lg:flex-shrink-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            components={{
              Day: (props: DayProps) => {
                const dayEvents = events.filter(e => e.date.toDateString() === props.date.toDateString());
                return (
                  <div className="relative">
                    <DayContent {...props} />
                    {dayEvents.length > 0 && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex space-x-1">
                         {dayEvents.slice(0, 3).map(e => <div key={e.id} className={`h-1.5 w-1.5 rounded-full ${e.color}`} />)}
                      </div>
                    )}
                  </div>
                );
              },
            }}
          />
        </div>
        
        <div className="flex-grow min-w-0">
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Buscar evento (FITUR, ITB...)" 
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-md font-semibold">
              {searchTerm ? `Resultados para "${searchTerm}"` : `Eventos para ${date ? date.toLocaleDateString() : 'hoy'}`}
            </h3>
            <div className="h-[250px] overflow-y-auto pr-2 space-y-2">
              {(searchTerm ? filteredEvents : eventsForSelectedDay).length > 0 ? (
                (searchTerm ? filteredEvents : eventsForSelectedDay).map(event => {
                    const shareUrls = getShareUrls(event);
                    return(
                  <div key={event.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center min-w-0">
                      <span className={`h-3 w-3 rounded-full mr-3 flex-shrink-0 ${event.color}`}></span>
                      <div className="truncate">
                        <p className="font-semibold truncate">{event.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{event.source} - {event.date.toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 p-0 flex-shrink-0">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48">
                            <DropdownMenuItem onSelect={() => window.open(shareUrls.whatsapp, '_blank')}><MessageCircle className="mr-2 h-4 w-4" /><span>WhatsApp</span></DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => window.open(shareUrls.telegram, '_blank')}><Send className="mr-2 h-4 w-4" /><span>Telegram</span></DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => window.open(shareUrls.email, '_blank')}><Mail className="mr-2 h-4 w-4" /><span>Email</span></DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem onSelect={() => window.open(shareUrls.facebook, '_blank')}><Facebook className="mr-2 h-4 w-4" /><span>Facebook</span></DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => window.open(shareUrls.linkedin, '_blank')}><Linkedin className="mr-2 h-4 w-4" /><span>LinkedIn</span></DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => window.open(shareUrls.twitter, '_blank')}><XIcon className="mr-2 h-4 w-4" /><span>X (Twitter)</span></DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => window.open(shareUrls.xing, '_blank')}><Briefcase className="mr-2 h-4 w-4" /><span>XING</span></DropdownMenuItem>
                            <DropdownMenuItem disabled><TikTokIcon className="mr-2 h-4 w-4" /><span>TikTok (Próximamente)</span></DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </div>
                    );
                })
              ) : (
                <p className="text-sm text-muted-foreground py-10 text-center">No hay eventos.</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
       <Dialog open={isAddEventModalOpen} onOpenChange={setIsAddEventModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Añadir Nuevo Evento</DialogTitle>
                <DialogDescription>Completa los detalles para añadir un nuevo evento al calendario.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="event-title">Título del Evento</Label>
                    <Input id="event-title" placeholder="Ej: Reunión de seguimiento" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>Fecha del Evento</Label>
                         <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !newEvent.date && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {newEvent.date ? format(newEvent.date, "PPP") : <span>Selecciona fecha</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                selected={newEvent.date}
                                onSelect={(d) => setNewEvent(prev => ({...prev, date: d || prev.date}))}
                                initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="event-start-time">Hora de Inicio</Label>
                        <Input id="event-start-time" type="time" value={newEvent.startTime} onChange={e => setNewEvent({...newEvent, startTime: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="event-end-time">Hora de Fin</Label>
                        <Input id="event-end-time" type="time" value={newEvent.endTime} onChange={e => setNewEvent({...newEvent, endTime: e.target.value})} />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="event-description">Descripción (Opcional)</Label>
                    <Textarea id="event-description" placeholder="Añade más detalles..." value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} />
                </div>
            </div>
            <DialogFooter>
                <Button variant="ghost" onClick={() => setIsAddEventModalOpen(false)}>Cancelar</Button>
                <Button onClick={handleSaveEvent}>Guardar Evento</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
