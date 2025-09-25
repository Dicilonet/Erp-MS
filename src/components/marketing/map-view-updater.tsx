'use client';

import { useMap } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import { useEffect } from 'react';

interface MapViewUpdaterProps {
  center: LatLngExpression;
  zoom: number;
}

export function MapViewUpdater({ center, zoom }: MapViewUpdaterProps) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}
