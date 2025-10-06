'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { MarketingCampaignInput, MarketingCampaignInputSchema, MarketingCampaignOutput, generateMarketingCampaign } from '@/ai/flows/generate-marketing-campaign';
import { Separator } from '@/components/ui/separator';

interface AiCampaignGeneratorProps {
  children: React.ReactNode;
  customerName: string;
}

export function AiCampaignGenerator({ children, customerName }: AiCampaignGeneratorProps) {
  const { t } = useTranslation('marketing');
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [campaignResult, setCampaignResult] = useState<MarketingCampaignOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<MarketingCampaignInput>({
    resolver: zodResolver(MarketingCampaignInputSchema),
    defaultValues: {
      customerName: customerName,
      businessType: '',
      mainGoal: '',
      targetAudience: '',
      keyProducts: '',
      tone: 'Profesional',
    },
  });

  const onSubmit = async (values: MarketingCampaignInput) => {
    setIsGenerating(true);
    setCampaignResult(null);
    toast({ title: t('campaigns.aiGenerator.toast.generatingTitle'), description: t('campaigns.aiGenerator.toast.generatingDescription') });
    try {
      const result = await generateMarketingCampaign(values);
      setCampaignResult(result);
    } catch (error: any) {
      toast({ variant: 'destructive', title: t('campaigns.aiGenerator.toast.errorTitle'), description: error.message });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('campaigns.aiGenerator.title', { customerName })}</DialogTitle>
          <DialogDescription>{t('campaigns.aiGenerator.description')}</DialogDescription>
        </DialogHeader>
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
            {/* Columna del Formulario */}
            <div className="flex flex-col space-y-4 overflow-y-auto pr-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField name="businessType" control={form.control} render={({ field }) => (<FormItem><FormLabel>{t('campaigns.aiGenerator.form.businessType.label')}</FormLabel><FormControl><Input {...field} placeholder={t('campaigns.aiGenerator.form.businessType.placeholder')} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField name="mainGoal" control={form.control} render={({ field }) => (<FormItem><FormLabel>{t('campaigns.aiGenerator.form.mainGoal.label')}</FormLabel><FormControl><Input {...field} placeholder={t('campaigns.aiGenerator.form.mainGoal.placeholder')} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField name="targetAudience" control={form.control} render={({ field }) => (<FormItem><FormLabel>{t('campaigns.aiGenerator.form.targetAudience.label')}</FormLabel><FormControl><Textarea {...field} placeholder={t('campaigns.aiGenerator.form.targetAudience.placeholder')} rows={3} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField name="keyProducts" control={form.control} render={({ field }) => (<FormItem><FormLabel>{t('campaigns.aiGenerator.form.keyProducts.label')}</FormLabel><FormControl><Textarea {...field} placeholder={t('campaigns.aiGenerator.form.keyProducts.placeholder')} rows={2}/></FormControl><FormMessage /></FormItem>)} />
                        <FormField name="tone" control={form.control} render={({ field }) => (<FormItem><FormLabel>{t('campaigns.aiGenerator.form.tone.label')}</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Profesional">{t('campaigns.aiGenerator.form.tone.professional')}</SelectItem><SelectItem value="Divertido">{t('campaigns.aiGenerator.form.tone.fun')}</SelectItem><SelectItem value="Urgente">{t('campaigns.aiGenerator.form.tone.urgent')}</SelectItem><SelectItem value="Inspirador">{t('campaigns.aiGenerator.form.tone.inspirational')}</SelectItem><SelectItem value="Exclusivo">{t('campaigns.aiGenerator.form.tone.exclusive')}</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                        <Button type="submit" disabled={isGenerating} className="w-full">
                            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4" />}
                            {isGenerating ? t('campaigns.aiGenerator.generatingButton') : t('campaigns.aiGenerator.generateButton')}
                        </Button>
                    </form>
                </Form>
            </div>
             {/* Columna de Resultados */}
            <div className="bg-muted/50 rounded-lg p-4 overflow-y-auto">
                {isGenerating && (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <Wand2 className="h-12 w-12 mb-4 animate-pulse text-primary"/>
                        <p className="font-semibold">{t('campaigns.aiGenerator.generating')}</p>
                        <p className="text-sm text-center">{t('campaigns.aiGenerator.wait')}</p>
                    </div>
                )}
                {campaignResult && (
                    <div className="space-y-4 animate-in fade-in-50">
                        <div>
                            <h3 className="text-xl font-bold text-primary">{campaignResult.campaignTitle}</h3>
                            <p className="font-semibold text-muted-foreground">{campaignResult.campaignSubtitle}</p>
                        </div>
                        <Separator />
                        <p className="text-sm">{campaignResult.summary}</p>
                        <Separator />
                        <h4 className="font-bold">{t('campaigns.aiGenerator.keyActions')}</h4>
                        <ul className="space-y-3 list-disc list-inside">
                            {campaignResult.keyActions.map((action, i) => (
                                <li key={i}>
                                    <strong className="font-semibold">{action.action}:</strong>
                                    <p className="text-sm text-muted-foreground pl-4">{action.description}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                 {!isGenerating && !campaignResult && (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                         <p className="text-sm text-center">{t('campaigns.aiGenerator.prompt')}</p>
                    </div>
                 )}
            </div>
        </div>
        <DialogFooter>
            <DialogClose asChild><Button variant="outline">{t('campaigns.aiGenerator.closeButton')}</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
