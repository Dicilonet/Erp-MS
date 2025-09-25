
'use client';

import { ArrowUpRight, Heart, Loader2, PlusCircle, Trash2, Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { ProgramForm } from './program-form';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Program } from '@/lib/types';
import { Skeleton } from './ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

export function InterestingPrograms() {
    const { t } = useTranslation('dashboard');
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const q = query(collection(db, "programs"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const programsData = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                programId: doc.id,
            })) as Program[];
            setPrograms(programsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching programs: ", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleDelete = async (programId: string) => {
        try {
            await deleteDoc(doc(db, "programs", programId));
            toast({
                title: "Programa Eliminado",
                description: "El programa ha sido eliminado correctamente.",
            });
        } catch (error) {
            console.error("Error deleting program: ", error);
            toast({
                variant: 'destructive',
                title: "Error al Eliminar",
                description: "No se pudo eliminar el programa.",
            });
        }
    };


  return (
    <Card>
      <CardHeader>
         <div className="flex items-start justify-between">
          <div>
            <CardTitle>{t('interestingPrograms.title')}</CardTitle>
            <CardDescription>{t('interestingPrograms.description')}</CardDescription>
          </div>
           <ProgramForm>
                <Button size="sm" variant="ghost">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t('interestingPrograms.add')}
                </Button>
            </ProgramForm>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
            <div className="space-y-4">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 p-3">
                           <Skeleton className="h-10 w-10 rounded-md" />
                           <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-3 w-full" />
                           </div>
                        </div>
                    ))
                ) : programs.length === 0 ? (
                    <p className="text-center text-muted-foreground pt-10">{t('interestingPrograms.noPrograms')}</p>
                ) : (
                    programs.map((program) => (
                        <div key={program.programId} className="flex items-center gap-4 p-3 rounded-lg border bg-secondary/30 group">
                           <Image src={program.logo || "https://picsum.photos/40/40"} alt={`${program.name} logo`} width={40} height={40} className="rounded-md object-contain bg-white p-1" unoptimized/>
                            <div className="flex-1">
                                <h4 className="font-semibold">{program.name}</h4>
                                <p className="text-sm text-muted-foreground">{program.description}</p>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ProgramForm program={program}>
                                     <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Pencil className="h-4 w-4" />
                                     </Button>
                                </ProgramForm>

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>{t('interestingPrograms.deleteDialog.title')}</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        {t('interestingPrograms.deleteDialog.description', { name: program.name })}
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>{t('interestingPrograms.deleteDialog.cancel')}</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete(program.programId)} className="bg-destructive hover:bg-destructive/90">
                                        {t('interestingPrograms.deleteDialog.confirm')}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>

                                <a href={program.url} target="_blank" rel="noopener noreferrer">
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                     <ArrowUpRight className="h-5 w-5" />
                                  </Button>
                                </a>
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
