'use client';

import dynamic from 'next/dynamic';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const MapWithNoSSR = dynamic(() => import('@/components/marketing/geomarketing-map'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted flex items-center justify-center"><p>Cargando mapa...</p></div>,
});

export function LocationMap() {
  return (
    <section id="location" className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-cyan-700 dark:text-cyan-400">Encuéntranos</h2>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Estamos en una ubicación céntrica y de fácil acceso.</p>
          <div className="mt-6 space-y-4 text-slate-700 dark:text-slate-300">
            <p className="flex items-start gap-3"><MapPin className="h-5 w-5 text-cyan-600 mt-1"/><span>Calle de la Salud, 42, 28010 Madrid, España</span></p>
            <p className="flex items-center gap-3"><Phone className="h-5 w-5 text-cyan-600"/><span>+34 910 987 654</span></p>
            <p className="flex items-center gap-3"><Mail className="h-5 w-5 text-cyan-600"/><span>citas@praxismodern.es</span></p>
            <p className="flex items-center gap-3"><Clock className="h-5 w-5 text-cyan-600"/><span>Lunes - Viernes: 09:00 - 19:00</span></p>
          </div>
        </div>
        <div className="h-96 rounded-2xl overflow-hidden shadow-xl border">
          <MapWithNoSSR businesses={[]} zoneGeoJson={null} selectedBusinessId={null} mapView={{ center: [40.43, -3.70], zoom: 15 }} />
        </div>
      </div>
    </section>
  );
}
