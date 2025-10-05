'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { LatLngExpression } from 'leaflet';
import { Badge } from '@/components/ui/badge';

const MapWithNoSSR = dynamic(() => import('@/components/marketing/geomarketing-map'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-700 flex items-center justify-center"><p>Cargando mapa...</p></div>,
});

interface LocationSectionProps {
    coords: { lat: number, lon: number };
    venueName: string;
}

export function LocationSection({ coords, venueName }: LocationSectionProps) {
  const business = {
    id: 1,
    name: venueName,
    lat: coords.lat,
    lon: coords.lon,
    crmStatus: 'neutro' as const,
    tags: {}
  };

  return (
    <div className="h-full w-full relative">
       <MapWithNoSSR 
            businesses={[business]} 
            zoneGeoJson={null} 
            selectedBusinessId={null} 
            mapView={{ center: [coords.lat, coords.lon], zoom: 15 }} 
        />
        <div className="absolute top-2 left-2 z-[1000]">
            <Badge className="bg-black/70 text-white text-md py-1 px-3">{venueName}</Badge>
        </div>
    </div>
  );
}
