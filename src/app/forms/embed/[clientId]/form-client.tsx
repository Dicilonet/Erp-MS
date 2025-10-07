
'use client';

import React, { useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const recipientSchema = z.object({
  name: z.string().min(1, 'required'),
  email: z.string().email('invalid_email').optional().or(z.literal('')),
  whatsapp: z.string().optional(),
}).refine(data => !!data.email || !!data.whatsapp, {
  message: 'email_or_whatsapp_required',
  path: ['email'],
});

const recommendationFormSchema = z.object({
  recommenderName: z.string().min(1, 'required'),
  recommenderEmail: z.string().email('invalid_email'),
  promoCode: z.string().optional(),
  newsletter: z.enum(['yes', 'no']),
  recommendationMessage: z.string().optional(),
  source: z.string().min(1, 'required'),
  wantsToRecommend: z.enum(['yes', 'no']),
  recipients: z.array(recipientSchema).optional(),
  productRecommendation: z.string().optional(),
  membership: z.enum(['yes', 'no']),
  confirmIndependent: z.boolean().refine(val => val === true, 'required'),
  consentPrivacy: z.boolean().refine(val => val === true, 'required'),
});

type RecommendationFormData = z.infer<typeof recommendationFormSchema>;

interface RecommendationFormForClientProps {
  clientId: string;
  products: { name: string; id?: string }[];
}

const RecommendationFormForClient = ({ clientId, products }: RecommendationFormForClientProps) => {
    const { t } = useTranslation(['forms', 'legal']);
    const { toast } = useToast();

    const { register, control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RecommendationFormData>({
        resolver: zodResolver(recommendationFormSchema),
        defaultValues: {
            newsletter: 'yes',
            wantsToRecommend: 'no',
            recipients: [{ name: '', email: '', whatsapp: '' }],
            confirmIndependent: false,
            consentPrivacy: false,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'recipients',
    });

    const wantsToRecommend = watch('wantsToRecommend');
    
    const onSubmit = (data: RecommendationFormData) => {
        console.log({ clientId, ...data });
        toast({
            title: t('submit'),
            description: "Formulario enviado (simulación). Revisa la consola para ver los datos."
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="text-2xl font-bold text-center">{t("title")}</h2>
            
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="recommenderName">{t("name")}</Label>
                    <Input id="recommenderName" {...register('recommenderName')} placeholder={t("name") as string} />
                     {errors.recommenderName && <p className="text-sm text-destructive">{t(errors.recommenderName.message as any)}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="recommenderEmail">{t("email")}</Label>
                    <Input id="recommenderEmail" type="email" {...register('recommenderEmail')} placeholder={t("email") as string} />
                    {errors.recommenderEmail && <p className="text-sm text-destructive">{t(errors.recommenderEmail.message as any)}</p>}
                </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="promoCode">{t("promoCode")}</Label>
                    <Input id="promoCode" {...register('promoCode')} placeholder={t("promoCode") as string} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="newsletterSelect">{t("newsletter.label")}</Label>
                    <Controller
                        name="newsletter"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger id="newsletterSelect">
                                    <SelectValue placeholder={t("newsletter.label")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="yes">{t("newsletter.yes")}</SelectItem>
                                    <SelectItem value="no">{t("newsletter.no")}</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="recommendationMessage">{t("recommendation.label")}</Label>
                <Textarea id="recommendationMessage" {...register('recommendationMessage')} placeholder={t("recommendation.labelPlaceholder") as string} rows={3} />
            </div>
            
            <div className="text-sm text-gray-600 bg-gray-100 rounded p-3">{t('infoText')}</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="source">{t("source.label")}</Label>
                    <Controller
                        name="source"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger id="source">
                                    <SelectValue placeholder={t("source.label")} />
                                </SelectTrigger>
                                <SelectContent>
                                    {['customer', 'facebook', 'instagram', 'telegram', 'youtube', 'twitter', 'linkedin', 'tiktok', 'recommendation', 'googleads', 'dicilo', 'mhc', 'other'].map(opt => (
                                        <SelectItem key={opt} value={opt}>{t(`source.${opt}`)}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                     />
                     {errors.source && <p className="text-sm text-destructive">{t(errors.source.message as any)}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="refer-select">{t("refer.label")}</Label>
                     <Controller
                        name="wantsToRecommend"
                        control={control}
                        render={({ field }) => (
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger id="refer-select">
                                    <SelectValue placeholder={t("refer.label")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="yes">{t("refer.yes")}</SelectItem>
                                    <SelectItem value="no">{t("refer.no")}</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            </div>

            {wantsToRecommend === 'yes' && (
                <div className="space-y-4 border-t pt-4 animate-in fade-in-50 duration-300">
                     <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                        <h4 className="font-bold mb-2">{t('inviteInfoTitle')}</h4>
                        <p>{t('communityText')}</p>
                    </div>

                    {fields.map((field, index) => (
                        <div key={field.id} className="flex items-end gap-2 border p-3 rounded-lg bg-secondary/50 relative">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-grow">
                                <div className="space-y-1">
                                    <Label htmlFor={`recipientName-${index}`}>{t("recipient.name")}</Label>
                                    <Input id={`recipientName-${index}`} {...register(`recipients.${index}.name`)} placeholder={t("recipient.name") as string} />
                                </div>
                                <div className="grid gap-2">
                                     <div className="space-y-1">
                                        <Label htmlFor={`recipientEmail-${index}`}>{t("recipient.email")}</Label>
                                        <Input id={`recipientEmail-${index}`} {...register(`recipients.${index}.email`)} type="email" placeholder={t("recipient.email") as string} />
                                    </div>
                                     <div className="space-y-1">
                                        <Label htmlFor={`recipientWhatsapp-${index}`}>{t("recipient.whatsapp")}</Label>
                                        <Input id={`recipientWhatsapp-${index}`} {...register(`recipients.${index}.whatsapp`)} placeholder={t("recipient.whatsapp") as string} />
                                    </div>
                                </div>
                            </div>
                            {fields.length > 1 && (
                                <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1" onClick={() => remove(index)}>
                                    <Trash2 className="h-4 w-4 text-destructive"/>
                                </Button>
                            )}
                             {errors.recipients?.[index] && <p className="text-sm text-destructive mt-2">{t(errors.recipients?.[index]?.root?.message as any || errors.recipients?.[index]?.name?.message as any || errors.recipients?.[index]?.email?.message as any)}</p>}
                        </div>
                    ))}

                    <Button type="button" variant="outline" onClick={() => append({ name: '', email: '', whatsapp: '' })}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {t("recipient.add")}
                    </Button>
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="product-recommendation">{t("productRecommendation.label")}</Label>
                 <Controller
                    name="productRecommendation"
                    control={control}
                    render={({ field }) => (
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger id="product-recommendation">
                                <SelectValue placeholder={t("productRecommendation.placeholder")} />
                            </SelectTrigger>
                            <SelectContent>
                                {products.length > 0 ? (
                                    products.map((product, index) => (
                                        <SelectItem key={product.id || index} value={product.name}>{product.name}</SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="no-products" disabled>No hay productos disponibles</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    )}
                 />
            </div>
            
            <div className="space-y-2 pt-4">
                 <Label>{t("membership.label")}</Label>
                <Controller
                    name="membership"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup onValueChange={field.onChange} className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="member-yes" />
                                <Label htmlFor="member-yes">{t("membership.yes")}</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="member-no" />
                                <Label htmlFor="member-no">{t("membership.no")}</Label>
                            </div>
                        </RadioGroup>
                    )}
                />
                 {errors.membership && <p className="text-sm text-destructive">{t(errors.membership.message as any)}</p>}
            </div>
             
             <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold">{t('privacyTitle')}</h3>
                 <Controller
                    name="confirmIndependent"
                    control={control}
                    render={({ field }) => (
                        <div className="flex items-start space-x-2">
                            <Checkbox id="confirmIndependent" checked={field.value} onCheckedChange={field.onChange} />
                            <Label htmlFor="confirmIndependent" className={cn("text-xs text-muted-foreground", errors.confirmIndependent && "text-destructive")}>{t('no_mass_email_form', { ns: 'legal'})}</Label>
                        </div>
                    )}
                />
                {errors.confirmIndependent && <p className="text-sm text-destructive">{t(errors.confirmIndependent.message as any)}</p>}

                 <Controller
                    name="consentPrivacy"
                    control={control}
                    render={({ field }) => (
                         <div className="flex items-start space-x-2">
                            <Checkbox id="consentPrivacy" checked={field.value} onCheckedChange={field.onChange} />
                            <Label htmlFor="consentPrivacy" className={cn("text-xs text-muted-foreground", errors.consentPrivacy && "text-destructive")}>{t('privacy', { ns: 'legal'})}</Label>
                        </div>
                    )}
                />
                {errors.consentPrivacy && <p className="text-sm text-destructive">{t(errors.consentPrivacy.message as any)}</p>}
            </div>

            <div className="bg-gray-100 text-gray-500 p-3 rounded text-center text-sm">{t('captcha.placeholder')}</div>
            
            <div className="flex flex-col gap-4">
                <Button type="submit" className="w-full text-lg font-bold py-6" disabled={isSubmitting}>
                     {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t("submit")}
                </Button>
                <Button asChild variant="outline" className="w-full">
                    <Link href="/registrieren">{t("registrieren", { ns: 'common' })}</Link>
                </Button>
            </div>
        </form>
    );
};

export default RecommendationFormForClient;
