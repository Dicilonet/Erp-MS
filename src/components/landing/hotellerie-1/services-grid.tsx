
'use client';

import { Wifi, Droplets, HeartPulse, Dumbbell, Car, Utensils, BellConcierge, Shirt } from 'lucide-react';

interface Service {
  name: string;
  enabled: boolean;
}

interface ServicesGridProps {
  services: { [key: string]: Service };
}

const iconMap: { [key: string]: React.ReactNode } = {
  wifi: <Wifi />,
  pool: <Droplets />,
  spa: <HeartPulse />,
  gym: <Dumbbell />,
  parking: <Car />,
  restaurant: <Utensils />,
  roomService: <BellConcierge />,
  laundry: <Shirt />,
};

export function ServicesGrid({ services }: ServicesGridProps) {
  const enabledServices = Object.entries(services).filter(([, service]) => service.enabled);

  return (
    <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Servicios Exclusivos</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Todo lo que necesita para una estancia perfecta.</p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-6 text-center md:grid-cols-4">
          {enabledServices.map(([key, service]) => (
            <div key={key} className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                {iconMap[key]}
              </div>
              <p className="mt-3 font-semibold">{service.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
