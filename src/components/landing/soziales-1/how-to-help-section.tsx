'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DollarSign, HandHeart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const waysToHelp = [
  {
    icon: <DollarSign className="h-10 w-10 text-green-600" />,
    title: "Haz una Donación",
    description: "Cada aportación, por pequeña que sea, nos ayuda a financiar nuestros proyectos y a llegar a más personas.",
    buttonText: "Donar Ahora",
    href: "#"
  },
  {
    icon: <HandHeart className="h-10 w-10 text-green-600" />,
    title: "Conviértete en Voluntario",
    description: "Tu tiempo y talento son el motor de nuestra organización. Únete a nuestro equipo de voluntarios.",
    buttonText: "Saber Más",
    href: "#contact"
  },
  {
    icon: <Users className="h-10 w-10 text-green-600" />,
    title: "Corre la Voz",
    description: "Ayúdanos a llegar a más gente. Comparte nuestra misión con tus amigos, familiares y en tus redes sociales.",
    buttonText: "Recomendar",
    href: "#recommend"
  },
];

export function HowToHelpSection() {
  return (
    <section id="help" className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Tu Ayuda es Fundamental</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Hay muchas formas de colaborar y ser parte del cambio.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {waysToHelp.map((way) => (
            <Card key={way.title} className="p-6 text-center flex flex-col">
                <div className="flex justify-center mb-4">{way.icon}</div>
                <h3 className="text-lg font-semibold">{way.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground flex-grow">{way.description}</p>
                 <div className="mt-6">
                    <Button asChild className="w-full bg-green-600 hover:bg-green-700">
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
