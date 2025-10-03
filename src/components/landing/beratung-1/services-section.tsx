'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Heart, Landmark, Users, Briefcase, Scale } from 'lucide-react';

const services = [
  {
    icon: <Heart className="h-10 w-10 text-indigo-600" />,
    title: "Coaching Personal",
    description: "Desarrolla tu autoconfianza, gestiona el estrés y alcanza tus metas personales.",
  },
  {
    icon: <Briefcase className="h-10 w-10 text-indigo-600" />,
    title: "Asesoría Profesional",
    description: "Impulsa tu carrera, mejora tu liderazgo y navega transiciones laborales con éxito.",
  },
  {
    icon: <Users className="h-10 w-10 text-indigo-600" />,
    title: "Terapia Familiar",
    description: "Mejora la comunicación y resuelve conflictos en un entorno seguro y constructivo.",
  },
  {
    icon: <Landmark className="h-10 w-10 text-indigo-600" />,
    title: "Consultoría Financiera",
    description: "Organiza tus finanzas, planifica tu futuro y toma decisiones de inversión informadas.",
  },
   {
    icon: <Scale className="h-10 w-10 text-indigo-600" />,
    title: "Orientación Legal",
    description: "Recibe una guía inicial para entender tus opciones en asuntos legales complejos.",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Áreas de Especialización</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Un enfoque para cada aspecto de tu vida.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
