'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export function TestimonialsSection() {
  const testimonials = [
    { name: 'Familia García', text: 'Gracias a su ayuda, hemos podido planificar la universidad de nuestros hijos y nuestra jubilación con total seguridad. ¡Un servicio excepcional!', avatar: 'https://i.pravatar.cc/150?img=5' },
    { name: 'Dr. Klaus Richter', text: 'Como autónomo, la gestión de mis finanzas era un caos. Ahora tengo un plan claro, optimizo mis impuestos y mis inversiones crecen. 100% recomendable.', avatar: 'https://i.pravatar.cc/150?img=68' },
    { name: 'Elena Navarro', text: 'Me ayudaron a conseguir una hipoteca con unas condiciones que nunca habría encontrado por mi cuenta. Un trato cercano y muy profesional.', avatar: 'https://i.pravatar.cc/150?img=49' },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">La Tranquilidad de Nuestros Clientes</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Resultados reales para personas reales.</p>
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
