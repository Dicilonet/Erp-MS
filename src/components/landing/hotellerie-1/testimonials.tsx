
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export function Testimonials() {
  const testimonials = [
    { name: 'Ana y Carlos', text: 'Una experiencia de lujo. Cada detalle está cuidado al máximo. El personal es increíblemente atento. Volveremos sin dudarlo.', avatar: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Michael Schmidt', text: 'El mejor hotel en el que me he alojado por trabajo. Conexión perfecta, habitaciones cómodas y un restaurante excepcional.', avatar: 'https://i.pravatar.cc/150?img=5' },
    { name: 'Sophie Dubois', text: 'La escapada de fin de semana perfecta. El spa es un oasis de paz y las vistas desde la habitación son de ensueño.', avatar: 'https://i.pravatar.cc/150?img=3' },
  ];

  return (
    <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Opiniones de Nuestros Huéspedes</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">La satisfacción de nuestros visitantes es nuestro mayor orgullo.</p>
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
