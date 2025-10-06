'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Eye, Glasses, Contact } from 'lucide-react';

const services = [
  {
    icon: <Eye className="h-10 w-10 text-cyan-600" />,
    title: "Examen Visual Completo",
    description: "Evaluamos tu agudeza visual y salud ocular con la tecnología más precisa del mercado.",
  },
  {
    icon: <Glasses className="h-10 w-10 text-cyan-600" />,
    title: "Asesoramiento de Estilo",
    description: "Nuestros expertos te ayudan a encontrar la montura que mejor se adapta a tu rostro y personalidad.",
  },
  {
    icon: <Contact className="h-10 w-10 text-cyan-600" />,
    title: "Adaptación de Lentes de Contacto",
    description: "Te enseñamos a usar y cuidar tus lentillas para un confort y una visión óptimos.",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Servicios Personalizados</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Más que una óptica, un centro de cuidado visual integral.
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
