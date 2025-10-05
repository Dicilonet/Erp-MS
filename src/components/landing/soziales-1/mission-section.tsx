'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { BookOpen, Globe, Users } from 'lucide-react';

const priorities = [
  {
    icon: <BookOpen className="h-10 w-10 text-green-600" />,
    title: "Educación de Calidad",
    description: "Creemos en el poder de la educación para transformar vidas y comunidades.",
  },
  {
    icon: <Globe className="h-10 w-10 text-green-600" />,
    title: "Sostenibilidad Ambiental",
    description: "Impulsamos proyectos de reforestación y conservación para un planeta más sano.",
  },
  {
    icon: <Users className="h-10 w-10 text-green-600" />,
    title: "Desarrollo Comunitario",
    description: "Fomentamos la autonomía y el bienestar de las comunidades más vulnerables.",
  },
];

export function MissionSection() {
  return (
    <section id="mission" className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-green-600">ONG Sin Fines de Lucro</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Nuestra Misión</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Trabajamos para construir un mundo más justo y sostenible, donde todas las personas tengan la oportunidad de desarrollar su máximo potencial.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {priorities.map((item) => (
            <Card key={item.title} className="p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
