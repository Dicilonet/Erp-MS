

'use client';

import { getFunctions, httpsCallable } from 'firebase/functions';
import { collection, deleteDoc, doc, getDocs, onSnapshot, query, writeBatch } from 'firebase/firestore';
import { Copy, Eye, EyeOff, Link as LinkIcon, Loader2, Pencil, PlusCircle, RefreshCw, Search, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

import { ProgramForm } from './program-form';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { app, db } from '@/lib/firebase';
import type { Program } from '@/lib/types';
import { useTranslation } from 'react-i18next';


export function ServiceCatalog() {
    const { t } = useTranslation('connections');
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);
    const [seeding, setSeeding] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [visibleTokens, setVisibleTokens] = useState<Record<string, boolean>>({});
    const { toast } = useToast();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('alphabetical');


    useEffect(() => {
        const q = query(collection(db, "programs"));
        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const programsData = snapshot.docs.map(doc => ({
                ...doc.data(),
                programId: doc.id,
            })) as Program[];
            
            if (snapshot.metadata.fromCache === false && programsData.length < 150) {
                console.log("Catálogo incompleto detectado. Reparando...");
                await handleSeedCatalog(programsData);
            } else {
                 setPrograms(programsData);
                 setLoading(false);
            }
             // Establecer categoría inicial si no hay una seleccionada
            if (!selectedCategory && programsData.length > 0) {
                const categories = [...new Set(programsData.map(p => p.category || 'General'))].sort();
                if (categories.length > 0) {
                    setSelectedCategory(categories[0]);
                }
            }

        }, (error) => {
            console.error("Error fetching programs: ", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [selectedCategory]);
    
    const handleSeedCatalog = async (existingPrograms: Program[]) => {
        setSeeding(true);
        setLoading(true);
        try {
            const functions = getFunctions(app, 'europe-west1');
            const seedServiceCatalog = httpsCallable(functions, 'seedServiceCatalog');
            const result: any = await seedServiceCatalog();
            
            toast({ title: 'Catálogo Restaurado', description: result.data.message });

        } catch (error: any) {
            console.error("Error fatal durante la siembra del catálogo:", error);
            toast({ variant: 'destructive', title: 'Error de Siembra', description: error.message });
        } finally {
            setSeeding(false);
            setLoading(false);
        }
    };


    const programsByCategory = useMemo(() => {
        return programs.reduce((acc, program) => {
            const category = program.category || 'General';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(program);
            return acc;
        }, {} as Record<string, Program[]>);
    }, [programs]);


    const toggleTokenVisibility = (e: React.MouseEvent, programId: string) => {
        e.stopPropagation();
        setVisibleTokens(prev => ({ ...prev, [programId]: !prev[programId] }));
    };

    const copyToClipboard = (e: React.MouseEvent, text: string) => {
        e.stopPropagation();
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast({ title: t('serviceCatalog.toast.copiedTitle'), description: t('serviceCatalog.toast.copiedDescription') });
    };

    const handleDelete = async (e: React.MouseEvent, programId: string) => {
        e.stopPropagation();
        try {
            await deleteDoc(doc(db, "programs", programId));
            toast({ title: t('serviceCatalog.toast.deletedTitle'), description: t('serviceCatalog.toast.deletedDescription') });
        } catch (error) {
            toast({ variant: 'destructive', title: t('serviceCatalog.toast.deleteErrorTitle'), description: t('serviceCatalog.toast.deleteErrorDescription') });
        }
    };
    
    const categories = Object.keys(programsByCategory).sort();
    
    const filteredAndSortedPrograms = useMemo(() => {
        let currentPrograms = programsByCategory[selectedCategory] || [];

        // Filtrar
        if (searchTerm) {
            currentPrograms = currentPrograms.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        // Ordenar
        switch (sortBy) {
            case 'alphabetical':
                currentPrograms.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'most-searched':
            case 'last-opened':
            default:
                break;
        }

        return currentPrograms;
    }, [programsByCategory, selectedCategory, searchTerm, sortBy]);


    const renderSkeletons = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-[220px] w-full" />
            ))}
        </div>
    );

    const renderContent = () => {
        if (loading) return renderSkeletons();
        
        if (filteredAndSortedPrograms.length === 0 && !loading) {
            return (
                 <div className="text-center py-10">
                    <p className="text-muted-foreground">
                        {searchTerm ? t('serviceCatalog.noResults', { searchTerm: searchTerm }) : t('serviceCatalog.noToolsInCategory')}
                    </p>
                </div>
            )
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {filteredAndSortedPrograms.map((program) => (
                     <Card key={program.programId} className="group relative flex flex-col hover:border-primary/50 transition-colors min-h-[220px]">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={program.logo || `https://www.google.com/s2/favicons?domain=${new URL(program.url).hostname}&sz=32`}
                                        alt={`${program.name} logo`}
                                        width={32}
                                        height={32}
                                        className="rounded-md object-contain bg-white p-1"
                                        unoptimized
                                    />
                                    <CardTitle className="text-lg">{program.name}</CardTitle>
                                </div>
                                <a href={program.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                    <LinkIcon className="h-4 w-4" />
                                </a>
                            </div>
                            <CardDescription className="line-clamp-2 h-10 pt-1">{program.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-end">
                             {program.apiKey && (
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">{t('serviceCatalog.apiKeyLabel')}</label>
                                    <div className="relative">
                                        <Input
                                            type={visibleTokens[program.programId] ? 'text' : 'password'}
                                            value={program.apiKey}
                                            readOnly
                                            className="pr-20 font-mono text-xs h-9 bg-secondary"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center">
                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => toggleTokenVisibility(e, program.programId)}>
                                                {visibleTokens[program.programId] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => copyToClipboard(e, program.apiKey || '')}>
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                             )}
                        </CardContent>
                         <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             <ProgramForm program={program} category={program.category}>
                                <Button variant="ghost" size="icon" className="h-7 w-7 bg-secondary/80 hover:bg-secondary">
                                    <Pencil className="h-4 w-4" />
                                </Button>
                             </ProgramForm>
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 bg-destructive/20 hover:bg-destructive/30 text-destructive" onClick={(e) => e.stopPropagation()}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>{t('serviceCatalog.deleteDialog.title')}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {t('serviceCatalog.deleteDialog.description', { name: program.name })}
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>{t('serviceCatalog.deleteDialog.cancel')}</AlertDialogCancel>
                                    <AlertDialogAction onClick={(e) => handleDelete(e, program.programId)} className="bg-destructive hover:bg-destructive/90">{t('serviceCatalog.deleteDialog.confirm')}</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                         </div>
                    </Card>
                ))}
            </div>
        );
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                        <CardTitle>{t('serviceCatalog.title')}</CardTitle>
                        <CardDescription>{t('serviceCatalog.description')}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b">
                    <div className="flex flex-col sm:flex-row gap-2 flex-1">
                        <div className="flex-1 min-w-0">
                            <Select onValueChange={setSelectedCategory} value={selectedCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('serviceCatalog.selectCategoryPlaceholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(category => (
                                        <SelectItem key={category} value={category}>
                                            {category} ({programsByCategory[category]?.length || 0})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={t('serviceCatalog.searchPlaceholder')}
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                         <div className="flex-1 min-w-0">
                             <Select onValueChange={setSortBy} value={sortBy}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('serviceCatalog.sortBy.placeholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="alphabetical">{t('serviceCatalog.sortBy.alphabetical')}</SelectItem>
                                    <SelectItem value="most-searched">{t('serviceCatalog.sortBy.mostSearched')}</SelectItem>
                                    <SelectItem value="last-opened">{t('serviceCatalog.sortBy.lastOpened')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                     <div className="flex items-center gap-2 w-full md:w-auto">
                        <ProgramForm category={selectedCategory}>
                            <Button size="sm" variant="outline" className="w-full md:w-auto"><PlusCircle className="mr-2 h-4 w-4" /> {t('serviceCatalog.addTool')}</Button>
                        </ProgramForm>
                         <Button onClick={() => handleSeedCatalog(programs)} disabled={seeding || loading} variant="outline" size="sm" className="w-full md:w-auto">
                            {seeding || loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                            {t('serviceCatalog.restore')}
                        </Button>
                    </div>
                </div>
                <div className="mt-6">
                    {renderContent()}
                </div>
            </CardContent>
        </Card>
    );
}
