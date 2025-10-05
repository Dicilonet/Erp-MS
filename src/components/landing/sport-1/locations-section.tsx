'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock } from 'lucide-react';
import dynamic from 'next/dynamic';

const MapWithNoSSR = dynamic(() => import('@/components/marketing/geomarketing-map'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-700 flex items-center justify-center"><p>Cargando mapa...</p></div>,
});


const locations = [
  {
    name: "Sede Centro",
    address: "Calle Gran Vía, 1, Madrid",
    phone: "+34 912 345 678",
    hours: "06:00 - 23:00",
    coords: { lat: 40.420, lon: -3.705 }
  },
  {
    name: "Sede Norte",
    address: "Paseo de la Castellana, 200, Madrid",
    phone: "+34 913 456 789",
    hours: "07:00 - 22:00",
    coords: { lat: 40.458, lon: -3.691 }
  },
  {
    name: "Sede Sur",
    address: "Avenida de la Albufera, 50, Madrid",
    phone: "+34 914 567 890",
    hours: "07:00 - 22:00",
    coords: { lat: 40.391, lon: -3.662 }
  },
];

export function LocationsSection() {
  const [selectedLocation, setSelectedLocation] = React.useState(locations[0]);

  return (
    <section id="locations" className="py-16 lg:py-24 bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-white">Nuestras Sedes</h2>
          <p className="mt-2 text-lg text-gray-400">Encuentra tu Fit-Center más cercano.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            {locations.map((loc) => (
              <Card 
                key={loc.name}
                className={`cursor-pointer transition-all ${selectedLocation.name === loc.name ? 'bg-amber-900/50 border-amber-500' : 'bg-gray-800 hover:bg-gray-700 border-gray-700'}`}
                onClick={() => setSelectedLocation(loc)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-white">{loc.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-300 space-y-2">
                  <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-amber-400" /> {loc.address}</p>
                  <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-amber-400" /> {loc.phone}</p>
                  <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-amber-400" /> {loc.hours}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="lg:col-span-2 rounded-lg overflow-hidden shadow-2xl min-h-[400px]">
             <MapWithNoSSR 
                businesses={[{
                    id: 1,
                    name: selectedLocation.name,
                    lat: selectedLocation.coords.lat,
                    lon: selectedLocation.coords.lon,
                    crmStatus: 'neutro',
                    tags: {}
                }]} 
                zoneGeoJson={null} 
                selectedBusinessId={null} 
                mapView={{ center: [selectedLocation.coords.lat, selectedLocation.coords.lon], zoom: 15 }} 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
