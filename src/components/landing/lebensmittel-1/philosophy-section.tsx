
'use client';

import React from 'react';

export function PhilosophySection() {
    return (
         <section id="philosophy" className="py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
                <div className="lg:order-2">
                    <h2 className="text-3xl font-bold tracking-tight text-emerald-800 dark:text-emerald-500">Compromiso con lo Nuestro</h2>
                    <p className="mt-4 text-slate-600 dark:text-slate-300">
                        Creemos en el poder de lo local. Por eso, trabajamos directamente con agricultores y productores de la región para traer a tu mesa alimentos llenos de sabor, frescura y calidad.
                    </p>
                    <p className="mt-3 text-slate-600 dark:text-slate-300">
                       Nuestra tienda es más que un lugar para comprar; es un punto de encuentro para quienes valoran la comida real, el trato cercano y el apoyo a la economía local.
                    </p>
                </div>
                <div className="lg:order-1">
                    <img src="https://images.unsplash.com/photo-1498579809087-ef1e55b2a057?q=80&w=1770&auto=format&fit=crop" alt="Agricultor mostrando su cosecha" className="rounded-2xl shadow-xl aspect-[4/3] object-cover"/>
                </div>
            </div>
        </section>
    );
}
