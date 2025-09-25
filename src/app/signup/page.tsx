
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { auth, app } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2, LayoutGrid, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, introduce un email válido.' }),
  password: z.string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
    .max(36, { message: 'La contraseña no puede tener más de 36 caracteres.' })
    .regex(/[a-z]/, { message: 'Debe contener al menos una letra minúscula.'})
    .regex(/[A-Z]/, { message: 'Debe contener al menos una letra mayúscula.'})
    .regex(/[0-9]/, { message: 'Debe contener al menos un número.'})
    .regex(/[#+$&!*_-]/, { message: 'Debe contener al menos uno de los siguientes caracteres especiales: #, +, $, &, !, *, _, -'})
});

export default function SignupPage() {
  const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);
  const { toast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await createUserWithEmailAndPassword(values.email, values.password);

      if (res || error?.code === 'auth/email-already-in-use') {
        try {
          const functions = getFunctions(app, 'europe-west1');
          const setSuperAdminRole = httpsCallable(functions, 'setSuperAdminRole');
          await setSuperAdminRole({ email: values.email });
        } catch (claimError) {
           console.warn("No se pudo auto-asignar el rol de superadmin. Esto es normal si el usuario que registra no es admin.", claimError);
        }

        toast({
            title: '¡Cuenta Creada/Actualizada!',
            description: 'Tu cuenta está lista. Ahora puedes iniciar sesión.',
        });
        router.push('/login');

      } else if (error) {
          throw error;
      }

    } catch (e: any) {
        console.error("Error en el registro:", e);
        toast({
            variant: 'destructive',
            title: 'Error en el registro',
            description: e.message || 'Ocurrió un error inesperado. Por favor, intenta de nuevo.',
        });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
                 <LayoutGrid className="h-8 w-8 text-primary" />
                 <h1 className="text-3xl font-bold">ERP M&SOLUTIONS</h1>
            </div>
          <CardTitle>Crear una Cuenta</CardTitle>
          <CardDescription>Regístrate para obtener acceso al ERP</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="tu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <div className="relative">
                        <FormControl>
                        <Input 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="Crea tu contraseña segura" 
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
                    <FormDescription>
                        Entre 6-36 caracteres, mayúsculas, minúsculas, números y símbolos (#, $, !, etc.).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Crear Cuenta
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
             <p>¿Ya tienes una cuenta?&nbsp;</p>
             <Link href="/login" className="font-semibold text-primary hover:underline">
                Inicia Sesión
            </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
