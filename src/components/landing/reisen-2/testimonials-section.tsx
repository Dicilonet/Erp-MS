'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export function TestimonialsSection() {
  const testimonials = [
    { name: 'Elena R.', text: 'El tour en bus fue la mejor manera de ver toda la ciudad sin cansarnos. ¡El guía era divertidísimo y muy informativo!', avatar: 'https://i.pravatar.cc/150?img=49' },
    { name: 'Hans G.', text: 'Hicimos el paseo por el puerto al atardecer y fue mágico. Las vistas eran espectaculares. Una experiencia inolvidable.', avatar: 'https://i.pravatar.cc/150?img=68' },
    { name: 'Sophie L.', text: 'Nunca había aprendido tanto en un tour a pie. El guía nos llevó a rincones secretos que no aparecen en las guías. ¡10/10!', avatar: 'https://i.pravatar.cc/150?img=47' },
  ];

  return (
    <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Lo que Dicen Nuestros Viajeros</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">La opinión de quienes han confiado en nosotros.</p>
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
