
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import type { Program } from '@/lib/types';


const formSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  description: z.string().min(10, { message: 'La descripción debe tener al menos 10 caracteres.' }),
  url: z.string().url({ message: 'Debe ser una URL válida.' }),
  logo: z.string().url({ message: "La URL del logo no es válida." }).or(z.literal('')).optional(),
  category: z.string().min(1, 'La categoría es requerida.'),
  apiKey: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ProgramFormProps {
  children: React.ReactNode;
  program?: Program;
  category?: string; 
}


export function ProgramForm({ children, program, category }: ProgramFormProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const isEditMode = !!program;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if(open) {
        form.reset({
            name: program?.name || '',
            description: program?.description || '',
            url: program?.url || '',
            logo: program?.logo || '',
            category: program?.category || category || '',
            apiKey: program?.apiKey || ''
        });
    }
  }, [open, program, category, form]);

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    try {
        const faviconUrl = values.logo || `https://www.google.com/s2/favicons?domain=${new URL(values.url).hostname}&sz=32`;
        const programData = { ...values, logo: faviconUrl };
        
        if (isEditMode && program.programId) {
            const programRef = doc(db, 'programs', program.programId);
            await setDoc(programRef, programData, { merge: true });
             toast({
                title: '¡Herramienta Actualizada!',
                description: `"${values.name}" se ha actualizado correctamente.`,
            });
        } else {
             await addDoc(collection(db, 'programs'), programData);
             toast({
                title: '¡Herramienta Creada!',
                description: `"${values.name}" se ha añadido al catálogo.`,
            });
        }
      
      setOpen(false);
    } catch (error) {
      console.error('Error saving program:', error);
      toast({
        variant: 'destructive',
        title: 'Error al Guardar',
        description: 'Hubo un problema al guardar la herramienta.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Editar' : 'Añadir'} Herramienta</DialogTitle>
          <DialogDescription>
             {isEditMode ? 'Modifica los detalles de la herramienta.' : 'Completa los detalles para añadir una nueva herramienta al catálogo.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Herramienta</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Canva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Diseño, Marketing" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Una breve descripción de lo que hace la herramienta." rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.herramienta.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL del Logo (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://.../logo.svg" {...field} />
                  </FormControl>
                   <p className="text-xs text-muted-foreground">Si se deja en blanco, se intentará usar el favicon del sitio web.</p>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key / Token (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Pega aquí la clave de API" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={(e) => { e.stopPropagation(); setOpen(false); }}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} onClick={(e) => e.stopPropagation()}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Guardando...' : (isEditMode ? 'Guardar Cambios' : 'Crear Herramienta')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
