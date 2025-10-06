'use client';

import React from 'react';

export function AboutSection() {
    return (
         <section id="about" className="py-16 lg:py-24 bg-gray-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
                <div className="lg:order-2">
                    <h2 className="text-3xl font-bold tracking-tight text-red-400">Nuestra Pasión: Crear Momentos</h2>
                    <p className="mt-4 text-slate-300">
                       Nacimos con la vocación de contar historias y crear experiencias que perduren en la memoria. Desde producciones teatrales hasta grandes eventos corporativos y contenido digital viral, nuestro equipo pone el alma en cada proyecto.
                    </p>
                    <p className="mt-3 text-slate-300">
                     Combinamos creatividad, tecnología y una producción impecable para garantizar que cada evento sea un éxito y cada pieza de contenido conecte con su público.
                    </p>
                </div>
                <div className="lg:order-1">
                    <img src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=1770&auto=format&fit=crop" alt="Público en un concierto" className="rounded-2xl shadow-xl aspect-video object-cover"/>
                </div>
            </div>
        </section>
    );
}
