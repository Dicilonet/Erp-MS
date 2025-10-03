'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bus, Ship, Footprints, Clock } from 'lucide-react';

const tours = [
  {
    icon: <Bus className="h-10 w-10 text-sky-600" />,
    title: "Tour Panorámico en Bus",
    description: "Recorre los principales monumentos y barrios en nuestro cómodo bus de dos plantas.",
  },
  {
    icon: <Ship className="h-10 w-10 text-sky-600" />,
    title: "Paseo por el Puerto",
    description: "Disfruta de las vistas de la ciudad desde el agua en nuestro tour en barcaza.",
  },
  {
    icon: <Footprints className="h-10 w-10 text-sky-600" />,
    title: "Ruta Histórica a Pie",
    description: "Explora los secretos del casco antiguo con nuestros guías locales expertos.",
  },
  {
    icon: <Clock className="h-10 w-10 text-sky-600" />,
    title: "Tour Nocturno",
    description: "Descubre la magia de la ciudad iluminada y su vibrante vida nocturna.",
  },
];

export function ToursSection() {
  return (
    <section id="tours" className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Nuestras Experiencias</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Tenemos un recorrido para cada tipo de viajero. ¿Cuál es el tuyo?
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {tours.map((tour) => (
            <Card key={tour.title} className="text-center p-6 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="flex justify-center mb-4">{tour.icon}</div>
              <h3 className="text-lg font-semibold">{tour.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{tour.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
