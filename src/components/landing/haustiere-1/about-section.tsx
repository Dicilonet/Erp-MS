'use client';

import React from 'react';

export function AboutSection() {
    return (
         <section id="about" className="py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
                <div className="lg:order-2">
                    <h2 className="text-3xl font-bold tracking-tight text-amber-700 dark:text-amber-500">Pasión por los Animales</h2>
                    <p className="mt-4 text-slate-600 dark:text-slate-300">
                        Fundamos "Patitas Felices" con una misión clara: crear un lugar seguro, divertido y profesional donde cada mascota es tratada como parte de nuestra propia familia. Nuestro equipo está formado por amantes de los animales con certificación profesional.
                    </p>
                    <p className="mt-3 text-slate-600 dark:text-slate-300">
                      Entendemos que tu mascota es un miembro más de tu familia. Por eso, nos dedicamos a ofrecerles el mejor cuidado, utilizando productos de alta calidad y técnicas de refuerzo positivo en todos nuestros servicios.
                    </p>
                </div>
                <div className="lg:order-1">
                    <img src="https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=1894&auto=format&fit=crop" alt="Cuidadora jugando con un perro feliz" className="rounded-2xl shadow-xl aspect-square object-cover"/>
                </div>
            </div>
        </section>
    );
}
