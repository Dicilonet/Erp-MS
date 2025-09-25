
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { CalendarIcon, Loader2, PlusCircle, Save, Send, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { format, addDays } from 'date-fns';

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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { app, db } from '@/lib/firebase';
import type { Customer, Offer, OfferItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Separator } from './ui/separator';
import { useTranslation } from 'react-i18next';

const offerItemSchema = z.object({
    id: z.string(),
    description: z.string().min(1, 'La descripción es requerida.'),
    quantity: z.coerce.number().min(1, 'La cantidad debe ser al menos 1.'),
    price: z.coerce.number().min(0, 'El precio no puede ser negativo.'),
    unit: z.string().min(1, 'La unidad es requerida.'),
    discount: z.coerce.number().min(0).max(100).optional().default(0),
    taxRate: z.coerce.number().min(0).default(19),
});

const formSchema = z.object({
  customerId: z.string().min(1, { message: 'Debes seleccionar un cliente.' }),
  issueDate: z.date({ required_error: 'Se requiere una fecha de emisión.' }),
  expiryDate: z.date({ required_error: 'Se requiere una fecha de vencimiento.' }),
  documentTitle: z.string().min(1, 'El título del documento es requerido.'),
  introductoryText: z.string().optional(),
  items: z.array(offerItemSchema).min(1, 'Debe haber al menos un ítem en la oferta.'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CreateOfferFormProps {
  children: React.ReactNode;
  offerToEdit?: Offer;
  isDuplicate?: boolean;
}

export function CreateOfferForm({ children, offerToEdit, isDuplicate = false }: CreateOfferFormProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const { toast } = useToast();
  const { t } = useTranslation('offer');
  const isEditMode = !!offerToEdit && !isDuplicate;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });
  
  const selectedCustomerId = form.watch('customerId');
  const issueDate = form.watch('issueDate');
  
  useEffect(() => {
    if (open) {
      const q = query(collection(db, "customers"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const customersData = snapshot.docs.map(doc => ({ ...doc.data(), customerId: doc.id })) as Customer[];
        setCustomers(customersData);
      });
      return () => unsubscribe();
    }
  }, [open]);

  useEffect(() => {
    if(open){
        const defaultValues: FormData = offerToEdit ? {
            customerId: offerToEdit.customerId,
            issueDate: isDuplicate ? new Date() : new Date(offerToEdit.issueDate),
            expiryDate: isDuplicate ? addDays(new Date(), 30) : new Date(offerToEdit.expiryDate),
            documentTitle: offerToEdit.documentTitle,
            introductoryText: offerToEdit.introductoryText || '',
            items: offerToEdit.items.map(item => ({...item, id: crypto.randomUUID()})),
            notes: offerToEdit.notes || '',
        } : {
            customerId: '',
            issueDate: new Date(),
            expiryDate: addDays(new Date(), 30),
            documentTitle: 'Angebot',
            introductoryText: t('form.defaultIntro'),
            items: [{ id: crypto.randomUUID(), description: '', quantity: 1, unit: 'Stk', price: 0, discount: 0, taxRate: 19 }],
            notes: t('form.defaultNotes'),
        };
        form.reset(defaultValues);
    }
  }, [open, offerToEdit, isDuplicate, form, t]);


  useEffect(() => {
      if(!isEditMode) {
        const customer = customers.find(c => c.customerId === selectedCustomerId);
        if (customer) {
            form.setValue('introductoryText', t('form.defaultIntroWithCustomer', { name: customer.name }));
        }
      }
  }, [selectedCustomerId, customers, form, isEditMode, t]);

  useEffect(() => {
    if(issueDate) {
        form.setValue('expiryDate', addDays(issueDate, 30));
    }
  }, [issueDate, form]);

  const handleSave = async (values: FormData, shouldSend: boolean) => {
    setIsLoading(true);
    try {
        const functions = getFunctions(app, 'europe-west1');
        
        const payload: any = {
            ...values,
            issueDate: values.issueDate.toISOString(),
            expiryDate: values.expiryDate.toISOString(),
            sendEmail: shouldSend,
        };
        
        let result: any;
        if(isEditMode) {
            const updateOffer = httpsCallable(functions, 'updateOffer');
            payload.offerId = offerToEdit.offerId;
            result = await updateOffer(payload);
        } else {
            const createOffer = httpsCallable(functions, 'createOffer');
            result = await createOffer(payload);
        }
        
        if (result.data.success) {
            toast({
                title: shouldSend ? t('toast.sent.title') : t('toast.draft.title'),
                description: t(shouldSend ? 'toast.sent.description' : 'toast.draft.description', { offerNumber: result.data.offerNumber }),
            });
            setOpen(false);
        } else {
            throw new Error(result.data.message || t('toast.error.unknown'));
        }

    } catch (error: any) {
      console.error('Error saving offer:', error);
      toast({
        variant: 'destructive',
        title: t('toast.error.title'),
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };
  
  const items = form.watch('items') || [];
  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.price * (1 - (item.discount || 0) / 100)), 0);
  const totalTax = items.reduce((acc, item) => acc + (item.quantity * item.price * (1 - (item.discount || 0) / 100) * (item.taxRate / 100)), 0);
  const total = subtotal + totalTax;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? t('form.editTitle') : t('form.createTitle')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4 max-h-[85vh] overflow-y-auto pr-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-x-8 gap-y-4">
                {/* Columna Izquierda */}
                <div className="space-y-4 md:col-span-3">
                    <FormField name="customerId" render={({ field }) => (
                        <FormItem><FormLabel>{t('form.customer.label')}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder={t('form.customer.placeholder')} /></SelectTrigger></FormControl>
                            <SelectContent>{customers.map(c => <SelectItem key={c.customerId} value={c.customerId}>{c.name}</SelectItem>)}</SelectContent>
                        </Select><FormMessage />
                        </FormItem>
                    )} />
                    <FormField name="documentTitle" render={({ field }) => (
                        <FormItem><FormLabel>{t('form.documentTitle.label')}</FormLabel>
                        <FormControl><Input {...field} /></FormControl><FormMessage />
                        </FormItem>
                    )} />
                    <FormField name="introductoryText" render={({ field }) => (
                        <FormItem><FormLabel>{t('form.introductoryText.label')}</FormLabel>
                        <FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage />
                        </FormItem>
                    )} />
                </div>
                {/* Columna Derecha */}
                <div className="space-y-4 md:col-span-2">
                    <FormItem><FormLabel>{t('form.offerNumber.label')}</FormLabel><Input disabled value={isEditMode ? offerToEdit.offerNumber : t('form.offerNumber.auto')} /></FormItem>
                    <FormItem><FormLabel>{t('form.customerNumber.label')}</FormLabel><Input disabled value={selectedCustomerId ? selectedCustomerId.substring(0, 8) : ''} /></FormItem>
                     <div className="grid grid-cols-2 gap-4">
                         <FormField name="issueDate" render={({ field }) => (
                            <FormItem className="flex flex-col"><FormLabel>{t('form.issueDate.label')}</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("justify-start text-left font-normal",!field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "dd.MM.yyyy") : <span>{t('form.issueDate.placeholder')}</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                         )} />
                         <FormField name="expiryDate" render={({ field }) => (
                            <FormItem className="flex flex-col"><FormLabel>{t('form.expiryDate.label')}</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("justify-start text-left font-normal",!field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "dd.MM.yyyy") : <span>{t('form.expiryDate.placeholder')}</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
                         )} />
                    </div>
                </div>
            </div>

            <Separator />
            
            {/* Items */}
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="p-3 border rounded-md bg-secondary/30 space-y-2">
                  <div className="grid grid-cols-12 gap-x-3 gap-y-2 items-start">
                    <span className="col-span-12 md:col-span-1 text-sm font-bold text-muted-foreground pt-2 text-center">{index + 1}.</span>
                    <FormField name={`items.${index}.quantity`} render={({ field }) => (<FormItem className="col-span-3 md:col-span-1"><FormLabel>{t('form.items.quantity')}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage/></FormItem>)} />
                    <FormField name={`items.${index}.unit`} render={({ field }) => (<FormItem className="col-span-3 md:col-span-1"><FormLabel>{t('form.items.unit')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
                    <FormField name={`items.${index}.price`} render={({ field }) => (<FormItem className="col-span-6 md:col-span-2"><FormLabel>{t('form.items.price')}</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage/></FormItem>)} />
                    <FormField name={`items.${index}.discount`} render={({ field }) => (<FormItem className="col-span-4 md:col-span-2"><FormLabel>{t('form.items.discount')}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage/></FormItem>)} />
                    <FormField name={`items.${index}.taxRate`} render={({ field }) => (<FormItem className="col-span-4 md:col-span-2"><FormLabel>{t('form.items.tax')}</FormLabel>
                        <Select onValueChange={(val) => field.onChange(Number(val))} value={String(field.value)}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent><SelectItem value="19">19 %</SelectItem><SelectItem value="7">7 %</SelectItem><SelectItem value="0">0 %</SelectItem></SelectContent>
                        </Select>
                    <FormMessage/></FormItem>)} />
                     <div className="col-span-4 md:col-span-2 flex flex-col justify-end">
                       <FormLabel className="text-transparent">{t('form.items.total')}</FormLabel>
                       <p className="text-sm font-mono w-full text-right pr-2 h-10 flex items-center justify-end">{formatCurrency(items[index].quantity * items[index].price * (1 - (items[index].discount || 0) / 100))}</p>
                    </div>
                     <div className="col-span-12 md:col-span-1 flex items-end justify-end">
                       <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                   <FormField name={`items.${index}.description`} render={({ field }) => (
                         <FormItem>
                            <FormControl><Textarea placeholder={t('form.items.descriptionPlaceholder')} {...field} className="bg-background" rows={2}/></FormControl>
                            <FormMessage/>
                         </FormItem>
                     )} />
                </div>
              ))}
              <Button type="button" size="sm" variant="outline" onClick={() => append({ id: crypto.randomUUID(), description: '', quantity: 1, unit: 'Stk', price: 0, discount: 0, taxRate: 19 })}>
                <PlusCircle className="mr-2 h-4 w-4" /> {t('form.items.addItem')}
              </Button>
            </div>

            <Separator />
            
            {/* Totales */}
             <div className="flex flex-col md:flex-row gap-4">
                 <FormField name="notes" render={({ field }) => (
                    <FormItem className="flex-1"><FormLabel>{t('form.notes.label')}</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="w-full md:w-80 space-y-2 text-sm pt-5">
                    <div className="flex justify-between"><p>{t('form.totals.subtotal')}</p><p className="font-mono">{formatCurrency(subtotal)}</p></div>
                    <div className="flex justify-between"><p>+ {t('form.totals.tax')}</p><p className="font-mono">{formatCurrency(totalTax)}</p></div>
                    <Separator />
                    <div className="flex justify-between font-bold text-base"><p>{t('form.totals.total')}</p><p className="font-mono">{formatCurrency(total)}</p></div>
                </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>{t('form.actions.cancel')}</Button>
               {(!isEditMode || offerToEdit?.status === 'Borrador') && (
                <Button type="button" variant="outline" onClick={form.handleSubmit(v => handleSave(v, false))} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {t('form.actions.saveDraft')}
                </Button>
               )}
              <Button type="button" onClick={form.handleSubmit(v => handleSave(v, true))} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                {isEditMode ? t('form.actions.saveAndSend') : t('form.actions.createAndSend')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
