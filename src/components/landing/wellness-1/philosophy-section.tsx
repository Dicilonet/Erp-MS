'use client';

import React from 'react';

export function PhilosophySection() {
    return (
         <section id="about-us" className="py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
                <div className="lg:order-2">
                    <h2 className="text-3xl font-bold tracking-tight text-teal-700 dark:text-teal-400">Nuestra Filosofía: El Arte de Cuidar</h2>
                    <p className="mt-4 text-slate-600 dark:text-slate-300">
                        En Oasis de Bienestar, creemos que el verdadero descanso es una necesidad, no un lujo. Nuestro enfoque holístico combina técnicas ancestrales con un profundo conocimiento de la anatomía para ofrecerte una experiencia que va más allá de un simple masaje.
                    </p>
                    <p className="mt-3 text-slate-600 dark:text-slate-300">
                       Cada tratamiento es un ritual personalizado, diseñado para liberar tensiones, equilibrar tu energía y guiarte hacia un estado de serenidad y bienestar duradero.
                    </p>
                </div>
                <div className="lg:order-1">
                    <img src="https://images.unsplash.com/photo-1599301822899-9105d0505a41?q=80&w=1770&auto=format&fit=crop" alt="Ambiente de spa con velas y orquídeas" className="rounded-2xl shadow-xl aspect-video object-cover"/>
                </div>
            </div>
        </section>
    );
}
