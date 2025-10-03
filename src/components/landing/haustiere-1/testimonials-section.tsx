'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export function TestimonialsSection() {
  const testimonials = [
    { name: 'Ana, dueña de Max', text: '¡Increíble! Max vuelve a casa feliz y agotado después de un día en la guardería. El equipo es fantástico y se nota que aman a los animales.', avatar: 'https://i.pravatar.cc/150?img=49' },
    { name: 'Carlos, dueño de Luna', text: 'La peluquería es de 10. Dejan a Luna con un pelo espectacular y ella va encantada, sin ningún estrés. Grandes profesionales.', avatar: 'https://i.pravatar.cc/150?img=68' },
    { name: 'Laura, dueña de Kiko', text: 'El curso de adiestramiento ha sido un antes y un después. Kiko ahora es mucho más obediente y nuestro vínculo es más fuerte.', avatar: 'https://i.pravatar.cc/150?img=47' },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Opiniones de Nuestros Clientes</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Dueños felices, mascotas más felices.</p>
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
