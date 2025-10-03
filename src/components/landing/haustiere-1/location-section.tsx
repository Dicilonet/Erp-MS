'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const MapWithNoSSR = dynamic(() => import('@/components/marketing/geomarketing-map'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted flex items-center justify-center"><p>Cargando mapa...</p></div>,
});

export function LocationSection() {
  return (
    <section id="location" className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-amber-700 dark:text-amber-500">Ven a Conocernos</h2>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Nuestro centro está diseñado para la seguridad y comodidad de tu mascota.</p>
          <div className="mt-6 space-y-4 text-slate-700 dark:text-slate-300">
            <p className="flex items-start gap-3"><MapPin className="h-5 w-5 text-amber-600 mt-1"/><span>Avenida de los Animales, 42, 28010 Madrid, España</span></p>
            <p className="flex items-center gap-3"><Phone className="h-5 w-5 text-amber-600"/><span>+34 912 345 111</span></p>
            <p className="flex items-center gap-3"><Mail className="h-5 w-5 text-amber-600"/><span>hola@patitasfelices.es</span></p>
            <p className="flex items-center gap-3"><Clock className="h-5 w-5 text-amber-600"/><span>Lunes - Viernes: 09:00 - 19:00</span></p>
          </div>
        </div>
        <div className="h-96 rounded-2xl overflow-hidden shadow-xl border">
          <MapWithNoSSR businesses={[]} zoneGeoJson={null} selectedBusinessId={null} mapView={{ center: [40.435, -3.692], zoom: 16 }} />
        </div>
      </div>
    </section>
  );
}
