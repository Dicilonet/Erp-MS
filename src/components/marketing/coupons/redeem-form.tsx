
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db, app } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { Coupon } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

import { CouponCard } from './coupon-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const formSchema = z.object({
    name: z.string().min(3, 'El nombre es requerido.'),
    contact: z.string().min(5, 'El contacto es requerido.'),
    channel: z.enum(['whatsapp', 'email', 'telegram']),
});

type FormData = z.infer<typeof formSchema>;

export function RedeemForm({ code }: { code: string }) {
    const { t } = useTranslation('marketing');
    const { toast } = useToast();
    const [coupon, setCoupon] = useState<Coupon | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRedeeming, setIsRedeeming] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: '', contact: '', channel: 'whatsapp' },
    });

    useEffect(() => {
        const fetchCoupon = async () => {
            setLoading(true);
            const q = query(collection(db, 'coupons'), where('code', '==', code), limit(1));
            const snapshot = await getDocs(q);
            if (snapshot.empty) {
                setError('Cupón no encontrado.');
            } else {
                setCoupon({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Coupon);
            }
            setLoading(false);
        };
        fetchCoupon();
    }, [code]);
    
    const onSubmit = async (values: FormData) => {
        setIsRedeeming(true);
        setError(null);
        try {
            const functions = getFunctions(app, 'europe-west1');
            const redeemCoupon = httpsCallable(functions, 'redeemCoupon');
            const result: any = await redeemCoupon({
                p_code: code,
                p_name: values.name,
                p_contact: values.contact,
                p_channel: values.channel,
            });

            if (result.data.success) {
                setCoupon(result.data.coupon);
                setIsSuccess(true);
                toast({ title: t('redeem.success') });
            } else {
                 throw new Error(result.data.message || 'Error desconocido');
            }
        } catch (err: any) {
            setError(err.message || 'Error al canjear el cupón.');
            toast({ variant: 'destructive', title: 'Error', description: err.message });
        } finally {
            setIsRedeeming(false);
        }
    };

    if (loading) return <div>{t('redeem.searching')}</div>;
    if (error) return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;
    if (!coupon) return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>Cupón no encontrado.</AlertDescription></Alert>;

    const isExpired = coupon.expires_at && new Date(coupon.expires_at) < new Date();
    const canRedeem = coupon.status === 'active' && !isExpired;

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold text-center">{t('redeem.title')}</h1>
            <CouponCard coupon={coupon} />
            <Card>
                <CardHeader>
                    <CardTitle>Detalles del Cupón</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p><strong>{t('redeem.code')}:</strong> {coupon.code}</p>
                    <p><strong>{t('redeem.status')}:</strong> <span className={`font-semibold ${coupon.status !== 'active' ? 'text-destructive' : 'text-green-600'}`}>{t(`redeem.statuses.${coupon.status}`)}</span></p>
                    {coupon.redeemed_at && <p><strong>{t('redeem.redeemedOn')}:</strong> {format(new Date(coupon.redeemed_at), 'dd/MM/yyyy HH:mm')}</p>}
                    {isExpired && !coupon.redeemed_at && <p className="font-bold text-destructive">{t('redeem.expired')}</p>}
                </CardContent>
            </Card>

            {isSuccess ? (
                <Alert variant="default" className="bg-green-100 border-green-400 text-green-800 dark:bg-green-900/50 dark:border-green-700 dark:text-green-300">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <AlertTitle>¡Éxito!</AlertTitle>
                    <AlertDescription>{t('redeem.success')}</AlertDescription>
                </Alert>
            ) : canRedeem ? (
                <Card>
                    <CardHeader><CardTitle>{t('redeem.redeemNow')}</CardTitle></CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField name="name" control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>{t('redeem.name')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField name="contact" control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>{t('redeem.contact')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField name="channel" control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>{t('redeem.channel')}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                            <SelectItem value="email">Email</SelectItem>
                                            <SelectItem value="telegram">Telegram</SelectItem>
                                        </SelectContent>
                                    </Select><FormMessage /></FormItem>
                                )}/>
                                </div>
                                <Button type="submit" disabled={isRedeeming} className="w-full">
                                    {isRedeeming && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                    {t('redeem.confirm')}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            ) : (
                <Alert variant="destructive">
                    <XCircle className="h-5 w-5" />
                    <AlertTitle>No se puede canjear</AlertTitle>
                    <AlertDescription>{coupon.status === 'redeemed' ? t('redeem.alreadyRedeemed') : t('redeem.notAvailable')}</AlertDescription>
                </Alert>
            )}
        </div>
    );
}

