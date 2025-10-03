'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export function TestimonialsSection() {
  const testimonials = [
    { name: 'Carlos M.', text: 'El coaching profesional cambió mi carrera. Me dio la claridad y las herramientas que necesitaba para conseguir el ascenso.', avatar: 'https://i.pravatar.cc/150?img=11' },
    { name: 'Ana P.', text: 'Encontramos en la terapia familiar un espacio seguro para comunicarnos. Ha sido un antes y un después para nosotros.', avatar: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Sofia L.', text: 'La asesoría financiera me ayudó a poner orden en mis finanzas y a planificar mi futuro con confianza. Invaluable.', avatar: 'https://i.pravatar.cc/150?img=32' },
  ];

  return (
    <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Historias de Éxito</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Lo que dicen las personas que han confiado en nosotros.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-full" />
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, starIndex) => (
                        <Star key={starIndex} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">"{t.text}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
