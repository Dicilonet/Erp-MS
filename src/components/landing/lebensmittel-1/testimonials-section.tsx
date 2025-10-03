
'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export function TestimonialsSection() {
  const testimonials = [
    { name: 'María G.', text: '¡La calidad es insuperable! Las frutas y verduras tienen un sabor que ya no recordaba. Se nota que son productos locales y frescos.', avatar: 'https://i.pravatar.cc/150?img=1' },
    { name: 'David L.', text: 'Mi tienda de confianza para el pan de cada día. La atención es siempre amable y cercana, te hacen sentir como en casa.', avatar: 'https://i.pravatar.cc/150?img=60' },
    { name: 'Laura F.', text: 'Me encantan las cestas semanales, siempre descubro verduras nuevas. Es una forma genial de comer sano y variado.', avatar: 'https://i.pravatar.cc/150?img=25' },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">La Opinión de Nuestros Clientes</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">La comunidad que hemos construido alrededor del buen comer.</p>
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
