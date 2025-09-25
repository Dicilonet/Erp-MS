'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { MapSearchBox } from './map-search-box';
import { Building, Link as LinkIcon, Download, Phone, Mail, Loader2 } from 'lucide-react';
import type { LatLngExpression } from 'leaflet';
import { Button } from '../ui/button';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { CustomerStatus } from '@/lib/types';


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


interface BusinessesPanelProps {
    onSearchSuccess: (center: LatLngExpression, zoom: number, geojson: any, businesses: Business[]) => void;
    onBusinessSelect: (id: number) => void;
}

export function BusinessesPanel({ onSearchSuccess, onBusinessSelect }: BusinessesPanelProps) {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(false);
    const [importingId, setImportingId] = useState<number | null>(null);
    const { toast } = useToast();

    const setUniqueBusinesses = (businesses: Business[]) => {
        const uniqueIds = new Set();
        const uniqueBusinesses = businesses.filter(biz => {
            if (uniqueIds.has(biz.id)) {
                return false;
            } else {
                uniqueIds.add(biz.id);
                return true;
            }
        });
        setBusinesses(uniqueBusinesses);
    };

    const handleImportProspect = async (e: React.MouseEvent, business: any) => {
        e.stopPropagation();
        setImportingId(business.id);
        try {
            const functions = getFunctions(app, 'europe-west1');
            const saveProspect = httpsCallable(functions, 'saveProspectAsCustomer');
            const result: any = await saveProspect({ businessData: business });
            
            if (result.data.success) {
                toast({
                    title: "Prospecto Guardado",
                    description: `El negocio "${business.name}" ha sido añadido a tu lista de clientes.`,
                });
                 // Actualizar el estado local para reflejar el cambio de crmStatus
                setBusinesses(prev => prev.map(b => b.id === business.id ? { ...b, crmStatus: 'prospecto' } : b));

            } else {
                 throw new Error("No se pudo guardar el prospecto.");
            }

        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error al Importar',
                description: error.message,
            });
        } finally {
            setImportingId(null);
        }
    };
    
    const handleDownloadList = () => {
        if (businesses.length === 0) return;

        const headers = ["Nombre", "Dirección", "Teléfono", "Email", "Sitio Web", "Estatus CRM"];
        const rows = businesses.map(biz => [
            `"${biz.name.replace(/"/g, '""')}"`,
            `"${(biz.tags.fullAddress || '').replace(/"/g, '""')}"`,
            biz.tags.phone || '',
            biz.tags.email || '',
            biz.tags.website || '',
            biz.crmStatus,
        ]);

        const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `prospectos_geomarketing_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        
        toast({
            title: "Descarga Iniciada",
            description: `Se están descargando ${businesses.length} registros.`,
        });
    };


    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Búsqueda y Resultados</CardTitle>
                 <MapSearchBox 
                    onSearchStart={() => {
                        setLoading(true);
                        setBusinesses([]);
                    }}
                    onSearchSuccess={(geojson, center, businesses) => {
                        onSearchSuccess(center, 13, geojson, businesses);
                        setUniqueBusinesses(businesses);
                        setLoading(false);
                    }}
                    onSearchError={() => {
                         setLoading(false);
                    }}
                />
            </CardHeader>
            <CardContent className="flex-grow flex flex-col min-h-0">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2"><Building className="h-5 w-5"/> Negocios Encontrados ({businesses.length})</h3>
                    <Button onClick={handleDownloadList} disabled={businesses.length === 0 || loading} variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Descargar
                    </Button>
                </div>
                <ScrollArea className="flex-grow">
                    <div className="space-y-3 pr-4">
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
                    ) : businesses.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground pt-10">
                            No se encontraron negocios. Realiza una búsqueda para empezar.
                        </p>
                    ) : (
                        businesses.map((biz) => (
                           <div 
                            key={biz.id} 
                            className="p-3 border rounded-md text-sm hover:bg-secondary/50 transition-colors space-y-2 cursor-pointer"
                            onClick={() => onBusinessSelect(biz.id)}
                            >
                                <div className="flex justify-between items-start">
                                    <p className="font-semibold pr-2">{biz.name || 'Nombre no disponible'}</p>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-8"
                                      onClick={(e) => handleImportProspect(e, biz)}
                                      disabled={importingId === biz.id || biz.crmStatus !== 'neutro'}
                                    >
                                      {importingId === biz.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : biz.crmStatus !== 'neutro' ? null : (
                                        <>
                                          <Download className="mr-2 h-4 w-4" />
                                          Guardar
                                        </>
                                      )}
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">{biz.tags.fullAddress}</p>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs items-center text-muted-foreground">
                                    {biz.tags.phone && (
                                        <span className="flex items-center gap-1.5">
                                            <Phone className="h-3 w-3" />
                                            {biz.tags.phone}
                                        </span>
                                    )}
                                     {biz.tags.email && (
                                        <span className="flex items-center gap-1.5">
                                            <Mail className="h-3 w-3" />
                                            {biz.tags.email}
                                        </span>
                                    )}
                                    {biz.tags.website && (
                                        <a href={biz.tags.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                                            <LinkIcon className="h-3 w-3" />
                                            Sitio Web
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
