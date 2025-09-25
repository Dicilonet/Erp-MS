
'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { format } from 'date-fns';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { CouponCard } from './coupon-card';
import { Separator } from '@/components/ui/separator';
import { ImageSourceSelector } from '../designer/image-source-selector';
import type { Coupon } from '@/lib/types';
import { DesignerExport } from '../designer/designer-export';
import { useAuth } from '@/components/auth-provider';


const formSchema = z.object({
  recipientName: z.string().min(3, 'El nombre del destinatario es requerido.'),
  senderName: z.string().min(3, 'Tu nombre es requerido.'),
  value_text: z.string().min(1, 'El valor es requerido.'),
  title: z.string().min(3, 'El título es requerido.').max(24, 'El título no puede exceder los 24 caracteres.'),
  bg_image_url: z.string().url().or(z.literal('')).optional(),
  expires_at: z.string().optional(),
  terms: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function IndividualCouponCreator() {
  const { t } = useTranslation('marketing');
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [createdCoupon, setCreatedCoupon] = useState<Coupon | null>(null);
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientName: '',
      senderName: user?.displayName || '',
      value_text: 'Descuento Especial',
      title: 'Invitación Personal',
      bg_image_url: '',
      expires_at: '',
      terms: 'Válido para un solo uso. Personal e intransferible.',
    },
  });

  const watchedValues = form.watch();

  const couponPreviewData: Coupon = {
      id: 'preview-id',
      code: `IND-${format(new Date(), 'yyyyMMdd')}-XXXX`,
      month_key: format(new Date(), 'yyyyMM'),
      created_at: new Date().toISOString(),
      status: 'active' as const,
      created_by: watchedValues.senderName,
      title: watchedValues.title,
      recipientName: watchedValues.recipientName || '',
      senderName: watchedValues.senderName || '',
      isIndividual: true,
      value_text: watchedValues.value_text,
      bg_image_url: watchedValues.bg_image_url,
      terms: watchedValues.terms,
      expires_at: watchedValues.expires_at,
      subtitle: '', // Eliminado para consistencia
  };

  const onSubmit = async (values: FormData) => {
    setLoading(true);
    setCreatedCoupon(null);
    try {
      const functions = getFunctions(app, 'europe-west1');
      const createSingleCoupon = httpsCallable(functions, 'createSingleCoupon');
      
      const payload = {
        ...values,
        expires_at: values.expires_at ? new Date(values.expires_at).toISOString() : null,
      };

      const result: any = await createSingleCoupon(payload);

      if (result.data.success) {
        setCreatedCoupon(result.data.coupon);
        toast({
          title: t('coupons.individual.successToast.title'),
          description: t('coupons.individual.successToast.description', { code: result.data.coupon.code }),
        });
      } else {
        throw new Error(result.data.message || 'Error desconocido');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('coupons.individual.errorToast.title'),
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
      form.reset();
      setCreatedCoupon(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('coupons.individual.title')}</CardTitle>
        <CardDescription>{t('coupons.individual.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="recipientName" render={({ field }) => (
                            <FormItem><FormLabel>{t('coupons.individual.recipient')}</FormLabel><FormControl><Input placeholder={t('coupons.individual.recipientPlaceholder')} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="senderName" render={({ field }) => (
                            <FormItem><FormLabel>{t('coupons.individual.sender')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    <FormField control={form.control} name="value_text" render={({ field }) => (
                        <FormItem><FormLabel>{t('coupons.batchCreator.value')}</FormLabel><FormControl><Input placeholder={t('coupons.batchCreator.valuePlaceholder')} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <Separator />
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem><FormLabel>{t('coupons.batchCreator.titleLabel')}</FormLabel><FormControl><Input placeholder={t('coupons.batchCreator.titlePlaceholder')} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <ImageSourceSelector label={t('coupons.individual.imageLabel')} onImageSelect={(image) => form.setValue('bg_image_url', image)} t={t} i18n={i18next}/>
                    <FormField control={form.control} name="terms" render={({ field }) => (
                      <FormItem><FormLabel>{t('coupons.batchCreator.terms')}</FormLabel><FormControl><Textarea placeholder={t('coupons.batchCreator.termsPlaceholder')} rows={4} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="expires_at" render={({ field }) => (
                        <FormItem><FormLabel>{t('coupons.batchCreator.expires')}</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="flex gap-2">
                        <Button type="submit" disabled={loading || !!createdCoupon}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {loading ? t('coupons.individual.creatingButton') : t('coupons.individual.createButton')}
                        </Button>
                        {createdCoupon && (
                            <Button type="button" variant="outline" onClick={handleReset}>
                                {t('coupons.individual.newButton')}
                            </Button>
                        )}
                    </div>
                </form>
              </Form>
            </div>
             <div className="flex flex-col items-center justify-center space-y-4">
                <p className="font-semibold text-muted-foreground">{t('coupons.individual.preview')}</p>
                <div className="w-full max-w-md">
                    <div ref={previewRef}>
                        <CouponCard coupon={createdCoupon || couponPreviewData} compactValue={true} />
                    </div>
                </div>
                {createdCoupon && (
                    <div className="w-full max-w-md">
                        <DesignerExport previewRef={previewRef} isPublishing={false} onPublish={() => {}} t={t} />
                    </div>
                )}
             </div>
        </div>
      </CardContent>
    </Card>
  );
}
