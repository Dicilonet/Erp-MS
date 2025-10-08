
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight, LayoutGrid } from 'lucide-react';
import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LanguageSwitcher } from '@/components/language-switcher';

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, introduce un email válido.' }),
  companyName: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
});

function SignUpForm() {
    const { t } = useTranslation('landing');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: '', companyName: '' },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const functions = getFunctions(app, 'europe-west1');
            const submitContactForm = httpsCallable(functions, 'submitPublicContactForm');
            await submitContactForm(values);

            toast({
                title: t('hero.form.toast.title'),
                description: t('hero.form.toast.description'),
            });
            form.reset();

        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: t('hero.form.toast.errorTitle'),
                description: error.message || t('hero.form.toast.errorDescription'),
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="w-full shadow-2xl bg-card/80 backdrop-blur-lg">
            <CardHeader>
                <CardTitle>{t('hero.form.title')}</CardTitle>
                <CardDescription>{t('hero.form.description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('hero.form.companyName')}</FormLabel>
                                <FormControl>
                                <Input placeholder={t('hero.form.companyNamePlaceholder')} {...field} disabled={isLoading} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('hero.form.email')}</FormLabel>
                                <FormControl>
                                <Input placeholder={t('hero.form.emailPlaceholder')} {...field} disabled={isLoading} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('hero.form.submitButton')}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}


export function HeroSection() {
  const { t } = useTranslation('landing');
  return (
    <section className="relative bg-background overflow-hidden">
        <div className="absolute inset-0 z-0">
             <Image 
                src="https://images.unsplash.com/photo-1556761175-b413da4b248b?q=80&w=2070&auto=format&fit=crop"
                alt={t('hero.backgroundImageAlt')}
                fill
                className="opacity-20"
                data-ai-hint="office workspace"
                priority
             />
             <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative z-10 pt-6 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
                
                <div className="flex justify-between items-center mb-10">
                     <div className="flex items-center gap-2">
                        <LayoutGrid className="h-8 w-8 text-primary" />
                        <span className="font-semibold text-xl">M&SOLUTIONS</span>
                    </div>
                </div>

                <main className="mt-10">
                    <div className="sm:text-center lg:text-left">
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                            <span className="block">{t('hero.title1')}</span>{' '}
                            <span className="block text-primary">{t('hero.title2')}</span>
                        </h1>
                        <p className="mt-3 text-base text-muted-foreground sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
                            {t('hero.subtitle')}
                        </p>
                        <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                            <div className="rounded-md shadow">
                                <Button size="lg" className="w-full" asChild>
                                    <a href="#features">
                                        {t('hero.ctaButton')} <ArrowRight className="ml-2" />
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 flex items-center justify-center p-8">
             <div className="absolute top-6 right-6 z-20 flex gap-4 items-center">
                <LanguageSwitcher />
            </div>
             <div className="relative h-full w-full flex items-center justify-center p-8">
                <SignUpForm />
            </div>
        </div>
    </section>
  );
}

