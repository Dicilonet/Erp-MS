'use client';

import React from 'react';

export function AboutSection() {
    return (
         <section id="about" className="py-16 lg:py-24 bg-gray-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
                <div className="lg:order-2">
                    <h2 className="text-3xl font-bold tracking-tight text-purple-400">Nuestra Historia Sonora</h2>
                    <p className="mt-4 text-slate-300">
                        Desde nuestros inicios en un pequeño garaje, nuestra música ha sido un viaje de exploración, mezclando ritmos rock con melodías electrónicas. Cada canción es una historia, una pieza de nuestra alma compartida con el mundo.
                    </p>
                    <p className="mt-3 text-slate-300">
                      Buscamos crear una conexión genuina con quienes nos escuchan, transportarlos a otros lugares y hacerles sentir parte de algo más grande. Gracias por acompañarnos en este viaje.
                    </p>
                </div>
                <div className="lg:order-1">
                    <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1770&auto=format&fit=crop" alt="Banda de música ensayando" className="rounded-2xl shadow-xl aspect-video object-cover"/>
                </div>
            </div>
        </section>
    );
}
