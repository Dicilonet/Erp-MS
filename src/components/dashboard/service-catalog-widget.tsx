
'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, limit } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, FolderSync } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import type { Program } from '@/lib/types';

export function ServiceCatalogWidget() {
    const { t } = useTranslation('connections');
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulamos "últimos abiertos" tomando 2 de una categoría específica como Marketing.
        const q = query(
            collection(db, "programs"), 
            where("category", "==", "Marketing y Analítica"), 
            limit(2)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const programsData = snapshot.docs.map(doc => ({
                ...doc.data(),
                programId: doc.id,
            })) as Program[];
            setPrograms(programsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching programs for widget: ", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2"><FolderSync /> {t('serviceCatalog.title')}</CardTitle>
                        <CardDescription>Herramientas usadas recientemente.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {loading ? (
                         Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3 p-2">
                                <Skeleton className="h-8 w-8 rounded-md" />
                                <div className="flex-1 space-y-1">
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </div>
                        ))
                    ) : programs.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">No hay herramientas para mostrar.</p>
                    ) : (
                        programs.map(program => (
                            <div key={program.programId} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50">
                                <Image
                                    src={program.logo || `https://www.google.com/s2/favicons?domain=${new URL(program.url).hostname}&sz=32`}
                                    alt={`${program.name} logo`}
                                    width={32}
                                    height={32}
                                    className="rounded-md object-contain bg-white p-1"
                                    unoptimized
                                />
                                <div className="flex-1">
                                    <p className="font-semibold">{program.name}</p>
                                </div>
                                <Button variant="ghost" size="icon" asChild>
                                    <a href={program.url} target="_blank" rel="noopener noreferrer">
                                        <ArrowRight className="h-4 w-4" />
                                    </a>
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
            <CardFooter>
                 <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/connections">
                        Ver todo el catálogo
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
