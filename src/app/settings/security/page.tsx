
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/components/auth-provider';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { updatePassword } from 'firebase/auth';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
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
import { Loader2 } from 'lucide-react';

const passwordFormSchema = z
  .object({
    newPassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ['confirmPassword'],
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function SecurityPage() {
  const { t } = useTranslation('settings');
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: PasswordFormValues) {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await updatePassword(user, data.newPassword);
      toast({
        title: t('security.toast.successTitle'),
        description: t('security.toast.successDescription'),
      });
      form.reset();
    } catch (error: any) {
      console.error("Error updating password:", error);
       let description = t('security.toast.errorGeneric');
        if (error.code === 'auth/weak-password') {
            description = t('security.toast.errorWeak');
        } else if (error.code === 'auth/requires-recent-login') {
            description = "Por seguridad, debes iniciar sesión de nuevo para cambiar tu contraseña.";
        }
      toast({
        variant: 'destructive',
        title: t('security.toast.errorTitle'),
        description: description,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
       <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
                <CardTitle>{t('security.title')}</CardTitle>
                <CardDescription>{t('security.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('security.newPassword')}</FormLabel>
                        <FormControl>
                            <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('security.confirmPassword')}</FormLabel>
                        <FormControl>
                            <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
            <CardFooter>
                 <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? t('security.savingButton') : t('security.saveButton')}
                </Button>
            </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
