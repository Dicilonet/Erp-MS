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
          <h2 className="text-3xl font-bold tracking-tight">Nuestra Boutique</h2>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Un espacio donde la moda cobra vida. Te esperamos.</p>
          <div className="mt-6 space-y-4 text-slate-700 dark:text-slate-300">
            <p className="flex items-start gap-3"><MapPin className="h-5 w-5 text-gray-600 mt-1"/><span>Calle de la Moda, 12, 28004 Madrid, España</span></p>
            <p className="flex items-center gap-3"><Phone className="h-5 w-5 text-gray-600"/><span>+34 912 345 777</span></p>
            <p className="flex items-center gap-3"><Mail className="h-5 w-5 text-gray-600"/><span>hola@chicboutique.es</span></p>
            <p className="flex items-center gap-3"><Clock className="h-5 w-5 text-gray-600"/><span>Lunes - Sábado: 10:00 - 21:00</span></p>
          </div>
        </div>
        <div className="h-96 rounded-2xl overflow-hidden shadow-xl border">
          <MapWithNoSSR businesses={[]} zoneGeoJson={null} selectedBusinessId={null} mapView={{ center: [40.42, -3.70], zoom: 16 }} />
        </div>
      </div>
    </section>
  );
}
