'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Ear, TestTube2, Wrench, Siren } from 'lucide-react';

const services = [
  {
    icon: <TestTube2 className="h-10 w-10 text-sky-600" />,
    title: "Pruebas Auditivas Gratuitas",
    description: "Evaluamos tu audición con la última tecnología para ofrecerte un diagnóstico preciso y sin compromiso.",
  },
  {
    icon: <Ear className="h-10 w-10 text-sky-600" />,
    title: "Adaptación de Audífonos",
    description: "Encontramos y ajustamos el audífono perfecto para tu estilo de vida, garantizando la máxima comodidad.",
  },
  {
    icon: <Wrench className="h-10 w-10 text-sky-600" />,
    title: "Mantenimiento y Reparación",
    description: "Ofrecemos servicio técnico para todas las marcas, asegurando el óptimo funcionamiento de tus dispositivos.",
  },
  {
    icon: <Siren className="h-10 w-10 text-sky-600" />,
    title: "Protección Auditiva",
    description: "Soluciones a medida para músicos, trabajadores y cualquier persona expuesta a ruidos fuertes.",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Cuidado Auditivo Integral</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Desde la prevención hasta la solución, estamos contigo en cada paso.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
