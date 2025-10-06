'use client';

import React from 'react';
import { Globe, Map, ShieldCheck } from 'lucide-react';

const reasons = [
    { icon: <Globe className="h-8 w-8 text-blue-500"/>, title: "Red Global", description: "Conectamos su negocio con el mundo a través de una extensa red de socios estratégicos." },
    { icon: <Map className="h-8 w-8 text-blue-500"/>, title: "Tecnología de Seguimiento", description: "Visibilidad total de su mercancía en tiempo real, desde el origen hasta el destino final." },
    { icon: <ShieldCheck className="h-8 w-8 text-blue-500"/>, title: "Seguridad y Fiabilidad", description: "Su carga está segura con nosotros. Cumplimos con los más altos estándares de seguridad." },
];

export function WhyChooseUsSection() {
    return (
         <section className="py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight">¿Por Qué Elegirnos?</h2>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">La diferencia entre mover mercancía y entregar confianza.</p>
                </div>
                 <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {reasons.map(reason => (
                        <div key={reason.title} className="p-6">
                            <div className="flex justify-center mb-4">{reason.icon}</div>
                            <h3 className="text-lg font-semibold">{reason.title}</h3>
                            <p className="mt-2 text-sm text-muted-foreground">{reason.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
