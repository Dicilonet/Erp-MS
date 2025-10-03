
'use client';

import dynamic from 'next/dynamic';
import { MapPin, Phone, Mail } from 'lucide-react';

const MapWithNoSSR = dynamic(() => import('@/components/marketing/geomarketing-map'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted flex items-center justify-center"><p>Cargando mapa...</p></div>,
});

export function LocationMap() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-blue-700 dark:text-blue-400">Nuestra Ubicación</h2>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Encuéntranos en una localización privilegiada, con fácil acceso a los principales puntos de interés.</p>
          <div className="mt-6 space-y-4 text-slate-700 dark:text-slate-300">
            <p className="flex items-start gap-3"><MapPin className="h-5 w-5 text-blue-600 mt-1"/><span>Avenida del Lujo, 123, 28001 Madrid, España</span></p>
            <p className="flex items-center gap-3"><Phone className="h-5 w-5 text-blue-600"/><span>+34 912 345 678</span></p>
            <p className="flex items-center gap-3"><Mail className="h-5 w-5 text-blue-600"/><span>reservas@grandelysium.es</span></p>
          </div>
        </div>
        <div className="h-96 rounded-2xl overflow-hidden shadow-xl border">
          <MapWithNoSSR businesses={[]} zoneGeoJson={null} selectedBusinessId={null} mapView={{ center: [40.42, -3.69], zoom: 15 }} />
        </div>
      </div>
    </section>
  );
}
