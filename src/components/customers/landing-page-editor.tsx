'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { app, db } from '@/lib/firebase';
import type { Customer } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, LayoutTemplate, Save, Edit, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';

const contentSchema = z.object({
  hero: z.object({
    title: z.string().min(1, 'Requerido'),
    subtitle: z.string().min(1, 'Requerido'),
    backgroundImageUrl: z.string().url('URL inválida').or(z.literal('')),
  }),
  history: z.object({
    title: z.string().min(1, 'Requerido'),
    paragraph1: z.string().min(1, 'Requerido'),
    paragraph2: z.string().optional(),
    imageUrl: z.string().url('URL inválida').or(z.literal('')),
  }),
  contact: z.object({
    address: z.string().min(1, 'Requerido'),
    phone: z.string().min(1, 'Requerido'),
    email: z.string().email('Email inválido'),
    hours: z.string().min(1, 'Requerido'),
  }),
});

type ContentFormData = z.infer<typeof contentSchema>;

interface LandingPageEditorProps {
  customer: Customer;
}

export function LandingPageEditor({ customer }: LandingPageEditorProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      hero: { title: '', subtitle: '', backgroundImageUrl: '' },
      history: { title: '', paragraph1: '', paragraph2: '', imageUrl: '' },
      contact: { address: '', phone: '', email: '', hours: '' },
    },
  });

  useEffect(() => {
    const fetchContent = async () => {
      const contentRef = doc(db, 'customers', customer.customerId, 'landingPageContent', 'main');
      const contentSnap = await getDoc(contentRef);
      if (contentSnap.exists()) {
        form.reset(contentSnap.data() as ContentFormData);
      }
    };
    fetchContent();
  }, [customer.customerId, form]);

  const onSubmit = async (data: ContentFormData) => {
    setIsLoading(true);
    try {
        const functions = getFunctions(app, 'europe-west1');
        const updateContent = httpsCallable(functions, 'updateLandingPageContent');
        
        await updateContent({
            customerId: customer.customerId,
            content: data
        });

        toast({ title: 'Contenido Guardado', description: 'El contenido de la landing page se ha actualizado.' });
        setIsEditing(false);
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error al Guardar', description: error.message });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2"><LayoutTemplate /> Gestión de Landing Page</CardTitle>
                <CardDescription>Edita aquí el contenido de la landing page asignada: <span className="font-bold">{customer.assignedLandingPage}</span>.</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="edit-mode" className="text-sm font-medium">Modo Edición</Label>
                <Switch id="edit-mode" checked={isEditing} onCheckedChange={setIsEditing} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* --- SECCIÓN HERO --- */}
            <fieldset disabled={!isEditing} className="space-y-4 rounded-lg border p-4">
              <legend className="text-lg font-semibold px-2">Sección Principal (Hero)</legend>
              <FormField name="hero.title" control={form.control} render={({ field }) => (<FormItem><FormLabel>Título Principal</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="hero.subtitle" control={form.control} render={({ field }) => (<FormItem><FormLabel>Subtítulo</FormLabel><FormControl><Textarea {...field} rows={2} /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="hero.backgroundImageUrl" control={form.control} render={({ field }) => (<FormItem><FormLabel>URL de Imagen de Fondo</FormLabel><FormControl><Input type="url" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </fieldset>

             {/* --- SECCIÓN HISTORIA --- */}
            <fieldset disabled={!isEditing} className="space-y-4 rounded-lg border p-4">
              <legend className="text-lg font-semibold px-2">Sección Historia</legend>
              <FormField name="history.title" control={form.control} render={({ field }) => (<FormItem><FormLabel>Título de la Sección</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="history.paragraph1" control={form.control} render={({ field }) => (<FormItem><FormLabel>Párrafo 1</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="history.paragraph2" control={form.control} render={({ field }) => (<FormItem><FormLabel>Párrafo 2</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="history.imageUrl" control={form.control} render={({ field }) => (<FormItem><FormLabel>URL de Imagen de la Sección</FormLabel><FormControl><Input type="url" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </fieldset>

            {/* --- SECCIÓN CONTACTO --- */}
            <fieldset disabled={!isEditing} className="space-y-4 rounded-lg border p-4">
              <legend className="text-lg font-semibold px-2">Datos de Contacto</legend>
              <FormField name="contact.address" control={form.control} render={({ field }) => (<FormItem><FormLabel>Dirección</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <div className="grid grid-cols-2 gap-4">
                <FormField name="contact.phone" control={form.control} render={({ field }) => (<FormItem><FormLabel>Teléfono</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField name="contact.email" control={form.control} render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <FormField name="contact.hours" control={form.control} render={({ field }) => (<FormItem><FormLabel>Horario</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            </fieldset>
            
          </CardContent>
          {isEditing && (
            <CardFooter>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4"/>}
                    Guardar Contenido
                </Button>
            </CardFooter>
          )}
        </form>
      </Form>
    </Card>
  );
}