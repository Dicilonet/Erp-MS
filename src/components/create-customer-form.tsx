
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { addDoc, collection } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import type { Customer, CustomerPlanId, PaymentCycle, CountryCode } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const formSchema = z.object({
  // --- Info Principal ---
  name: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
  contactEmail: z.string().email({ message: 'Debe ser un email válido.' }),
  category: z.string().min(3, { message: 'La categoría debe tener al menos 3 caracteres.' }),
  description: z.string().min(10, { message: 'La descripción debe tener al menos 10 caracteres.' }),

  // --- Plan y Facturación ---
  planId: z.enum(['plan_privatkunde', 'plan_spender', 'plan_einzelhandler', 'plan_premium'], {
      required_error: 'Debes seleccionar un plan.'
  }),
  paymentCycle: z.enum(['mensual', 'semestral', 'anual']),
  hasPromoPrice: z.boolean().default(false),
  country: z.enum(['ES', 'DE', 'GB', 'US', 'OTHER'], { required_error: 'Debes seleccionar un país.' }),

  // --- Ubicación ---
  location: z.string().min(3, { message: 'La ubicación es requerida.' }),
  fullAddress: z.string().min(10, { message: 'La dirección completa es requerida.' }),
  coordinates: z.object({
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
  }),

  // --- Contacto y Enlaces ---
  phone: z.string().min(8, { message: 'El teléfono debe tener al menos 8 caracteres.' }),
  website: z.string().url({ message: 'La URL del sitio web no es válida.' }).or(z.literal('')),
  currentOfferUrl: z.string().url({ message: 'La URL de la oferta no es válida.' }).or(z.literal('')),
  logoUrl: z.string().url({ message: 'La URL del logo no es válida.' }).or(z.literal('')),

  // --- Metadatos ---
  diciloSearchId: z.string().optional(),
  imageHint: z.string().optional(),
  rating: z.coerce.number().min(0).max(5).default(0),
});

type FormData = z.infer<typeof formSchema>;

