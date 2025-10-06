'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { DollarSign, HandHeart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const waysToHelp = [
  {
    icon: <DollarSign className="h-10 w-10 text-emerald-600" />,
    title: "Haz una Donación",
    description: "Cada aportación nos ayuda a financiar la reforestación, la limpieza de océanos y la educación ambiental.",
    buttonText: "Donar Ahora",
    href: "#"
  },
  {
    icon: <HandHeart className="h-10 w-10 text-emerald-600" />,
    title: "Hazte Voluntario",
    description: "Tu tiempo es valioso. Únete a nuestras jornadas de limpieza, plantación de árboles o eventos de concienciación.",
    buttonText: "Ver Oportunidades",
    href: "#contact"
  },
  {
    icon: <Users className="h-10 w-10 text-emerald-600" />,
    title: "Corre la Voz",
    description: "Conviértete en embajador de nuestra causa. Comparte nuestros proyectos y ayuda a que nuestra comunidad crezca.",
    buttonText: "Recomendar",
    href: "#recommend"
  },
];

export function HowToHelpSection() {
  return (
    <section id="help" className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Tu Implicación es Clave</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Existen muchas maneras de ser parte de la solución.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {waysToHelp.map((way) => (
            <Card key={way.title} className="p-6 text-center flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="flex justify-center mb-4">{way.icon}</div>
              <h3 className="text-lg font-semibold">{way.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground flex-grow">{way.description}</p>
              <div className="mt-6">
                <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <a href={way.href}>{way.buttonText}</a>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
