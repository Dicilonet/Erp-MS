'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export function TestimonialsSection() {
  const testimonials = [
    { name: 'Sofía R.', text: '¡Encontré el vestido perfecto! La calidad es increíble y el trato en la tienda, inmejorable. Se ha convertido en mi sitio de referencia.', avatar: 'https://i.pravatar.cc/150?img=45' },
    { name: 'Javier M.', text: 'Ropa con un estilo único y diferente. Me encanta que no sea lo típico que ves en todas partes. ¡Grandes descubrimientos!', avatar: 'https://i.pravatar.cc/150?img=68' },
    { name: 'Isabella C.', text: 'El personal tiene un gusto exquisito. Me ayudaron a crear un look completo y me sentí fantástica. Gracias por vuestra paciencia y profesionalidad.', avatar: 'https://i.pravatar.cc/150?img=31' },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Nuestra Comunidad</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Opiniones de quienes visten nuestra marca.</p>
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
