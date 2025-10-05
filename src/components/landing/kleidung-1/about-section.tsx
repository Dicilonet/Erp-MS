'use client';

import React from 'react';

export function AboutSection() {
    return (
         <section id="about" className="py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
                <div className="lg:order-2">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">Nuestra Esencia</h2>
                    <p className="mt-4 text-slate-600 dark:text-slate-300">
                        Nacimos de la pasión por el diseño atemporal y la confección de calidad. Cada prenda está pensada para perdurar, combinando tendencias modernas con la artesanía tradicional para crear piezas que te acompañarán temporada tras temporada.
                    </p>
                    <p className="mt-3 text-slate-600 dark:text-slate-300">
                      Creemos en la moda consciente. Utilizamos materiales sostenibles y trabajamos con talleres locales para asegurar no solo la excelencia en cada costura, sino también un impacto positivo en nuestra comunidad y en el planeta.
                    </p>
                </div>
                <div className="lg:order-1">
                    <img src="https://images.unsplash.com/photo-1551803091-e3a34a8a65b0?q=80&w=1887&auto=format&fit=crop" alt="Diseñadora trabajando en su taller" className="rounded-2xl shadow-xl aspect-square object-cover"/>
                </div>
            </div>
        </section>
    );
}
