'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Ticket, Tag } from 'lucide-react';
import { LocationSection } from './location-section';

const events = [
  {
    city: "Madrid",
    venue: "Sala La Riviera",
    date: "25 Oct 2024",
    time: "21:00",
    status: "Entradas a la venta",
    ticketLink: "#",
    mapCoords: { lat: 40.408, lon: -3.715 }
  },
  {
    city: "Barcelona",
    venue: "Razzmatazz",
    date: "26 Oct 2024",
    time: "21:30",
    status: "Entradas a la venta",
    ticketLink: "#",
    mapCoords: { lat: 41.397, lon: 2.193 }
  },
  {
    city: "Berlín",
    venue: "Columbiahalle",
    date: "02 Nov 2024",
    time: "20:00",
    status: "Agotado",
    ticketLink: "#",
    mapCoords: { lat: 52.486, lon: 13.389 }
  },
];

export function EventsSection() {
  const [selectedEvent, setSelectedEvent] = React.useState(events[0]);

  return (
    <section id="events" className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Próximos Conciertos</h2>
          <p className="mt-2 text-lg text-gray-400">No te pierdas nuestra próxima gira. ¡Te esperamos!</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            {events.map((event) => (
              <Card 
                key={event.city}
                className={`cursor-pointer transition-all ${selectedEvent.city === event.city ? 'bg-purple-800/50 border-purple-500' : 'bg-gray-800 hover:bg-gray-700'}`}
                onClick={() => setSelectedEvent(event)}
              >
                <CardHeader className="flex flex-row justify-between items-start pb-2">
                  <CardTitle className="text-xl">{event.city}</CardTitle>
                  <span className={`text-xs font-bold ${event.status !== 'Agotado' ? 'text-green-400' : 'text-red-400'}`}>
                    {event.status}
                  </span>
                </CardHeader>
                <CardContent className="text-sm text-gray-300">
                  <p className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {event.date} - {event.time}</p>
                  <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {event.venue}</p>
                </CardContent>
              </Card>
            ))}
             <Card className="bg-gray-800 border-dashed border-gray-600">
                <CardContent className="pt-6 text-center">
                    <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
                        <Tag className="h-4 w-4 text-purple-400" />
                        ¿Tienes un cupón de descuento?
                    </p>
                    <Button variant="link" className="text-purple-400 p-0 h-auto mt-1">Aplícalo en el proceso de compra</Button>
                </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2 rounded-lg overflow-hidden shadow-2xl">
             <LocationSection coords={selectedEvent.mapCoords} venueName={selectedEvent.venue} />
          </div>
        </div>
      </div>
    </section>
  );
}
