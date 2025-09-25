
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { CouponCard } from './coupon-card';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  count: z.coerce.number().min(1).max(1000),
  value_text: z.string().min(1, 'El valor es requerido.'),
  title: z.string().min(3, 'El título es requerido.').max(24, 'El título no puede exceder los 24 caracteres.'),
  subtitle: z.string().optional(),
  bg_image_url: z.string().url().or(z.literal('')).optional(),
  expires_at: z.string().optional(),
  terms: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function BatchCreator({ onCreated }: { onCreated?: () => void }) {
  const { t } = useTranslation('marketing');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      count: 10,
      value_text: '50 €',
      title: 'Club Travel',
      subtitle: 'Cupón aktivieren',
      bg_image_url: '',
      expires_at: '',
      terms: 'Válido para 1 uso. No combinable con otras promociones.',
    },
  });

  const watchedValues = form.watch();

  const couponPreviewData = {
      id: 'preview-id',
      code: `DI-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-XXXX`,
      month_key: format(new Date(), 'yyyyMM'),
      created_at: new Date().toISOString(),
      status: 'active' as const,
      created_by: 'preview',
      ...watchedValues
  };

  const onSubmit = async (values: FormData) => {
    setLoading(true);
    try {
      const functions = getFunctions(app, 'europe-west1');
      const createCouponBatch = httpsCallable(functions, 'createCouponBatch');
      
      const payload = {
        ...values,
        month_key: format(new Date(), 'yyyyMM'),
        expires_at: values.expires_at ? new Date(values.expires_at).toISOString() : null,
      };

      const result: any = await createCouponBatch(payload);

      if (result.data.success) {
        toast({
          title: t('coupons.batchCreator.successToast'),
          description: t('coupons.batchCreator.successDescription', { count: result.data.createdCount }),
        });
        onCreated?.();
        form.reset();
      } else {
        throw new Error(result.data.message || 'Error desconocido');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('coupons.batchCreator.errorToast'),
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('coupons.batchCreator.title')}</CardTitle>
        <CardDescription>{t('coupons.batchCreator.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField control={form.control} name="count" render={({ field }) => (
                    <FormItem><FormLabel>{t('coupons.batchCreator.count')}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="value_text" render={({ field }) => (
                    <FormItem className="lg:col-span-2"><FormLabel>{t('coupons.batchCreator.value')}</FormLabel><FormControl><Input placeholder={t('coupons.batchCreator.valuePlaceholder')} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                </div>
                <Separator />
                <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>{t('coupons.batchCreator.titleLabel')}</FormLabel><FormControl><Input placeholder={t('coupons.batchCreator.titlePlaceholder')} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="subtitle" render={({ field }) => (
                    <FormItem><FormLabel>{t('coupons.batchCreator.subtitle')}</FormLabel><FormControl><Input placeholder={t('coupons.batchCreator.subtitlePlaceholder')} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="expires_at" render={({ field }) => (
                    <FormItem><FormLabel>{t('coupons.batchCreator.expires')}</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Separator />
                <FormField control={form.control} name="bg_image_url" render={({ field }) => (
                    <FormItem><FormLabel>{t('coupons.batchCreator.backgroundImage')}</FormLabel><FormControl><Input placeholder={t('coupons.batchCreator.backgroundImagePlaceholder')} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="terms" render={({ field }) => (
                <FormItem><FormLabel>{t('coupons.batchCreator.terms')}</FormLabel><FormControl><Textarea placeholder={t('coupons.batchCreator.termsPlaceholder')} rows={2} {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading ? t('coupons.batchCreator.creatingButton') : t('coupons.batchCreator.createButton', { count: form.getValues('count') })}
                </Button>
            </form>
            </Form>
             <div className="flex flex-col items-center justify-center space-y-4">
                <p className="font-semibold text-muted-foreground">Vista Previa en Vivo</p>
                <div className="w-full max-w-md">
                    <CouponCard coupon={couponPreviewData} />
                </div>
             </div>
        </div>
      </CardContent>
    </Card>
  );
}
