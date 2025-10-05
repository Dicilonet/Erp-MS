
'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Dumbbell, Heart, Zap, Waves } from 'lucide-react';

const disciplines = [
  {
    icon: <Dumbbell className="h-10 w-10 text-amber-400" />,
    title: "Musculación y Fitness",
    description: "Equipamiento de última generación para que alcances tus objetivos de fuerza y volumen.",
  },
  {
    icon: <Zap className="h-10 w-10 text-amber-400" />,
    title: "CrossFit y HIIT",
    description: "Entrenamientos de alta intensidad para llevar tu resistencia y capacidad al límite.",
  },
  {
    icon: <Heart className="h-10 w-10 text-amber-400" />,
    title: "Yoga y Pilates",
    description: "Encuentra el equilibrio entre cuerpo y mente en nuestras clases de conexión y flexibilidad.",
  },
    {
    icon: <Waves className="h-10 w-10 text-amber-400" />,
    title: "Actividades Acuáticas",
    description: "Disfruta de nuestra piscina con clases de aquagym, natación y rehabilitación.",
  },
];

export function DisciplinesSection() {
  return (
    <section id="disciplines" className="py-16 lg:py-24 bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">Encuentra tu Disciplina</h2>
          <p className="mt-2 text-lg text-gray-400">
            Una actividad para cada objetivo y nivel de condición física.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {disciplines.map((item) => (
            <Card key={item.title} className="p-6 text-center bg-gray-800 border-gray-700 hover:bg-gray-700/50 hover:border-amber-400/50 transition-all">
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{item.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
