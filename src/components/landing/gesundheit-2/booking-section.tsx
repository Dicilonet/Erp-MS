'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface BookingSectionProps {
  calendlyUrl: string;
}

export function BookingSection({ calendlyUrl }: BookingSectionProps) {
  return (
    <section id="booking" className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-sky-700 dark:text-sky-400">Reserva tu Cita Online</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Selecciona el día y la hora que mejor te convenga en nuestro calendario. Es rápido, fácil y seguro.
          </p>
        </div>
        <Card className="overflow-hidden shadow-2xl">
          <CardContent className="p-0">
             <AspectRatio ratio={4 / 3}>
                <iframe
                    src={calendlyUrl}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    title="Calendly-Einbettungs-iframe"
                    className="w-full h-full"
                ></iframe>
             </AspectRatio>
          </CardContent>
        </Card>
         <p className="text-center text-xs text-muted-foreground mt-4">
          O, si lo prefieres, llámanos al <a href="tel:+34912345678" className="underline hover:text-primary">+34 912 345 678</a>.
        </p>
      </div>
    </section>
  );
}
