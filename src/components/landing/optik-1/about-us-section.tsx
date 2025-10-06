'use client';

import React from 'react';

export function AboutUsSection() {
    return (
         <section id="about" className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
                <div className="lg:order-2">
                    <h2 className="text-3xl font-bold tracking-tight text-cyan-700 dark:text-cyan-400">Una Visión Clara, un Equipo Experto</h2>
                    <p className="mt-4 text-slate-600 dark:text-slate-300">
                       Desde nuestra fundación, nos hemos dedicado a una sola cosa: cuidar de tu salud visual con la máxima profesionalidad y un toque personal. Nuestro equipo de optometristas y asesores de estilo está en constante formación para ofrecerte las soluciones más avanzadas y las monturas que mejor se adapten a ti.
                    </p>
                    <p className="mt-3 text-slate-600 dark:text-slate-300">
                      Creemos que ver bien es sentirse bien. Por eso, combinamos la precisión de la tecnología de vanguardia con un asesoramiento cercano para que encuentres no solo unas gafas, sino una nueva forma de ver el mundo.
                    </p>
                </div>
                <div className="lg:order-1">
                    <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1770&auto=format&fit=crop" alt="Equipo de ópticos profesionales" className="rounded-2xl shadow-xl aspect-video object-cover"/>
                </div>
            </div>
        </section>
    );
}
