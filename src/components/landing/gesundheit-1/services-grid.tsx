'use client';

import { Stethoscope, HeartPulse, Microscope, Users } from 'lucide-react';

const services = [
  { icon: <Stethoscope />, name: 'Consulta General' },
  { icon: <HeartPulse />, name: 'Chequeos Preventivos' },
  { icon: <Microscope />, name: 'Análisis Clínicos' },
  { icon: <Users />, name: 'Segunda Opinión' },
];

export function ServicesGrid() {
  return (
    <section id="services" className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Nuestros Servicios</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Ofrecemos un cuidado integral y personalizado para ti y tu familia.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {services.map((service) => (
            <div key={service.name} className="flex flex-col items-center p-4 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-100 text-cyan-600 dark:bg-cyan-900/50 dark:text-cyan-400">
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
