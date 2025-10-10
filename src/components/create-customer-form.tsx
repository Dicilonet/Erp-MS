'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { db, app } from '@/lib/firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';
import type { Customer, CustomerPlanId, PaymentCycle, CountryCode } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { landingPageCategories } from '@/app/(protected)/articulos/landing-pages/page';

const businessCategories = [
    "Beratung", "Bildung", "Finanzdienstleistung", "Gastronomie", "Gesundheit",
    "Hotellerie", "Immobilien", "Lebensmittel", "Textil", "Musik", "Soziales",
    "Sport", "Reise", "Technologie", "Tier", "Transport", "Umwelt", "Unterhaltung"
];

const countryList = {
    "Norteamérica": [ { code: "US", name: "Estados Unidos" }, { code: "CA", name: "Canadá" }, { code: "MX", name: "México" }, { code: "BZ", name: "Belice" }, { code: "SV", name: "El Salvador" }, { code: "PR", name: "Puerto Rico" }, { code: "DO", name: "República Dominicana" } ],
    "América del Sur": [ { code: "AR", name: "Argentina" }, { code: "BO", name: "Bolivia" }, { code: "BR", name: "Brasil" }, { code: "CL", name: "Chile" }, { code: "CO", name: "Colombia" }, { code: "EC", name: "Ecuador" }, { code: "GY", name: "Guyana" }, { code: "PY", name: "Paraguay" }, { code: "PE", name: "Perú" }, { code: "SR", name: "Surinam" }, { code: "UY", name: "Uruguay" }, { code: "VE", name: "Venezuela" }, ],
    "Europa": [ { code: "AL", name: "Albania" }, { code: "DE", name: "Alemania" }, { code: "AD", name: "Andorra" }, { code: "AM", name: "Armenia" }, { code: "AT", name: "Austria" }, { code: "AZ", name: "Azerbaiyán" }, { code: "BE", name: "Bélgica" }, { code: "BY", name: "Bielorrusia" }, { code: "BA", name: "Bosnia y Herzegovina" }, { code: "BG", name: "Bulgaria" }, { code: "CY", name: "Chipre" }, { code: "VA", name: "Ciudad del Vaticano" }, { code: "HR", name: "Croacia" }, { code: "DK", name: "Dinamarca" }, { code: "SK", name: "Eslovaquia" }, { code: "SI", name: "Eslovenia" }, { code: "ES", name: "España" }, { code: "EE", name: "Estonia" }, { code: "FI", name: "Finlandia" }, { code: "FR", name: "Francia" }, { code: "GE", name: "Georgia" }, { code: "GR", name: "Grecia" }, { code: "HU", name: "Hungría" }, { code: "IE", name: "Irlanda" }, { code: "IS", name: "Islandia" }, { code: "IT", name: "Italia" }, { code: "KZ", name: "Kazajistán" }, { code: "LV", name: "Letonia" }, { code: "LI", name: "Liechtenstein" }, { code: "LT", name: "Lituania" }, { code: "LU", name: "Luxemburgo" }, { code: "MK", name: "Macedonia del Norte" }, { code: "MT", name: "Malta" }, { code: "MD", name: "Moldavia" }, { code: "MC", name: "Mónaco" }, { code: "ME", name: "Montenegro" }, { code: "NO", name: "Noruega" }, { code: "NL", name: "Países Bajos" }, { code: "PL", name: "Polonia" }, { code: "PT", name: "Portugal" }, { code: "GB", name: "Reino Unido" }, { code: "CZ", name: "República Checa" }, { code: "RO", name: "Rumanía" }, { code: "RU", name: "Rusia" }, { code: "SM", name: "San Marino" }, { code: "RS", name: "Serbia" }, { code: "SE", name: "Suecia" }, { code: "CH", name: "Suiza" }, { code: "TR", name: "Turquía" }, { code: "UA", name: "Ucrania" }, ],
    "Asia": [ { code: "AF", name: "Afganistán" }, { code: "SA", name: "Arabia Saudita" }, { code: "BD", name: "Bangladés" }, { code: "MM", name: "Birmania" }, { code: "BT", name: "Bután" }, { code: "KH", name: "Camboya" }, { code: "CN", name: "China" }, { code: "KP", name: "Corea del Norte" }, { code: "KR", name: "Corea del Sur" }, { code: "AE", name: "Emiratos Árabes Unidos" }, { code: "PH", name: "Filipinas" }, { code: "IN", name: "India" }, { code: "ID", name: "Indonesia" }, { code: "IQ", name: "Irak" }, { code: "IR", name: "Irán" }, { code: "IL", name: "Israel" }, { code: "JP", name: "Japón" }, { code: "JO", name: "Jordania" }, { code: "KG", name: "Kirguistán" }, { code: "KW", name: "Kuwait" }, { code: "LA", name: "Laos" }, { code: "LB", name: "Líbano" }, { code: "MY", name: "Malasia" }, { code: "MV", name: "Maldivas" }, { code: "MN", name: "Mongolia" }, { code: "NP", name: "Nepal" }, { code: "OM", name: "Omán" }, { code: "PK", name: "Pakistán" }, { code: "QA", name: "Catar" }, { code: "SG", name: "Singapur" }, { code: "SY", name: "Siria" }, { code: "LK", name: "Sri Lanka" }, { code: "TH", name: "Tailandia" }, { code: "TJ", name: "Tayikistán" }, { code: "TM", name: "Turkmenistán" }, { code: "UZ", name: "Uzbekistán" }, { code: "VN", name: "Vietnam" }, { code: "YE", name: "Yemen" }, ]
};

