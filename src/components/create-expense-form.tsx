'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { addDoc, collection, onSnapshot, query } from 'firebase/firestore';
import { CalendarIcon, Loader2, Upload, Camera } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';

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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { db, storage } from '@/lib/firebase';
import type { Customer, Expense } from '@/lib/types';
import { cn } from '@/lib/utils';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import Image from 'next/image';
import { processReceipt } from '@/app/actions';


const formSchema = z.object({
  associateWithCustomer: z.boolean().default(true),
  customerId: z.string().optional(),
  description: z.string().min(5, { message: 'La descripción debe tener al menos 5 caracteres.' }),
  subtotal: z.coerce.number().positive({ message: 'El subtotal debe ser un número positivo.' }),
  taxRate: z.coerce.number().min(0, { message: 'La tasa de IVA no puede ser negativa.' }),
  category: z.string().min(3, { message: 'La categoría es requerida.' }),
  date: z.date({ required_error: 'Se requiere una fecha.' }),
  receiptUrl: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.associateWithCustomer && !data.customerId) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Debes seleccionar un cliente.',
            path: ['customerId'],
        });
    }
});

type FormData = z.infer<typeof formSchema>;

export function CreateExpenseForm({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const { toast } = useToast();
  const { t } = useTranslation('expenses');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);


  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      associateWithCustomer: true,
      customerId: '',
      description: '',
      subtotal: 0,
      taxRate: 21,
      category: 'Software',
      date: new Date(),
    },
  });
  
  const associateWithCustomer = form.watch('associateWithCustomer');
  const subtotalValue = form.watch('subtotal');
  const taxRateValue = form.watch('taxRate');
  
  const subtotal = parseFloat(String(subtotalValue)) || 0;
  const taxRate = parseFloat(String(taxRateValue)) || 0;

  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  useEffect(() => {
    if (open) {
        const q = query(collection(db, "customers"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const customersData = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                customerId: doc.id,
            })) as Customer[];
            setCustomers(customersData);
        });
        return () => unsubscribe();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
        setReceiptImage(null);
        form.reset();
    }
  }, [open, form]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
        handleImageProcessing(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageProcessing = async (imageDataUrl: string) => {
    setIsProcessing(true);
    toast({ title: t('form.processingToast.title'), description: t('form.processingToast.description') });
    try {
        const result = await processReceipt({ receiptImage: imageDataUrl });
        form.setValue('description', result.description);
        form.setValue('subtotal', result.subtotal);
        form.setValue('taxRate', (result.tax / result.subtotal) * 100 || 0);
        form.setValue('category', result.category);
        form.setValue('date', new Date(result.date));
         toast({ title: t('form.successToast.title'), description: t('form.successToast.description') });
    } catch (error) {
        console.error("Error processing receipt:", error);
        toast({ variant: 'destructive', title: t('form.errorToast.title'), description: t('form.errorToast.description') });
    } finally {
        setIsProcessing(false);
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    let uploadedReceiptUrl = '';
    
    try {
        // 1. Upload image to Firebase Storage if it exists
        if (receiptImage) {
            const storageRef = ref(storage, `receipts/${uuidv4()}`);
            const uploadResult = await uploadString(storageRef, receiptImage, 'data_url');
            uploadedReceiptUrl = await getDownloadURL(uploadResult.ref);
        }

      const finalTaxRate = parseFloat(String(values.taxRate)) / 100;
      const finalSubtotal = parseFloat(String(values.subtotal));
      const finalTax = finalSubtotal * finalTaxRate;
      const finalTotal = finalSubtotal + finalTax;

      const expenseData: Omit<Expense, 'expenseId'> = {
        description: values.description,
        subtotal: finalSubtotal,
        taxRate: finalTaxRate,
        tax: finalTax,
        total: finalTotal,
        category: values.category,
        date: values.date.toISOString(),
        recordedBy: 'admin-user-id', // Placeholder, replace with auth user
        receiptUrl: uploadedReceiptUrl,
      };

      if (values.associateWithCustomer && values.customerId) {
        const selectedCustomer = customers.find(c => c.customerId === values.customerId);
        expenseData.customerId = values.customerId;
        expenseData.customerName = selectedCustomer?.name || 'Desconocido';
      }

      await addDoc(collection(db, 'expenses'), expenseData);

      toast({
        title: t('form.saveSuccessToast.title'),
        description: t('form.saveSuccessToast.description', { total: formatCurrency(expenseData.total) }),
      });
      
      setOpen(false);
      form.reset();
      setReceiptImage(null);

    } catch (error) {
      console.error('Error creating expense:', error);
      toast({
        variant: 'destructive',
        title: t('form.saveErrorToast.title'),
        description: t('form.saveErrorToast.description'),
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
      <DialogContent className="sm:max-w-2xl">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <DialogHeader>
                <DialogTitle>{t('form.createTitle')}</DialogTitle>
                <DialogDescription>{t('form.createDescription')}</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 py-4">
                    {/* Columna Izquierda */}
                    <div className="space-y-4">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <Button type="button" onClick={() => fileInputRef.current?.click()} className="w-full" variant="outline" disabled={isProcessing}>
                            <Upload className="mr-2 h-4 w-4" /> {t('form.uploadButton')}
                        </Button>
                        <Button type="button" className="w-full" variant="outline" disabled>
                            <Camera className="mr-2 h-4 w-4" /> {t('form.cameraButton')}
                        </Button>

                        {receiptImage && (
                            <div className="relative border rounded-md p-2">
                                <Image src={receiptImage} alt="Vista previa de la factura" width={400} height={400} className="rounded-md object-contain max-h-64 w-full"/>
                                {isProcessing && (
                                    <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        <p className="mt-2 text-sm font-semibold">{t('form.processing')}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Columna Derecha */}
                    <div className="space-y-4">
                        <FormField
                        control={form.control}
                        name="associateWithCustomer"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>{t('form.associateCustomer')}</FormLabel>
                            </div>
                            <FormControl>
                                <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            </FormItem>
                        )}
                        />

                        {associateWithCustomer && (
                            <FormField
                                control={form.control}
                                name="customerId"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>{t('form.customerLabel')}</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('form.customerPlaceholder')} />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        {customers.map(customer => (
                                            <SelectItem key={customer.customerId} value={customer.customerId}>{customer.name}</SelectItem>
                                        ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                        )}
                        
                        <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t('form.descriptionLabel')}</FormLabel>
                            <FormControl>
                                <Textarea placeholder={t('form.descriptionPlaceholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="subtotal"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('form.subtotalLabel')}</FormLabel>
                                <FormControl>
                                <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                            <FormField
                            control={form.control}
                            name="taxRate"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('form.taxRateLabel')}</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" placeholder="21" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        </div>
                        
                        <div className="space-y-1 rounded-md bg-secondary p-3 text-right text-sm">
                            <p>{t('list.table.subtotal')}: <span className="font-mono">{formatCurrency(subtotal)}</span></p>
                            <p>{t('list.table.tax')} ({(taxRate || 0).toFixed(2)}%): <span className="font-mono">{formatCurrency(tax)}</span></p>
                            <p className="font-bold text-base">{t('form.totalLabel')}: <span className="font-mono">{formatCurrency(total)}</span></p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('form.categoryLabel')}</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('form.categoryPlaceholder')} />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Software">{t('form.categories.software')}</SelectItem>
                                        <SelectItem value="Marketing">{t('form.categories.marketing')}</SelectItem>
                                        <SelectItem value="Hardware">{t('form.categories.hardware')}</SelectItem>
                                        <SelectItem value="Oficina">{t('form.categories.office')}</SelectItem>
                                        <SelectItem value="Consultoría">{t('form.categories.consulting')}</SelectItem>
                                        <SelectItem value="Transporte">{t('form.categories.transport')}</SelectItem>
                                        <SelectItem value="Comida">{t('form.categories.food')}</SelectItem>
                                        <SelectItem value="Otros">{t('form.categories.other')}</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <FormLabel>{t('form.dateLabel')}</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>{t('form.datePlaceholder')}</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter className="pt-4">
                    <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                    {t('form.cancel')}
                    </Button>
                    <Button type="submit" disabled={isLoading || isProcessing}>
                        {(isLoading || isProcessing) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? t('form.submitting') : (isProcessing ? t('form.processing') : t('form.submit'))}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
