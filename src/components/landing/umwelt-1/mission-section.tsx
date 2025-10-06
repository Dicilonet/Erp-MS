'use client';

import React from 'react';

export function MissionSection() {
    return (
         <section id="mission" className="py-16 lg:py-24">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                <span className="text-sm font-semibold uppercase tracking-wider text-emerald-600">ONG sin fines de lucro</span>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-800 dark:text-white">Nuestra Misión: Un Planeta Saludable para Todos</h2>
                <p className="mt-6 text-lg text-slate-600 dark:text-slate-300">
                    Somos una organización dedicada a la conservación de la biodiversidad, la lucha contra el cambio climático y la promoción de un estilo de vida sostenible. Creemos que las pequeñas acciones colectivas tienen el poder de generar un gran cambio global.
                </p>
            </div>
        </section>
    );
}