const allCountryCodes = [...Object.values(countryList).flat().map(c => c.code as string), 'OTHER'];

const formSchema = z.object({
  name: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
  contactEmail: z.string().email({ message: 'Debe ser un email válido.' }),
  description: z.string().min(10, { message: 'La descripción debe tener al menos 10 caracteres.' }),
  planId: z.enum(['plan_privatkunde', 'plan_spender', 'plan_einzelhandler', 'plan_premium']),
  paymentCycle: z.enum(['mensual', 'semestral', 'anual']),
  hasPromoPrice: z.boolean().default(false),
  country: z.enum(allCountryCodes as [string, ...string[]], { required_error: 'Debes seleccionar un país.' }),
  location: z.string().min(3, { message: 'La ubicación es requerida.' }),
  fullAddress: z.string().min(10, { message: 'La dirección completa es requerida.' }),
  coordinates: z.object({ latitude: z.coerce.number(), longitude: z.coerce.number(), }),
  phone: z.string().min(8, { message: 'El teléfono debe tener al menos 8 caracteres.' }),
  website: z.string().url({ message: 'La URL del sitio web no es válida.' }).or(z.literal('')),
  currentOfferUrl: z.string().url({ message: 'La URL de la oferta no es válida.' }).or(z.literal('')),
  logoUrl: z.string().url({ message: 'La URL del logo no es válida.' }).or(z.literal('')),
  diciloSearchId: z.string().optional(),
  imageHint: z.string().optional(),
  rating: z.coerce.number().min(0).max(5).default(0),
  category: z.string().min(1, { message: 'La categoría es requerida.' }),
  assignedLandingPage: z.string().optional(),
  landingPageSubdomain: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CreateCustomerFormProps {
  children: React.ReactNode;
  customerToEdit?: Customer;
}

export function CreateCustomerForm({ children, customerToEdit }: CreateCustomerFormProps) {
  const { t } = useTranslation(['customers', 'articles']);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const isEditMode = !!customerToEdit;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (open) {
      if (isEditMode && customerToEdit) {
        form.reset({
          ...customerToEdit,
          planId: customerToEdit.planId as CustomerPlanId,
          paymentCycle: customerToEdit.paymentCycle as PaymentCycle,
          country: customerToEdit.country as CountryCode,
          hasPromoPrice: customerToEdit.hasPromoPrice || false,
          coordinates: customerToEdit.coordinates || { latitude: 0, longitude: 0 },
        });
      } else {
        form.reset({
          name: '', contactEmail: '', description: '', planId: 'plan_einzelhandler', paymentCycle: 'anual',
          hasPromoPrice: false, country: 'DE', location: '', fullAddress: '', coordinates: { latitude: 0, longitude: 0 },
          phone: '', website: '', currentOfferUrl: '', logoUrl: '', diciloSearchId: '', imageHint: '',
          rating: 0, category: '', assignedLandingPage: '', landingPageSubdomain: '',
        });
      }
    }
  }, [open, customerToEdit, isEditMode, form]);

  const selectedCategory = form.watch('category');

  const filteredLandingPages = selectedCategory
    ? landingPageCategories.find(cat => cat.id.toLowerCase() === selectedCategory.toLowerCase())?.pages || []
    : [];

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    try {
      const functions = getFunctions(app, 'europe-west1');
      if (isEditMode && customerToEdit) {
        const updateCustomer = httpsCallable(functions, 'updateCustomer');
        await updateCustomer({ customerId: customerToEdit.customerId, data: values });
        toast({ title: t('form.toast.updateSuccessTitle'), description: t('form.toast.updateSuccessDescription', { customerName: values.name }) });
      } else {
          const newCustomerData: Omit<Customer, 'customerId'> = {
            ...values,
            status: 'activo',
            registrationDate: new Date().toISOString(),
            accountManager: { userId: 'adminUserId123', userName: 'Juan Pérez', userEmail: 'juan.perez@dicilo.com' },
          };
        await addDoc(collection(db, 'customers'), newCustomerData);
        toast({ title: t('form.toast.successTitle'), description: t('form.toast.successDescription', { customerName: values.name }) });
      }
      setOpen(false);
    } catch (error: any) {
      console.error('Error saving customer:', error);
      toast({ variant: 'destructive', title: isEditMode ? t('form.toast.updateErrorTitle') : t('form.toast.errorTitle'), description: error.message });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <DialogHeader>
                <DialogTitle>{isEditMode ? t('form.editTitle') : t('form.createTitle')}</DialogTitle>
                <DialogDescription>{isEditMode ? t('form.editDescription') : t('form.createDescription')}</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Tabs defaultValue="mainInfo">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="mainInfo">{t('form.tabs.mainInfo')}</TabsTrigger>
                        <TabsTrigger value="locationContact">{t('form.tabs.locationContact')}</TabsTrigger>
                        <TabsTrigger value="planWeb">{t('form.tabs.planWeb')}</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="mainInfo" className="space-y-4 py-4">
                        <FormField name="name" render={({ field }) => (<FormItem><FormLabel>{t('form.main.name.label')}</FormLabel><FormControl><Input placeholder={t('form.main.name.placeholder')} {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField name="contactEmail" render={({ field }) => (<FormItem><FormLabel>{t('form.main.email.label')}</FormLabel><FormControl><Input placeholder={t('form.main.email.placeholder')} {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField name="description" render={({ field }) => (<FormItem><FormLabel>{t('form.main.description.label')}</FormLabel><FormControl><Textarea placeholder={t('form.main.description.placeholder')} {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </TabsContent>
                    
                    <TabsContent value="locationContact" className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField name="location" render={({ field }) => (<FormItem><FormLabel>{t('form.location.cityCountry.label')}</FormLabel><FormControl><Input placeholder={t('form.location.cityCountry.placeholder')} {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField name="phone" render={({ field }) => (<FormItem><FormLabel>{t('form.location.phone.label')}</FormLabel><FormControl><Input placeholder={t('form.location.phone.placeholder')} {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                        <FormField name="fullAddress" render={({ field }) => (<FormItem><FormLabel>{t('form.location.address.label')}</FormLabel><FormControl><Input placeholder={t('form.location.address.placeholder')} {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField name="coordinates.latitude" render={({ field }) => (<FormItem><FormLabel>{t('form.location.latitude.label')}</FormLabel><FormControl><Input type="number" step="any" placeholder={t('form.location.latitude.placeholder')} {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField name="coordinates.longitude" render={({ field }) => (<FormItem><FormLabel>{t('form.location.longitude.label')}</FormLabel><FormControl><Input type="number" step="any" placeholder={t('form.location.longitude.placeholder')} {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                    </TabsContent>

                    <TabsContent value="planWeb" className="space-y-4 py-4">
                        <div className="grid grid-cols-3 gap-4">
                            <FormField name="planId" render={({ field }) => (<FormItem><FormLabel>{t('form.plan.servicePlan.label')}</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="plan_privatkunde">Privatkunde (€0/Jahr)</SelectItem><SelectItem value="plan_spender">Spender (€60/Jahr)</SelectItem><SelectItem value="plan_einzelhandler">Einzelhändler (€2.340/Jahr)</SelectItem><SelectItem value="plan_premium">Premium (€3.900/Jahr)</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                            <FormField name="paymentCycle" render={({ field }) => (<FormItem><FormLabel>{t('form.plan.paymentCycle.label')}</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="anual">{t('form.plan.paymentCycle.annual')}</SelectItem><SelectItem value="semestral">{t('form.plan.paymentCycle.biannual')}</SelectItem><SelectItem value="mensual">{t('form.plan.paymentCycle.monthly')}</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                            <FormField name="country" render={({ field }) => (<FormItem><FormLabel>{t('form.plan.country.label')}</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{Object.entries(countryList).map(([region, countries]) => (<SelectGroup key={region}><SelectLabel>{region}</SelectLabel>{countries.map(country => (<SelectItem key={country.code} value={country.code}>{country.name}</SelectItem>))}</SelectGroup>))}<SelectItem value="OTHER">{t('form.plan.country.other')}</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField name="category" render={({ field }) => (<FormItem><FormLabel>{t('form.plan.category.label')}</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t('form.plan.category.placeholder')} /></SelectTrigger></FormControl><SelectContent>{businessCategories.map(cat => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                            <FormField name="assignedLandingPage" render={({ field }) => (<FormItem><FormLabel>{t('form.plan.landingPage.label')}</FormLabel><Select onValueChange={field.onChange} value={field.value || ''} disabled={!selectedCategory || filteredLandingPages.length === 0}><FormControl><SelectTrigger><SelectValue placeholder={filteredLandingPages.length > 0 ? t('form.plan.landingPage.placeholder') : t('form.plan.landingPage.noTemplates')} /></SelectTrigger></FormControl><SelectContent>{filteredLandingPages.map(template => (<SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                        </div>
                        <FormField name="landingPageSubdomain" render={({ field }) => (<FormItem><FormLabel>{t('form.plan.subdomain.label')}</FormLabel><div className="flex items-center gap-2"><FormControl><Input placeholder={t('form.plan.subdomain.placeholder')} {...field} /></FormControl><span className='text-sm text-muted-foreground'>.dicilo.app</span></div><FormMessage /></FormItem>)} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField name="website" render={({ field }) => (<FormItem><FormLabel>{t('form.plan.website.label')}</FormLabel><FormControl><Input type="url" placeholder={t('form.plan.website.placeholder')} {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField name="currentOfferUrl" render={({ field }) => (<FormItem><FormLabel>{t('form.plan.offerUrl.label')}</FormLabel><FormControl><Input type="url" placeholder={t('form.plan.offerUrl.placeholder')} {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                        <FormField name="logoUrl" render={({ field }) => (<FormItem><FormLabel>{t('form.plan.logoUrl.label')}</FormLabel><FormControl><Input type="url" placeholder={t('form.plan.logoUrl.placeholder')} {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField name="hasPromoPrice" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>{t('form.plan.promoPrice')}</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                    </TabsContent>
                    </Tabs>
                </div>
                <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>{t('form.actions.cancel')}</Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? t('form.actions.saving') : (isEditMode ? t('form.actions.saveChanges') : t('form.actions.create'))}
                </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
