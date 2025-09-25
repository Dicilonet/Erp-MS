'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';
import { Map as MapIcon } from 'lucide-react';
import { FullScreenLoader } from '@/components/ui/fullscreen-loader';
import { BusinessesPanel } from '@/components/marketing/businesses-panel';
import { LatLngExpression } from 'leaflet';
import type { CustomerStatus } from '@/lib/types';


// Tipos para los datos
export interface Business {
    id: number;
    name: string;
    lat: number;
    lon: number;
    crmStatus: CustomerStatus | 'neutro';
    tags: {
        fullAddress?: string;
        website?: string;
        phone?: string;
        email?: string;
    };
}


const GeomarketingMap = dynamic(() => import('@/components/marketing/geomarketing-map'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted flex items-center justify-center"><FullScreenLoader /></div>,
});

export default function GeomarketingPage() {
    const { t } = useTranslation('marketing');
    const [zoneGeoJson, setZoneGeoJson] = useState<any>(null);
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [mapView, setMapView] = useState<{center: LatLngExpression, zoom: number}>({ center: [51.1657, 10.4515], zoom: 6 });
    const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);

    const handleSearchSuccess = (center: LatLngExpression, zoom: number, geojson: any, businesses: Business[]) => {
        setMapView({ center, zoom });
        setZoneGeoJson(geojson);
        setBusinesses(businesses);
        setSelectedBusinessId(null);
    };
    
    const handleBusinessSelect = (businessId: number) => {
        setSelectedBusinessId(businessId);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)]">
             <div className="mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-3"><MapIcon className="h-8 w-8"/>Geomarketing</h1>
                <p className="text-muted-foreground">Busca zonas, visualiza polígonos y encuentra prospectos de negocio con estatus de CRM.</p>
            </div>
            
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
                <div className="lg:col-span-2 min-h-[300px] lg:min-h-0 rounded-lg overflow-hidden border">
                   <GeomarketingMap
                    zoneGeoJson={zoneGeoJson}
                    businesses={businesses}
                    mapView={mapView}
                    selectedBusinessId={selectedBusinessId}
                   />
                </div>
                <div className="lg:col-span-1 min-h-[400px] lg:min-h-0">
                    <BusinessesPanel 
                        onSearchSuccess={handleSearchSuccess}
                        onBusinessSelect={handleBusinessSelect}
                    />
                </div>
            </div>
        </div>
    );
}
