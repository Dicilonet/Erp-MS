'use client';

import React from 'react';
import { HandHeart, Flower, Sun, Wind } from 'lucide-react';

const services = [
  { icon: <HandHeart />, name: 'Masaje Relajante' },
  { icon: <Flower />, name: 'Masaje con Aromaterapia' },
  { icon: <Sun />, name: 'Masaje con Piedras Calientes' },
  { icon: <Wind />, name: 'Masaje Descontracturante' },
];

export function ServicesGrid() {
  return (
    <section id="services" className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Nuestros Tratamientos</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Terapias diseñadas para aliviar el estrés, calmar la mente y revitalizar el cuerpo.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {services.map((service) => (
            <div key={service.name} className="flex flex-col items-center p-4 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400">
                {React.cloneElement(service.icon, { className: 'h-8 w-8' })}
              </div>
              <p className="mt-4 font-semibold">{service.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
