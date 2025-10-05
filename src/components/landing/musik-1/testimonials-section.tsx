'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export function TestimonialsSection() {
  const testimonials = [
    { name: 'Javier L.', text: 'El directo más potente que he visto en años. La energía que transmiten es increíble. ¡Una experiencia inolvidable!', avatar: 'https://i.pravatar.cc/150?img=5' },
    { name: 'Sofia K.', text: 'Las letras de sus canciones son pura poesía. Me han acompañado en momentos muy importantes de mi vida. Gracias por tanto arte.', avatar: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Marco R.', text: 'Descubrí a la banda en un festival y fue un flechazo. Su mezcla de estilos es única. Ya tengo mi entrada para el próximo concierto.', avatar: 'https://i.pravatar.cc/150?img=60' },
  ];

  return (
    <section className="py-16 lg:py-24 bg-gray-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Lo que Dicen los Fans</h2>
          <p className="mt-2 text-lg text-gray-400">Vuestra energía es nuestro motor.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <Card key={i} className="bg-gray-900 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-full" />
                  <div>
                    <p className="font-semibold text-white">{t.name}</p>
                    <div className="flex text-purple-400">
                      {[...Array(5)].map((_, starIndex) => (
                        <Star key={starIndex} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{t.text}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
