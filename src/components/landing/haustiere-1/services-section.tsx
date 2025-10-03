'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Scissors, Home, Bone } from 'lucide-react';

const services = [
  {
    icon: <Scissors className="h-10 w-10 text-amber-600" />,
    title: "Peluquería Profesional",
    description: "Cortes de raza, baños terapéuticos y tratamientos de spa para un pelaje sano y brillante.",
  },
  {
    icon: <Home className="h-10 w-10 text-amber-600" />,
    title: "Guardería de Día",
    description: "Un espacio seguro y divertido para que tu mascota socialice y juegue bajo supervisión experta.",
  },
  {
    icon: <Bone className="h-10 w-10 text-amber-600" />,
    title: "Adiestramiento Positivo",
    description: "Clases de obediencia y modificación de conducta para una convivencia feliz.",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Nuestros Servicios</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Todo lo que tu mascota necesita para estar sana, guapa y feliz.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {services.map((service) => (
            <Card key={service.title} className="p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="flex justify-center mb-4">{service.icon}</div>
              <h3 className="text-lg font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
