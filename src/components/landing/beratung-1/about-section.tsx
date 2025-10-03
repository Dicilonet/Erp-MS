'use client';

import React from 'react';

export function AboutSection() {
    return (
         <section id="about" className="py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
                <div className="lg:order-2">
                    <h2 className="text-3xl font-bold tracking-tight text-indigo-700 dark:text-indigo-400">Tu Socio en el Crecimiento</h2>
                    <p className="mt-4 text-slate-600 dark:text-slate-300">
                        Entendemos que cada persona es única. Por eso, nuestra metodología se basa en la escucha activa y la creación de un plan de acción 100% personalizado. No ofrecemos soluciones genéricas, sino estrategias que se adaptan a tus circunstancias, valores y objetivos.
                    </p>
                    <p className="mt-3 text-slate-600 dark:text-slate-300">
                       Con más de 15 años de experiencia, hemos ayudado a cientos de personas y empresas a superar obstáculos y a transformar su potencial en resultados tangibles. Tu éxito es nuestra misión.
                    </p>
                </div>
                <div className="lg:order-1">
                    <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop" alt="Consultor en una reunión" className="rounded-2xl shadow-xl aspect-[4/3] object-cover"/>
                </div>
            </div>
        </section>
    );
}
