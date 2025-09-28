'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { db, app } from '@/lib/firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { collection, query, onSnapshot } from 'firebase/firestore';
import type { Customer, Article } from '@/lib/types';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const metricItemSchema = z.object({
  articleId: z.string(),
  articleName: z.string(),
  rating: z.number().min(0).max(10).default(5),
});

const formSchema = z.object({
  metrics: z.array(metricItemSchema),
});

type FormData = z.infer<typeof formSchema>;

interface MetricsFormProps {
  customer: Customer;
}

export function MetricsForm({ customer }: MetricsFormProps) {
  const { t } = useTranslation('customers');
  const { toast } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      metrics: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: 'metrics',
  });

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'articles'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const articlesData = snapshot.docs.map(doc => ({ ...doc.data(), articleId: doc.id })) as Article[];
      setArticles(articlesData);
      
      const metricsData = articlesData.map(article => ({
          articleId: article.articleId,
          articleName: article.name,
          rating: 5,
      }));
      replace(metricsData); // Usamos replace para actualizar todo el array de campos
      setLoading(false);
    });
    return () => unsubscribe();
  }, [customer, replace]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
        const functions = getFunctions(app, 'europe-west1');
        const saveCustomerMetrics = httpsCallable(functions, 'saveCustomerMetrics');

        await saveCustomerMetrics({
            customerId: customer.customerId,
            metrics: data.metrics,
        });

        toast({
            title: t('metrics.form.toast.successTitle'),
            description: t('metrics.form.toast.successDescription', { customerName: customer.name }),
        });

    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: t('metrics.form.toast.errorTitle'),
            description: error.message,
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('metrics.form.title', { customerName: customer.name })}</CardTitle>
        <CardDescription>{t('metrics.form.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {fields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`metrics.${index}.rating`}
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">{articles[index]?.name}</FormLabel>
                      <div className="flex items-center gap-4">
                        <FormControl>
                           <Slider
                            min={0}
                            max={10}
                            step={1}
                            value={[value]}
                            onValueChange={(vals) => onChange(vals[0])}
                            className="flex-1"
                          />
                        </FormControl>
                         <span className="font-bold text-lg text-primary w-10 text-center">{value}</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <CardFooter className="px-0 pt-6">
                 <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {isSubmitting ? t('metrics.form.savingButton') : t('metrics.form.saveButton')}
                </Button>
              </CardFooter>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
