'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Ticket } from 'lucide-react';

const events = [
  {
    title: "Gran Estreno Mundial",
    venue: "Teatro Principal",
    date: "15 Dic 2024",
    time: "20:00",
    status: "Entradas a la venta",
    ticketLink: "#",
  },
  {
    title: "Show Exclusivo para Fans",
    venue: "Sala Privada",
    date: "20 Dic 2024",
    time: "21:00",
    status: "Entradas por sorteo",
    ticketLink: "#",
  },
  {
    title: "Gira Nacional: Barcelona",
    venue: "Palau Sant Jordi",
    date: "10 Ene 2025",
    time: "21:30",
    status: "Próximamente",
    ticketLink: "#",
  },
];

export function EventsSection() {
  return (
    <section id="events" className="py-16 lg:py-24 bg-gray-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-white">Agenda de Eventos</h2>
          <p className="mt-2 text-lg text-gray-400">No te pierdas nuestras próximas fechas. ¡Asegura tu entrada!</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event) => (
            <Card key={event.title} className="bg-gray-900 border-gray-700 text-white flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl text-red-400">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow space-y-3 text-sm">
                  <p className="flex items-center gap-2 text-gray-300"><Calendar className="h-4 w-4" /> {event.date} - {event.time}</p>
                  <p className="flex items-center gap-2 text-gray-300"><MapPin className="h-4 w-4" /> {event.venue}</p>
                  <p className={`font-bold ${event.status !== 'Agotado' ? 'text-green-400' : 'text-red-500'}`}>
                    {event.status}
                  </p>
                </CardContent>
                <CardFooter>
                    <Button 
                        asChild 
                        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600" 
                        disabled={event.status === 'Agotado' || event.status === 'Próximamente'}
                    >
                        <a href={event.ticketLink}>
                           <Ticket className="mr-2 h-4 w-4"/> 
                           {event.status === 'Agotado' ? 'Agotadas' : 'Comprar Entradas'}
                        </a>
                    </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
