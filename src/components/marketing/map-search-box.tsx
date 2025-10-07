'use client';

import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import { Search, Loader2 } from 'lucide-react';
import type { LatLngExpression } from 'leaflet';
import type { CustomerStatus } from '@/lib/types';


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

interface MapSearchBoxProps {
    onSearchStart: () => void;
    onSearchSuccess: (geojson: any, center: LatLngExpression, businesses: Business[]) => void;
    onSearchError: () => void;
}

export function MapSearchBox({ onSearchStart, onSearchSuccess, onSearchError }: MapSearchBoxProps) {
    const [searchTerm, setSearchTerm] = useState('Düsseldorf');
    const [isSearching, setIsSearching] = useState(false);
    const { toast } = useToast();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm) return;

        setIsSearching(true);
        onSearchStart();

        try {
            const functions = getFunctions(app, 'europe-west1');
            const getBusinessesInArea = httpsCallable(functions, 'getBusinessesInArea');
            
            const result: any = await getBusinessesInArea({ zoneName: searchTerm });
            
            if (!result.data.success) {
                toast({
                    variant: "default",
                    title: "Búsqueda sin resultados",
                    description: result.data.message || 'No se encontraron datos para la zona especificada.',
                });
                onSearchError();
                return;
            }
            
            const { geojson, center, businesses } = result.data;
            onSearchSuccess(geojson, center, businesses);

        } catch (error: any) {
            console.error("Error en la búsqueda de geomarketing:", error);
            toast({
                variant: 'destructive',
                title: 'Error de Búsqueda',
                description: error.message,
            });
            onSearchError();
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <form onSubmit={handleSearch} className="flex w-full items-center space-x-2 mt-4">
            <Input
                placeholder="Zona o códigos postales (separados por comas)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isSearching}
            />
            <Button type="submit" disabled={isSearching}>
                {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Buscar
            </Button>
        </form>
    );
}
