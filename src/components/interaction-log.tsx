

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { addDoc, collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { Bot, Calendar, Loader2, Mail, MessageSquare, Phone, PlusCircle, User, Users, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { suggestInteractionSummary } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import type { Interaction, InteractionType } from '@/lib/types';


const formSchema = z.object({
  type: z.enum(['Llamada', 'Email', 'Reunión', 'Otro', 'Oferta'], { required_error: 'Debes seleccionar un tipo.' }),
  fullText: z.string().min(10, { message: 'El contenido debe tener al menos 10 caracteres.' }),
  summary: z.string(),
});

type FormData = z.infer<typeof formSchema>;

const iconMap: Record<InteractionType, React.ReactNode> = {
    'Llamada': <Phone className="h-5 w-5 text-muted-foreground" />,
    'Email': <Mail className="h-5 w-5 text-muted-foreground" />,
    'Reunión': <Users className="h-5 w-5 text-muted-foreground" />,
    'Otro': <MessageSquare className="h-5 w-5 text-muted-foreground" />,
    'Oferta': <FileText className="h-5 w-5 text-muted-foreground" />,
};


export function InteractionLog({ customerId }: { customerId: string }) {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { type: 'Email', fullText: '', summary: '' },
  });

   useEffect(() => {
    const q = query(
        collection(db, `customers/${customerId}/interactions`), 
        orderBy('date', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const interactionsData = snapshot.docs.map(doc => ({ ...doc.data(), interactionId: doc.id })) as Interaction[];
      setInteractions(interactionsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching interactions: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [customerId]);

  const handleGenerateSummary = async () => {
    const fullText = form.getValues('fullText');
    if (!fullText || fullText.length < 20) {
      form.setError('fullText', { type: 'manual', message: 'Se necesitan al menos 20 caracteres para generar un resumen.' });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await suggestInteractionSummary({ interactionText: fullText });
      form.setValue('summary', result.summary, { shouldValidate: true });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error de IA', description: 'No se pudo generar el resumen.' });
    } finally {
      setIsGenerating(false);
    }
  };

  async function onSubmit(values: FormData) {
     if (!values.summary) {
      form.setError('summary', { type: 'manual', message: 'El resumen no puede estar vacío. Genéralo o escríbelo.' });
      return;
    }
    setIsSaving(true);
    try {
        const newInteraction: Omit<Interaction, 'interactionId'> = {
            customerId: customerId,
            date: new Date().toISOString(),
            type: values.type,
            summary: values.summary,
            fullText: values.fullText,
            createdBy: 'admin-user-id' // Placeholder
        };

        await addDoc(collection(db, `customers/${customerId}/interactions`), newInteraction);
        
        toast({ title: '¡Interacción Guardada!', description: 'El registro se ha añadido al historial del cliente.' });
        setOpen(false);
        form.reset({type: 'Email', fullText: '', summary: ''});
    } catch (error) {
        console.error('Error saving interaction:', error);
        toast({ variant: 'destructive', title: 'Error al Guardar', description: 'No se pudo guardar la interacción.' });
    } finally {
        setIsSaving(false);
    }
  }


  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2"><MessageSquare /> Registro de Interacciones</CardTitle>
            <CardDescription>Historial de comunicaciones y notas sobre el cliente.</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                 <Button><PlusCircle className="mr-2 h-4 w-4" /> Registrar</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                 <DialogHeader>
                    <DialogTitle>Registrar Nueva Interacción</DialogTitle>
                    <DialogDescription>Añade una nueva entrada al historial de este cliente. Puedes usar la IA para resumir textos largos.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Tipo de Interacción</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Selecciona un tipo" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Email">Email</SelectItem>
                                        <SelectItem value="Llamada">Llamada</SelectItem>
                                        <SelectItem value="Reunión">Reunión</SelectItem>
                                        <SelectItem value="Oferta">Oferta</SelectItem>
                                        <SelectItem value="Otro">Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="fullText"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Contenido Original / Notas</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Pega aquí el contenido de un email, o escribe las notas de tu llamada/reunión..." {...field} rows={6} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="summary"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Resumen (Generado o Manual)</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="El resumen generado por la IA aparecerá aquí, o puedes escribirlo tú mismo." {...field} rows={3} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-col sm:flex-row gap-2">
                             <Button type="button" variant="outline" onClick={handleGenerateSummary} disabled={isGenerating} className="w-full sm:w-auto">
                                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                                {isGenerating ? 'Generando...' : 'Sugerir Resumen con IA'}
                            </Button>
                        </div>
                         <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isSaving ? 'Guardando...' : 'Guardar Interacción'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
                ) : interactions.length === 0 ? (
                    <p className="text-muted-foreground text-center py-10">No hay interacciones registradas.</p>
                ) : (
                    interactions.map(item => (
                        <div key={item.interactionId} className="flex gap-4 p-4 rounded-lg border bg-secondary/30">
                           {iconMap[item.type]}
                            <div className="flex-1 space-y-1">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-sm">{item.type}</p>
                                    <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleString()}</p>
                                </div>
                                <p className="text-sm text-foreground/90">{item.summary}</p>
                                <p className="text-xs text-muted-foreground pt-1">Registrado por: {item.createdBy}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </CardContent>
    </Card>
  );
}