export function CreateCustomerForm({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      contactEmail: '',
      category: '',
      description: '',
      planId: undefined,
      paymentCycle: 'anual',
      hasPromoPrice: false,
      country: undefined,
      location: '',
      fullAddress: '',
      coordinates: { latitude: 0, longitude: 0 },
      phone: '',
      website: '',
      currentOfferUrl: '',
      logoUrl: '',
      diciloSearchId: '',
      imageHint: '',
      rating: 0,
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    try {
      // Create a new object that matches the Customer type
      const newCustomerData: Omit<Customer, 'customerId'> = {
        // Map all fields from the form
        name: values.name,
        contactEmail: values.contactEmail,
        category: values.category,
        description: values.description,
        planId: values.planId as CustomerPlanId,
        paymentCycle: values.paymentCycle as PaymentCycle,
        hasPromoPrice: values.hasPromoPrice,
        country: values.country as CountryCode,
        location: values.location,
        fullAddress: values.fullAddress,
        coordinates: values.coordinates,
        phone: values.phone,
        website: values.website,
        currentOfferUrl: values.currentOfferUrl,
        logoUrl: values.logoUrl,
        diciloSearchId: values.diciloSearchId,
        imageHint: values.imageHint || '',
        rating: values.rating,
        // Add default/system-generated fields
        status: 'activo',
        registrationDate: new Date().toISOString(),
        accountManager: {
          userId: 'adminUserId123', // Placeholder
          userName: 'Juan Pérez',
          userEmail: 'juan.perez@dicilo.com',
        },
      };

      await addDoc(collection(db, 'customers'), newCustomerData);

      toast({
        title: '¡Cliente Creado!',
        description: `El cliente "${values.name}" se ha registrado con el nuevo formato unificado.`,
      });
      
      setOpen(false);
      form.reset();

    } catch (error) {
      console.error('Error creating customer:', error);
      toast({
        variant: 'destructive',
        title: 'Error al Crear Cliente',
        description: 'Hubo un problema al guardar el cliente. Por favor, intenta de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{children}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Cliente (Formulario Unificado)</DialogTitle>
          <DialogDescription>
            Completa todos los detalles del negocio para crear un registro de cliente homogéneo.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs defaultValue="mainInfo">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="mainInfo">Info Principal</TabsTrigger>
                <TabsTrigger value="locationContact">Ubicación y Contacto</TabsTrigger>
                <TabsTrigger value="planWeb">Plan y Web</TabsTrigger>
              </TabsList>
              
              {/* Pestaña de Información Principal */}
              <TabsContent value="mainInfo" className="space-y-4 py-4">
                 <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Nombre del Negocio</FormLabel>
                        <FormControl><Input placeholder="Ej: Café Central" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="contactEmail"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email de Contacto</FormLabel>
                            <FormControl><Input placeholder="contacto@ejemplo.com" {...field} /></FormControl>
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
                            <FormControl><Input placeholder="Ej: Restaurante, Consultoría" {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                 </div>
                 <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Descripción del Negocio</FormLabel>
                        <FormControl><Textarea placeholder="Describe brevemente el negocio, sus servicios principales, etc." {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
              </TabsContent>
              
              {/* Pestaña de Ubicación y Contacto */}
              <TabsContent value="locationContact" className="space-y-4 py-4">
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Ubicación (Ciudad, País)</FormLabel>
                            <FormControl><Input placeholder="Düsseldorf, Alemania" {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                     <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Teléfono</FormLabel>
                            <FormControl><Input placeholder="+49 123 456789" {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                 </div>
                 <FormField
                    control={form.control}
                    name="fullAddress"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Dirección Completa</FormLabel>
                        <FormControl><Input placeholder="Königsallee 1, 40212 Düsseldorf" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                 <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="coordinates.latitude"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Latitud</FormLabel>
                            <FormControl><Input type="number" step="any" placeholder="51.2249" {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                     <FormField
                        control={form.control}
                        name="coordinates.longitude"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Longitud</FormLabel>
                            <FormControl><Input type="number" step="any" placeholder="6.7761" {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                 </div>
              </TabsContent>

              {/* Pestaña de Plan y Web */}
              <TabsContent value="planWeb" className="space-y-4 py-4">
                 <div className="grid grid-cols-3 gap-4">
                    <FormField name="planId" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Plan de Servicios</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona un plan" /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="plan_privatkunde">Privatkunde (€0/Jahr)</SelectItem><SelectItem value="plan_spender">Spender (€60/Jahr)</SelectItem><SelectItem value="plan_einzelhandler">Einzelhändler (€2.340/Jahr)</SelectItem><SelectItem value="plan_premium">Premium (€3.900/Jahr)</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <FormField name="paymentCycle" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Ciclo de Pago</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona ciclo" /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="anual">Anual</SelectItem><SelectItem value="semestral">Semestral</SelectItem><SelectItem value="mensual">Mensual</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                    )} />
                     <FormField name="country" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>País</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona país" /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="DE">Alemania</SelectItem><SelectItem value="ES">España</SelectItem><SelectItem value="GB">Reino Unido</SelectItem><SelectItem value="US">Estados Unidos</SelectItem><SelectItem value="OTHER">Otro</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                    )} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="website" render={({ field }) => (
                        <FormItem><FormLabel>Sitio Web</FormLabel><FormControl><Input type="url" placeholder="https://www.ejemplo.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="currentOfferUrl" render={({ field }) => (
                        <FormItem><FormLabel>URL Oferta Actual</FormLabel><FormControl><Input type="url" placeholder="https://www.ejemplo.com/oferta" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                 </div>
                 <FormField control={form.control} name="logoUrl" render={({ field }) => (
                    <FormItem><FormLabel>URL del Logo</FormLabel><FormControl><Input type="url" placeholder="https://www.ejemplo.com/logo.png" {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="hasPromoPrice" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Precio Promocional</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                 )} />
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Guardando...' : 'Crear Cliente'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

