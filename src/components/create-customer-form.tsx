
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { addDoc, collection } from 'firebase/firestore';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import type { Customer, CustomerPlanId, PaymentCycle, CountryCode } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { landingPageCategories } from '@/app/(protected)/articulos/landing-pages/page';
import { useTranslation } from 'react-i18next';


const businessCategories = [
    "Beratung", "Bildung", "Finanzdienstleistung", "Gastronomie", "Gesundheit", 
    "Hotellerie", "Immobilien", "Lebensmittel", "Textil", "Musik", "Soziales", 
    "Sport", "Reise", "Technologie", "Tier", "Transport", "Umwelt", "Unterhaltung"
];

const formSchema = z.object({
  // --- Info Principal ---
  name: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
  contactEmail: z.string().email({ message: 'Debe ser un email válido.' }),
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

  // --- Nuevos campos ---
  category: z.string().min(1, { message: 'La categoría es requerida.' }),
  assignedLandingPage: z.string().optional(),
  landingPageSubdomain: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function CreateCustomerForm({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation('customers');
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      contactEmail: '',
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
      category: '',
      assignedLandingPage: '',
      landingPageSubdomain: '',
    },
  });

  const selectedCategory = form.watch('category');

  const filteredLandingPages = landingPageCategories
    .find(cat => cat.titleKey.split('.').pop() === selectedCategory.toLowerCase())?.pages || [];


  async function onSubmit(values: FormData) {
    setIsLoading(true);
    try {
      const newCustomerData: Omit<Customer, 'customerId'> = {
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
        status: 'activo',
        registrationDate: new Date().toISOString(),
        accountManager: {
          userId: 'adminUserId123',
          userName: 'Juan Pérez',
          userEmail: 'juan.perez@dicilo.com',
        },
        assignedLandingPage: values.assignedLandingPage,
        landingPageSubdomain: values.landingPageSubdomain,
      };

      await addDoc(collection(db, 'customers'), newCustomerData);

      toast({
        title: t('form.toast.successTitle'),
        description: t('form.toast.successDescription', { customerName: values.name }),
      });
      
      setOpen(false);
      form.reset();

    } catch (error) {
      console.error('Error creating customer:', error);
      toast({
        variant: 'destructive',
        title: t('form.toast.errorTitle'),
        description: t('form.toast.errorDescription'),
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t('form.createTitle')}</DialogTitle>
          <DialogDescription>
            {t('form.createDescription')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs defaultValue="mainInfo">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="mainInfo">{t('form.tabs.mainInfo')}</TabsTrigger>
                <TabsTrigger value="locationContact">{t('form.tabs.locationContact')}</TabsTrigger>
                <TabsTrigger value="planWeb">{t('form.tabs.planWeb')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="mainInfo" className="space-y-4 py-4">
                 <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('form.main.name.label')}</FormLabel>
                        <FormControl><Input placeholder={t('form.main.name.placeholder')} {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                 <div className="grid grid-cols-1 gap-4">
                    <FormField
                        control={form.control}
                        name="contactEmail"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t('form.main.email.label')}</FormLabel>
                            <FormControl><Input placeholder={t('form.main.email.placeholder')} {...field} /></FormControl>
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
                        <FormLabel>{t('form.main.description.label')}</FormLabel>
                        <FormControl><Textarea placeholder={t('form.main.description.placeholder')} {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
              </TabsContent>
              
              <TabsContent value="locationContact" className="space-y-4 py-4">
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t('form.location.cityCountry.label')}</FormLabel>
                            <FormControl><Input placeholder={t('form.location.cityCountry.placeholder')} {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                     <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t('form.location.phone.label')}</FormLabel>
                            <FormControl><Input placeholder={t('form.location.phone.placeholder')} {...field} /></FormControl>
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
                        <FormLabel>{t('form.location.address.label')}</FormLabel>
                        <FormControl><Input placeholder={t('form.location.address.placeholder')} {...field} /></FormControl>
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
                            <FormLabel>{t('form.location.latitude.label')}</FormLabel>
                            <FormControl><Input type="number" step="any" placeholder={t('form.location.latitude.placeholder')} {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                     <FormField
                        control={form.control}
                        name="coordinates.longitude"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t('form.location.longitude.label')}</FormLabel>
                            <FormControl><Input type="number" step="any" placeholder={t('form.location.longitude.placeholder')} {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                 </div>
              </TabsContent>

              <TabsContent value="planWeb" className="space-y-4 py-4">
                 <div className="grid grid-cols-3 gap-4">
                    <FormField name="planId" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>{t('form.plan.servicePlan.label')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t('form.plan.servicePlan.placeholder')} /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="plan_privatkunde">Privatkunde (€0/Jahr)</SelectItem><SelectItem value="plan_spender">Spender (€60/Jahr)</SelectItem><SelectItem value="plan_einzelhandler">Einzelhändler (€2.340/Jahr)</SelectItem><SelectItem value="plan_premium">Premium (€3.900/Jahr)</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <FormField name="paymentCycle" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>{t('form.plan.paymentCycle.label')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t('form.plan.paymentCycle.placeholder')} /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="anual">{t('form.plan.paymentCycle.annual')}</SelectItem><SelectItem value="semestral">{t('form.plan.paymentCycle.biannual')}</SelectItem><SelectItem value="mensual">{t('form.plan.paymentCycle.monthly')}</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                    )} />
                     <FormField name="country" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>{t('form.plan.country.label')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t('form.plan.country.placeholder')} /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="DE">{t('form.plan.country.de')}</SelectItem><SelectItem value="ES">{t('form.plan.country.es')}</SelectItem><SelectItem value="GB">{t('form.plan.country.gb')}</SelectItem><SelectItem value="US">{t('form.plan.country.us')}</SelectItem><SelectItem value="OTHER">{t('form.plan.country.other')}</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                    )} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t('form.plan.category.label')}</FormLabel>
                             <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('form.plan.category.placeholder')} />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {businessCategories.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                     />
                    <FormField name="assignedLandingPage" control={form.control} render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('form.plan.landingPage.label')}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCategory || filteredLandingPages.length === 0}>
                                <FormControl><SelectTrigger><SelectValue placeholder={filteredLandingPages.length > 0 ? t('form.plan.landingPage.placeholder') : t('form.plan.landingPage.noTemplates')} /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {filteredLandingPages.map(template => (
                                        <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                 <FormField control={form.control} name="landingPageSubdomain" render={({ field }) => (
                    <FormItem><FormLabel>{t('form.plan.subdomain.label')}</FormLabel>
                    <div className='flex items-center gap-2'>
                        <FormControl><Input placeholder={t('form.plan.subdomain.placeholder')} {...field} /></FormControl>
                        <span className='text-sm text-muted-foreground'>.dicilo.app</span>
                    </div>
                    <FormMessage /></FormItem>
                )} />

                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="website" render={({ field }) => (
                        <FormItem><FormLabel>{t('form.plan.website.label')}</FormLabel><FormControl><Input type="url" placeholder={t('form.plan.website.placeholder')} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="currentOfferUrl" render={({ field }) => (
                        <FormItem><FormLabel>{t('form.plan.offerUrl.label')}</FormLabel><FormControl><Input type="url" placeholder={t('form.plan.offerUrl.placeholder')} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                 </div>
                 <FormField control={form.control} name="logoUrl" render={({ field }) => (
                    <FormItem><FormLabel>{t('form.plan.logoUrl.label')}</FormLabel><FormControl><Input type="url" placeholder={t('form.plan.logoUrl.placeholder')} {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="hasPromoPrice" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>{t('form.plan.promoPrice')}</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                 )} />
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                {t('form.actions.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? t('form.actions.saving') : t('form.actions.create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
