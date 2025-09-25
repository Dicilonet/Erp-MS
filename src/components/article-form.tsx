
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import type { Article } from '@/lib/types';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  type: z.enum(['product', 'service'], { required_error: 'Debes seleccionar un tipo.' }),
  articleNumber: z.string().min(1, 'El número de artículo es requerido.'),
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  unit: z.string().min(1, 'La unidad es requerida.'),
  description: z.string().optional(),
  priceNet: z.coerce.number().min(0, 'El precio no puede ser negativo.'),
  taxRate: z.coerce.number().min(0, 'El impuesto no puede ser negativo.'),
});

type FormData = z.infer<typeof formSchema>;

interface ArticleFormProps {
  children: React.ReactNode;
  articleToEdit?: Article;
  onArticleCreated: (newArticle: Article) => void;
  onArticleUpdated: (updatedArticle: Article) => void;
}

export function ArticleForm({ children, articleToEdit, onArticleCreated, onArticleUpdated }: ArticleFormProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation('common');
  const isEditMode = !!articleToEdit;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });
  
  useEffect(() => {
    if (open) {
      form.reset(
        isEditMode && articleToEdit ? {
          type: articleToEdit.type,
          articleNumber: articleToEdit.articleNumber,
          name: articleToEdit.name,
          unit: articleToEdit.unit,
          description: articleToEdit.description || '',
          priceNet: articleToEdit.priceNet,
          taxRate: articleToEdit.taxRate,
        } : {
          type: 'service',
          articleNumber: '',
          name: '',
          unit: '',
          description: '',
          priceNet: 0,
          taxRate: 19,
        }
      );
    }
  }, [open, isEditMode, articleToEdit, form]);

  const priceNet = form.watch('priceNet');
  const taxRate = form.watch('taxRate');
  const priceGross = priceNet * (1 + taxRate / 100);
  
  const formatCurrency = (amount: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    try {
      const functions = getFunctions(app, 'europe-west1');
      const payload = {
          ...values,
          priceGross: priceNet * (1 + values.taxRate / 100),
      };
      
      if (isEditMode && articleToEdit) {
        const updateArticle = httpsCallable(functions, 'updateArticle');
        const result: any = await updateArticle({ articleId: articleToEdit.articleId, data: payload });
         if (result.data.success) {
            toast({ title: t('articles.toast.updated.title'), description: t('articles.toast.updated.description', { name: values.name }) });
            onArticleUpdated(result.data.article);
        } else {
            throw new Error(result.data.message || t('articles.toast.error.description'));
        }
      } else {
        const createArticle = httpsCallable(functions, 'createArticle');
        const result: any = await createArticle(payload);
        if (result.data.success) {
          toast({ title: t('articles.toast.created.title'), description: t('articles.toast.created.description', { name: values.name }) });
          onArticleCreated(result.data.article);
        } else {
          throw new Error(result.data.message || t('articles.toast.error.description'));
        }
      }

      setOpen(false);

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('articles.toast.error.title'),
        description: error.message || t('articles.toast.error.description'),
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? t('articles.form.editTitle') : t('articles.form.createTitle')}</DialogTitle>
          <DialogDescription>{isEditMode ? t('articles.form.editDescription') : t('articles.form.createDescription')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField name="type" render={({ field }) => (
                    <FormItem><FormLabel>{t('articles.form.type')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="service">{t('articles.form.service')}</SelectItem>
                            <SelectItem value="product">{t('articles.form.product')}</SelectItem>
                        </SelectContent>
                    </Select><FormMessage /></FormItem>
                )} />
                <FormField name="articleNumber" render={({ field }) => (
                    <FormItem><FormLabel>{t('articles.form.articleNumber')}</FormLabel><FormControl><Input placeholder={t('articles.form.articleNumberPlaceholder')} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
            
            <FormField name="name" render={({ field }) => (
                <FormItem><FormLabel>{t('articles.form.name')}</FormLabel><FormControl><Input placeholder={t('articles.form.namePlaceholder')} {...field} /></FormControl><FormMessage /></FormItem>
            )} />

             <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                 <FormField name="priceNet" render={({ field }) => (
                    <FormItem className="sm:col-span-2"><FormLabel>{t('articles.form.priceNet')}</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField name="unit" render={({ field }) => (
                    <FormItem><FormLabel>{t('articles.form.unit')}</FormLabel><FormControl><Input placeholder={t('articles.form.unitPlaceholder')} {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
                 <FormField name="taxRate" render={({ field }) => (
                    <FormItem><FormLabel>{t('articles.form.tax')} (%)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
             <div className="flex justify-end">
                <div className="w-full max-w-xs space-y-1">
                    <Label>{t('articles.form.priceGross')}</Label>
                    <Input value={formatCurrency(priceGross)} readOnly className="font-bold bg-secondary" />
                </div>
            </div>

            <FormField name="description" render={({ field }) => (
                <FormItem><FormLabel>{t('articles.form.description')}</FormLabel><FormControl><Textarea placeholder={t('articles.form.descriptionPlaceholder')} {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>{t('articles.form.cancel')}</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? (isEditMode ? t('articles.form.saving') : t('articles.form.creating')) : (isEditMode ? t('articles.form.saveChanges') : t('articles.form.save'))}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
