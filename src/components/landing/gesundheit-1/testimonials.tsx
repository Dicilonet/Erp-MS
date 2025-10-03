'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export function Testimonials() {
  const testimonials = [
    { name: 'Laura Gómez', text: 'El trato fue excepcional desde la primera llamada. El Dr. aresolvió todas mis dudas con paciencia y profesionalidad. Me sentí en las mejores manos.', avatar: 'https://i.pravatar.cc/150?img=25' },
    { name: 'Markus Weber', text: 'Instalaciones modernas y un equipo increíble. Han resuelto un problema que arrastraba desde hacía años. Totalmente recomendable.', avatar: 'https://i.pravatar.cc/150?img=60' },
    { name: 'Familia Chen', text: 'Llevamos a nuestros hijos y el trato es maravilloso. Se han ganado nuestra confianza por completo. Gracias por cuidar de nuestra familia.', avatar: 'https://i.pravatar.cc/150?img=33' },
  ];

  return (
    <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">La Experiencia de Nuestros Pacientes</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Su confianza es nuestro mayor logro.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <Card key={t.name}>
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
