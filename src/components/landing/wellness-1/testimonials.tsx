'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export function Testimonials() {
  const testimonials = [
    { name: 'Elena Rodríguez', text: 'El masaje descontracturante fue mágico. Salí flotando y sin ninguna tensión. El ambiente es increíblemente relajante.', avatar: 'https://i.pravatar.cc/150?img=49' },
    { name: 'Jürgen Keller', text: 'Una experiencia de 5 estrellas. Desde que entras por la puerta, todo está pensado para la relajación. El mejor regalo que me he hecho.', avatar: 'https://i.pravatar.cc/150?img=68' },
    { name: 'Chloe Dubois', text: 'Me encantó el masaje con aromaterapia. Los aceites eran de altísima calidad y la terapeuta, una gran profesional. Volveré pronto.', avatar: 'https://i.pravatar.cc/150?img=47' },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Lo que Dicen Nuestros Clientes</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Su bienestar y satisfacción son nuestra razón de ser.</p>
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
