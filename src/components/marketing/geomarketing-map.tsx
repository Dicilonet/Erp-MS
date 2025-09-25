'use client';

import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression } from 'leaflet';
import { useEffect, useRef } from 'react';
import type { CustomerStatus } from '@/lib/types';
import { MapViewUpdater } from './map-view-updater';


// --- Tipos de Datos ---
interface Business {
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

interface GeomarketingMapProps {
    zoneGeoJson: any;
    businesses: Business[];
    mapView: { center: LatLngExpression; zoom: number };
    selectedBusinessId: number | null;
}

// --- Iconos Personalizados ---
const createIcon = (color: string) => new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const iconMap = {
    activo: createIcon('green'),
    prospecto: createIcon('orange'),
    'sin interés': createIcon('red'),
    neutro: createIcon('blue'),
    inactivo: createIcon('grey'),
    pendiente: createIcon('yellow'),
};


export default function GeomarketingMap({ zoneGeoJson, businesses, mapView, selectedBusinessId }: GeomarketingMapProps) {
    const mapRef = useRef<L.Map | null>(null);
    const markersRef = useRef<Record<number, L.Marker>>({});

    useEffect(() => {
        if (selectedBusinessId && markersRef.current[selectedBusinessId]) {
            const marker = markersRef.current[selectedBusinessId];
            const map = mapRef.current;
            if (map) {
                map.flyTo(marker.getLatLng(), 16);
                marker.openPopup();
            }
        }
    }, [selectedBusinessId]);

    return (
        <MapContainer 
            center={mapView.center} 
            zoom={mapView.zoom} 
            scrollWheelZoom={true} 
            style={{ height: '100%', width: '100%', borderRadius: '0.5rem', zIndex: 10 }}
            ref={mapRef}
            whenCreated={mapInstance => { mapRef.current = mapInstance }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {zoneGeoJson && <GeoJSON data={zoneGeoJson} key={JSON.stringify(zoneGeoJson)} style={{ color: '#3b82f6', weight: 2 }} />}
            
            {businesses.filter(b => b.lat && b.lon).map(biz => (
                <Marker 
                    key={biz.id} 
                    position={[biz.lat, biz.lon]}
                    icon={iconMap[biz.crmStatus] || iconMap.neutro}
                    ref={(el) => {
                        if (el) {
                            markersRef.current[biz.id] = el;
                        }
                    }}
                >
                    <Popup>
                        <div className={`font-sans border-l-4 p-1 pl-3 border-blue-500`}>
                          <h4 className="font-bold text-md">{biz.name}</h4>
                           {biz.tags?.fullAddress && <p className="text-sm">{biz.tags.fullAddress}</p>}
                           {biz.tags?.phone && <p className="text-sm">{biz.tags.phone}</p>}
                           {biz.tags?.website && <a href={biz.tags.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">Visitar web</a>}
                        </div>
                    </Popup>
                </Marker>
            ))}

            <MapViewUpdater center={mapView.center} zoom={mapView.zoom} />
        </MapContainer>
    );
}
