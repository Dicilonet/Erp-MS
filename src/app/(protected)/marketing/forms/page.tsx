
'use client';

import React, { useState, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/components/auth-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { BarChart2, Users, Send, FileText, Settings, PlusCircle, Trash2, Loader2, LayoutDashboard, CheckCircle, Clock, XCircle, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// --- Zod Schemas ---
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

// --- Skeletons ---
const FormsDashboardSkeleton = () => (
    <div className="p-8">
        <Skeleton className="h-8 w-1/3 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
            <div className="md:col-span-2">
                <Skeleton className="h-96 w-full" />
            </div>
        </div>
    </div>
);

// --- Form Component ---
const RecommendationForm = () => {
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

    const { fields, append, remove } = useFieldArray({ control, name: 'recipients' });
    const wantsToRecommend = watch('wantsToRecommend');
    const sourceOptions = useMemo(() => [
        'customer', 'facebook', 'instagram', 'telegram', 'youtube', 'twitter', 'linkedin', 'tiktok', 'recommendation', 'googleads', 'dicilo', 'mhc', 'other'
    ], []);
    
    const onSubmit = (data: RecommendationFormData) => {
        console.log(data);
        toast({ title: "Formulario Enviado (Simulación)", description: "Los datos se han registrado en la consola." });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className='space-y-2'>
                    <Label htmlFor="recommenderName">{t('name')}</Label>
                    <Input id="recommenderName" {...register('recommenderName')} placeholder={t('name') as string} required />
                    {errors.recommenderName && <p className='text-sm text-destructive'>{t(errors.recommenderName.message as any)}</p>}
                </div>
                <div className='space-y-2'>
                    <Label htmlFor="recommenderEmail">{t('email')}</Label>
                    <Input id="recommenderEmail" {...register('recommenderEmail')} type="email" placeholder={t('email') as string} required />
                    {errors.recommenderEmail && <p className='text-sm text-destructive'>{t(errors.recommenderEmail.message as any)}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className='space-y-2'>
                    <Label htmlFor="promoCode">{t('promoCode')}</Label>
                    <Input id="promoCode" {...register('promoCode')} placeholder={t('promoCode') as string} />
                </div>
                <div className='space-y-2'>
                    <Label htmlFor="newsletterSelect">{t('newsletter.label')}</Label>
                    <Controller name="newsletter" control={control} render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger id="newsletterSelect"><SelectValue placeholder={t('newsletter.label')} /></SelectTrigger><SelectContent><SelectItem value="yes">{t('newsletter.yes')}</SelectItem><SelectItem value="no">{t('newsletter.no')}</SelectItem></SelectContent></Select>
                    )} />
                </div>
            </div>
            
            <div className='space-y-2'>
                <Label htmlFor="recommendationMessage">{t('recommendation.label')}</Label>
                <Textarea id="recommendationMessage" {...register('recommendationMessage')} placeholder={t('recommendation.labelPlaceholder') as string} rows={3} />
            </div>
            
            <div className="text-sm text-gray-600 bg-gray-100 rounded p-3">{t('infoText')}</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className='space-y-2'>
                    <Label htmlFor="source">{t('source.label')}</Label>
                    <Controller name="source" control={control} render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger id="source"><SelectValue placeholder={t('source.label')} /></SelectTrigger><SelectContent>{sourceOptions.map(opt => <SelectItem key={opt} value={opt}>{t(`source.${opt}`)}</SelectItem>)}</SelectContent></Select>
                    )} />
                    {errors.source && <p className='text-sm text-destructive'>{t(errors.source.message as any)}</p>}
                </div>
                 <div className='space-y-2'>
                    <Label htmlFor="refer-select">{t('refer.label')}</Label>
                    <Controller name="wantsToRecommend" control={control} render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger id="refer-select"><SelectValue placeholder={t('refer.label')} /></SelectTrigger><SelectContent><SelectItem value="yes">{t('refer.yes')}</SelectItem><SelectItem value="no">{t('refer.no')}</SelectItem></SelectContent></Select>
                    )} />
                 </div>
            </div>

            {wantsToRecommend === 'yes' && (
                <div className="space-y-4 border-t pt-4 animate-in fade-in-50 duration-300">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-200"><h4 className="font-bold mb-2">{t('inviteInfoTitle')}</h4><p>{t('communityText')}</p></div>
                    {fields.map((field, index) => (
                        <div key={field.id} className="border p-3 rounded-lg bg-secondary/30 relative">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className='space-y-1'><Label htmlFor={`recipientName-${index}`}>{t('recipient.name')}</Label><Input id={`recipientName-${index}`} {...register(`recipients.${index}.name`)} placeholder={t('recipient.name') as string} /></div>
                                <div className="grid gap-2"><div className='space-y-1'><Label htmlFor={`recipientEmail-${index}`}>{t('recipient.email')}</Label><Input id={`recipientEmail-${index}`} {...register(`recipients.${index}.email`)} type="email" placeholder={t('recipient.email') as string} /></div><div className='space-y-1'><Label htmlFor={`recipientWhatsapp-${index}`}>{t('recipient.whatsapp')}</Label><Input id={`recipientWhatsapp-${index}`} {...register(`recipients.${index}.whatsapp`)} placeholder={t('recipient.whatsapp') as string} /></div></div>
                            </div>
                            {errors.recipients?.[index] && <p className="text-sm text-destructive mt-2">{t(errors.recipients?.[index]?.root?.message as any)}</p>}
                            {fields.length > 1 && <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => append({ name: '', email: '', whatsapp: '' })}><PlusCircle className="mr-2 h-4 w-4" />{t('recipient.add')}</Button>
                </div>
            )}
            
            <div className="space-y-2"><Label htmlFor="product-recommendation">{t("productRecommendation.label")}</Label><Controller name="productRecommendation" control={control} render={({ field }) => (<Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger id="product-recommendation"><SelectValue placeholder={t("productRecommendation.placeholder")} /></SelectTrigger><SelectContent><SelectItem value="product1">Produkt 1 (Demo)</SelectItem><SelectItem value="product2">Produkt 2 (Demo)</SelectItem></SelectContent></Select>)} /></div>
            <div className="space-y-2"><Label>{t('membership.label')}</Label><Controller name="membership" control={control} render={({ field }) => (<RadioGroup onValueChange={field.onChange} className="flex gap-4"><div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="mem-yes" /><Label htmlFor="mem-yes">{t('membership.yes')}</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="no" id="mem-no" /><Label htmlFor="mem-no">{t('membership.no')}</Label></div></RadioGroup>)} /></div>
            <div className="space-y-4 border-t pt-4"><h3 className="font-semibold">{t('privacyTitle')}</h3><Controller name="confirmIndependent" control={control} render={({ field }) => (<div className="flex items-start space-x-2"><Checkbox id="confirmIndependent" checked={field.value} onCheckedChange={field.onChange} /><Label htmlFor="confirmIndependent" className={cn("text-xs text-muted-foreground", errors.confirmIndependent && "text-destructive")}>{t('no_mass_email_form', { ns: 'legal'})}</Label></div>)} /><Controller name="consentPrivacy" control={control} render={({ field }) => (<div className="flex items-start space-x-2"><Checkbox id="consentPrivacy" checked={field.value} onCheckedChange={field.onChange} /><Label htmlFor="consentPrivacy" className={cn("text-xs text-muted-foreground", errors.consentPrivacy && "text-destructive")}>{t('privacy', { ns: 'legal' })}</Label></div>)} /></div>
            <div className="bg-gray-100 text-gray-500 p-3 rounded text-center text-sm">{t('captcha.placeholder')}</div>
            <Button type="submit" className="w-full text-lg font-bold py-6" disabled={isSubmitting}>{isSubmitting && <Loader2 className="animate-spin mr-2" />}{t('submit')}</Button>
        </form>
    );
};

// --- Tab Views ---
const OverviewView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-6">
            <Card><CardHeader><CardTitle>Übersicht</CardTitle></CardHeader><CardContent className="grid grid-cols-2 gap-4"><div className="text-center"><p className="text-2xl font-bold">1,234</p><p className="text-xs text-muted-foreground">Gesendet gesamt</p></div><div className="text-center"><p className="text-2xl font-bold text-green-600">987</p><p className="text-xs text-muted-foreground">Akzeptiert</p></div><div className="text-center"><p className="text-2xl font-bold text-yellow-600">150</p><p className="text-xs text-muted-foreground">Ausstehend</p></div><div className="text-center"><p className="text-2xl font-bold text-red-600">97</p><p className="text-xs text-muted-foreground">Abgelehnt</p></div></CardContent></Card>
        </div>
        <div className="lg:col-span-2">
            <Card><CardHeader><CardTitle>Empfehlungsformular</CardTitle><CardDescription>Senden Sie eine Empfehlung an einen Freund</CardDescription></CardHeader><CardContent><RecommendationForm /></CardContent></Card>
        </div>
    </div>
);

