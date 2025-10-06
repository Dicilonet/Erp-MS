'use client';

import React from 'react';

export function AboutUsSection() {
    return (
         <section id="about" className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
                <div className="lg:order-2">
                    <h2 className="text-3xl font-bold tracking-tight text-sky-700 dark:text-sky-400">Un Equipo que te Escucha</h2>
                    <p className="mt-4 text-slate-600 dark:text-slate-300">
                        Somos más que audioprotesistas; somos un equipo de profesionales apasionados por mejorar la calidad de vida de las personas a través de una mejor audición. Entendemos que cada caso es único y requiere una atención personalizada y empática.
                    </p>
                    <p className="mt-3 text-slate-600 dark:text-slate-300">
                       Con tecnología de punta y una formación continua, nuestro objetivo es ofrecerte no solo un producto, sino una solución integral que te permita volver a conectar con los sonidos que más importan.
                    </p>
                </div>
                <div className="lg:order-1">
                    <img src="https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?q=80&w=1770&auto=format&fit=crop" alt="Equipo de audiólogos" className="rounded-2xl shadow-xl aspect-video object-cover"/>
                </div>
            </div>
        </section>
    );
}
