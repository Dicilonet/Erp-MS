
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Bot, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';

import { suggestInteractionSummary } from '@/lib/server-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  interactionText: z.string().min(20, {
    message: 'El texto de la interacción debe tener al menos 20 caracteres.',
  }),
});

export function AiSummary() {
  const { t } = useTranslation('dashboard');
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interactionText: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSummary('');
    try {
      const result = await suggestInteractionSummary({
        interactionText: values.interactionText,
      });
      setSummary(result.summary);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: t('aiSummary.toast.errorTitle'),
        description: t('aiSummary.toast.errorDescription'),
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{t('aiSummary.title')}</CardTitle>
            <CardDescription>{t('aiSummary.description')}</CardDescription>
          </div>
          <Bot className="h-6 w-6 text-accent" />
        </div>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="interactionText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('aiSummary.interactionTextLabel')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('aiSummary.interactionTextPlaceholder')}
                      className="resize-none"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {summary && (
               <div className="space-y-2">
                <FormLabel>{t('aiSummary.suggestedSummaryLabel')}</FormLabel>
                <div className="relative">
                    <Textarea readOnly value={summary} rows={4} className="bg-secondary pr-12"/>
                </div>
               </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? t('aiSummary.generatingButton') : t('aiSummary.generateButton')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
