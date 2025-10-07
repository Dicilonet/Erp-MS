'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, introduce un email válido.' }),
  companyName: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
});

function SignUpForm() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: '', companyName: '' },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const functions = getFunctions(app, 'europe-west1');
            const submitContactForm = httpsCallable(functions, 'submitPublicContactForm');
            await submitContactForm(values);

            toast({
                title: '¡Gracias por tu interés!',
                description: 'Hemos recibido tu solicitud y te contactaremos pronto.',
            });
            form.reset();

        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error al enviar',
                description: error.message || 'No se pudo procesar tu solicitud.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="w-full shadow-2xl">
            <CardHeader>
                <CardTitle>Comienza tu Transformación</CardTitle>
                <CardDescription>Regístrate para una demo gratuita.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre de la Empresa</FormLabel>
                                <FormControl>
                                <Input placeholder="Tu empresa" {...field} disabled={isLoading} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email de Trabajo</FormLabel>
                                <FormControl>
                                <Input placeholder="tu@empresa.com" {...field} disabled={isLoading} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Solicitar Demo
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}


export function HeroSection() {
  return (
    <section className="relative bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
          <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                <span className="block">El Sistema Operativo</span>{' '}
                <span className="block text-primary">para tu Negocio</span>
              </h1>
              <p className="mt-3 text-base text-muted-foreground sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
                Centraliza, automatiza y expande tu empresa con M&SOLUTIONS. La plataforma todo-en-uno que integra CRM, proyectos, marketing y finanzas con el poder de la IA.
              </p>
               <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Button size="lg" className="w-full">
                    Comenzar Ahora <ArrowRight className="ml-2" />
                  </Button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                   <Button size="lg" variant="outline" className="w-full">
                    Ver Funcionalidades
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="relative h-full w-full flex items-center justify-center p-8 bg-muted/30">
            <SignUpForm />
        </div>
      </div>
    </section>
  );
}
