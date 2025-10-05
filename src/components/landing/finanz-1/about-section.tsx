'use client';

import React from 'react';

export function AboutSection() {
    return (
         <section id="about" className="py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
                <div className="lg:order-2">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">Tu Asesor de Confianza</h2>
                    <p className="mt-4 text-slate-600 dark:text-slate-300">
                        Con más de 20 años de experiencia en los mercados financieros, mi misión es simple: ayudarte a alcanzar tus metas económicas con estrategias claras, honestas y personalizadas. No creo en las soluciones únicas; cada plan que diseño se adapta a tus circunstancias, tu perfil de riesgo y, lo más importante, tus sueños.
                    </p>
                    <p className="mt-3 text-slate-600 dark:text-slate-300">
                       Mi compromiso es la transparencia total y una comunicación constante. Juntos, construiremos un camino sólido hacia tu libertad financiera.
                    </p>
                </div>
                <div className="lg:order-1">
                    <img src="https://images.unsplash.com/photo-1556742059-4f774e035a42?q=80&w=1887&auto=format&fit=crop" alt="Asesor financiero en su despacho" className="rounded-2xl shadow-xl aspect-square object-cover"/>
                </div>
            </div>
        </section>
    );
}
