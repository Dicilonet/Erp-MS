'use client';

import React from 'react';
import { Target, Users, TrendingUp } from 'lucide-react';

export function PhilosophySection() {
    const pillars = [
        { icon: <Target className="h-8 w-8 text-blue-600"/>, title: "Tus Objetivos, Primero", description: "Cada decisión que tomamos está 100% alineada con tus metas a largo plazo." },
        { icon: <Users className="h-8 w-8 text-blue-600"/>, title: "Relación de Confianza", description: "Construimos relaciones duraderas basadas en la honestidad y la transparencia total." },
        { icon: <TrendingUp className="h-8 w-8 text-blue-600"/>, title: "Crecimiento Sostenible", description: "Buscamos un crecimiento sólido y sostenible, evitando riesgos innecesarios." },
    ];
    return (
         <section id="philosophy" className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight">Nuestra Filosofía de Inversión</h2>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Los tres pilares de nuestro éxito y el de nuestros clientes.</p>
                </div>
                 <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {pillars.map(pillar => (
                        <div key={pillar.title} className="p-6">
                            <div className="flex justify-center mb-4">{pillar.icon}</div>
                            <h3 className="text-lg font-semibold">{pillar.title}</h3>
                            <p className="mt-2 text-sm text-muted-foreground">{pillar.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
