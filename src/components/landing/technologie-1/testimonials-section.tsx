'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export function TestimonialsSection() {
  const testimonials = [
    { name: 'CEO de Innovatech', text: 'La implementación de TechFlow ha sido un antes y un después. Hemos automatizado el 40% de nuestros procesos manuales.', avatar: 'https://i.pravatar.cc/150?img=11' },
    { name: 'CTO de DataSolutions', text: 'Quantum BI nos ha dado una visibilidad de nuestro negocio que no teníamos. Tomamos decisiones basadas en datos, no en intuiciones.', avatar: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Founder de ConnectApp', text: 'El CRM es simplemente brillante. La capacidad de predecir qué clientes necesitan atención nos ha permitido reducir la tasa de abandono en un 15%.', avatar: 'https://i.pravatar.cc/150?img=33' },
  ];

  return (
    <section className="py-16 lg:py-24 bg-gray-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-white">Amado por las Start-ups que Lideran el Futuro</h2>
          <p className="mt-2 text-lg text-gray-400">Nuestros clientes son nuestros mejores embajadores.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <Card key={i} className="bg-gray-900 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-full" />
                  <div>
                    <p className="font-semibold text-white">{t.name}</p>
                    <div className="flex text-yellow-400">
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
