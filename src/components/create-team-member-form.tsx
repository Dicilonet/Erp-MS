
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { UserRole } from '@/lib/types';
import { useTranslation } from 'react-i18next';


const formSchema = z.object({
  fullName: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
  email: z.string().email({ message: 'Debe ser un email válido.' }),
  country: z.string().min(2, { message: 'El país es requerido.' }),
  whatsapp: z.string().min(8, { message: 'El número de WhatsApp no es válido.' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
  role: z.enum(['colaborador', 'teamoffice'], { required_error: 'Debes seleccionar un rol.' }),
});

type FormData = z.infer<typeof formSchema>;

export function CreateTeamMemberForm({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation('dashboard');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      country: '',
      whatsapp: '',
      password: '',
      role: undefined,
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    try {
        const functions = getFunctions(app, 'europe-west1'); // Especificar la región
        const createInternalUser = httpsCallable(functions, 'createInternalUser');
        const result: any = await createInternalUser(values);

        if (result.data.success) {
            toast({
                title: t('teams.createForm.successTitle'),
                description: t('teams.createForm.successDescription', { name: values.fullName, role: values.role }),
            });
            setOpen(false);
            form.reset();
        } else {
             throw new Error(result.data.message || 'Error desconocido al crear el usuario.');
        }

    } catch (error: any) {
      console.error('Error creating internal user:', error);
      const errorMessage = error.message || t('teams.createForm.errorDescription');
      toast({
        variant: 'destructive',
        title: t('teams.createForm.errorTitle'),
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{t('teams.createForm.title')}</DialogTitle>
          <DialogDescription>
            {t('teams.createForm.description')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('teams.createForm.fullName')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('teams.createForm.fullNamePlaceholder')} {...field} />
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
                  <FormLabel>{t('teams.createForm.email')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('teams.createForm.emailPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('teams.createForm.country')}</FormLabel>
                    <FormControl>
                        <Input placeholder={t('teams.createForm.countryPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('teams.createForm.whatsapp')}</FormLabel>
                    <FormControl>
                        <Input placeholder={t('teams.createForm.whatsappPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('teams.createForm.password')}</FormLabel>
                     <div className="relative">
                        <FormControl>
                        <Input 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder={t('teams.createForm.passwordPlaceholder')} 
                            {...field} 
                            className="pr-10"
                        />
                        </FormControl>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute inset-y-0 right-0 h-full px-3 flex items-center justify-center text-muted-foreground hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                             <span className="sr-only">
                                {showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            </span>
                        </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('teams.createForm.role')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder={t('teams.createForm.rolePlaceholder')} />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="colaborador">{t('teams.tabs.collaborators')}</SelectItem>
                            <SelectItem value="teamoffice">{t('teams.tabs.teamOffice')}</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                {t('teams.createForm.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? t('teams.createForm.submitting') : t('teams.createForm.submit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