const RecommendersView = () => {
    const { t } = useTranslation('forms');
    const demoData = [
        { name: 'Ana Torres', email: 'ana.t@example.com', sent: 25, accepted: 20, rate: '80%' }, { name: 'Carlos Gomez', email: 'carlos.g@example.com', sent: 18, accepted: 15, rate: '83%' }, { name: 'Luisa Fernandez', email: 'luisa.f@example.com', sent: 12, accepted: 8, rate: '67%' },
    ];
    return <Card><CardHeader><CardTitle>{t('listRecommenders')}</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Nombre</TableHead><TableHead>Email</TableHead><TableHead>Enviados</TableHead><TableHead>Aceptados</TableHead><TableHead>Tasa Aceptación</TableHead></TableRow></TableHeader><TableBody>{demoData.map(d => (<TableRow key={d.email}><TableCell>{d.name}</TableCell><TableCell>{d.email}</TableCell><TableCell>{d.sent}</TableCell><TableCell>{d.accepted}</TableCell><TableCell className="font-bold">{d.rate}</TableCell></TableRow>))}</TableBody></Table></CardContent></Card>;
};

const RecommendedView = () => {
    const { t } = useTranslation('forms');
    const demoData = [
        { name: 'Marta Diaz', by: 'Ana Torres', status: 'accepted' }, { name: 'Pedro Soler', by: 'Carlos Gomez', status: 'pending' }, { name: 'Julia Ramos', by: 'Ana Torres', status: 'rejected' },
    ];
    return <Card><CardHeader><CardTitle>{t('listRecommended')}</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Nombre Recomendado</TableHead><TableHead>Recomendado Por</TableHead><TableHead>Estado</TableHead></TableRow></TableHeader><TableBody>{demoData.map(d => (<TableRow key={d.name}><TableCell>{d.name}</TableCell><TableCell>{d.by}</TableCell><TableCell><Badge variant={d.status === 'accepted' ? 'default' : d.status === 'pending' ? 'secondary' : 'destructive'}>{d.status === 'accepted' && <CheckCircle className="mr-1 h-3 w-3"/>}{d.status === 'pending' && <Clock className="mr-1 h-3 w-3"/>}{d.status === 'rejected' && <XCircle className="mr-1 h-3 w-3"/>}{d.status}</Badge></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>;
};

const ReportsView = () => {
    const { t } = useTranslation('forms');
    return <Card><CardHeader><CardTitle>{t('reportsTitle')}</CardTitle><CardDescription>{t('reportsConfig')}</CardDescription></CardHeader><CardContent className="space-y-4"><div className="space-y-2"><Label>Frecuencia del Reporte</Label><Select defaultValue="weekly"><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="weekly">Semanal</SelectItem><SelectItem value="biweekly">Quincenal</SelectItem><SelectItem value="monthly">Mensual</SelectItem></SelectContent></Select></div><Button>Guardar Ajustes</Button><Button variant="outline" className="ml-2">Descargar CSV de Recomendadores</Button></CardContent></Card>;
};

const SettingsView = () => {
    const { t } = useTranslation('forms');
    return <Card><CardHeader><CardTitle>{t('settingsTitle')}</CardTitle></CardHeader><CardContent><p>Aquí irán los ajustes del formulario para este cliente específico.</p></CardContent></Card>;
};

// --- Main Content Component ---
const FormsDashboardContent = () => {
    const { user, isLoading } = useAuth();
    const { t } = useTranslation(['marketing', 'forms']);
    const [activeTab, setActiveTab] = useState('overview');

    const TABS = useMemo(() => [
        { id: 'overview', label: t('forms:overview'), icon: BarChart2 },
        { id: 'recommenders', label: t('forms:recommenders'), icon: Users },
        { id: 'recommended', label: t('forms:recommended'), icon: Send },
        { id: 'reports', label: t('forms:reports'), icon: FileText },
        { id: 'settings', label: t('forms:settings'), icon: Settings },
    ], [t]);
    
    const renderContent = () => {
        switch (activeTab) {
            case 'recommenders': return <RecommendersView />;
            case 'recommended': return <RecommendedView />;
            case 'reports': return <ReportsView />;
            case 'settings': return <SettingsView />;
            case 'overview': default: return <OverviewView />;
        }
    };
    
    if (isLoading) return <FormsDashboardSkeleton />;
    if (!user) return null; // Or a message, handled by AuthProvider mostly

    return (
        <div className="flex flex-col">
            <main className="flex-grow space-y-6">
                 <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3"><ClipboardList className="h-8 w-8" />{t('formsDashboard.title', {ns: 'marketing'})}</h1>
                        <p className="text-muted-foreground">{t('formsDashboard.managementDescription', {ns: 'marketing'})}</p>
                    </div>
                </div>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-wrap gap-2">
                            {TABS.map(tab => (
                                <Button key={tab.id} variant={activeTab === tab.id ? 'default' : 'outline'} onClick={() => setActiveTab(tab.id)}>
                                    <tab.icon className="mr-2 h-4 w-4" />
                                    {tab.label}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                {renderContent()}
            </main>
        </div>
    );
};

// --- Page Export ---
export default function FormsDashboardPage() {
    const { i18n } = useTranslation();
    if (!i18n.isInitialized) return <FormsDashboardSkeleton />;
    return <FormsDashboardContent />;
}
