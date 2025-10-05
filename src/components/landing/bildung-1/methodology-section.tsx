'use client';

import React from 'react';

export function MethodologySection() {
    return (
         <section id="methodology" className="py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
                <div className="lg:order-2">
                    <h2 className="text-3xl font-bold tracking-tight text-blue-700 dark:text-blue-400">Aprender Haciendo</h2>
                    <p className="mt-4 text-slate-600 dark:text-slate-300">
                        Nuestra metodología se centra en la práctica. Creemos que la mejor forma de aprender es aplicando los conocimientos en proyectos reales. Fomentamos un ambiente colaborativo, con grupos reducidos que garantizan una atención personalizada.
                    </p>
                    <p className="mt-3 text-slate-600 dark:text-slate-300">
                       Utilizamos las últimas tecnologías educativas para ofrecer una experiencia de aprendizaje interactiva y flexible, tanto en nuestras aulas como en nuestra plataforma online.
                    </p>
                </div>
                <div className="lg:order-1">
                    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1771&auto=format&fit=crop" alt="Estudiantes colaborando en un proyecto" className="rounded-2xl shadow-xl aspect-video object-cover"/>
                </div>
            </div>
        </section>
    );
}
