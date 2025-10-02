'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { auth } from '@/lib/firebase';
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
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2, LayoutGrid, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useState, useEffect } from 'react'; // Importa useEffect

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, introduce un email válido.' }),
  password: z.string().min(1, { message: 'La contraseña no puede estar vacía.' }),
});

// (Opcional pero recomendado) Mapeo de errores de Firebase para mensajes amigables
const FIREBASE_ERRORS: { [key: string]: string } = {
  'auth/invalid-credential': 'Las credenciales son incorrectas. Por favor, verifica tu email y contraseña.',
  'auth/user-not-found': 'No se encontró un usuario con este email.',
  'auth/wrong-password': 'La contraseña es incorrecta.',
  'auth/too-many-requests': 'Demasiados intentos fallidos. Tu cuenta ha sido bloqueada temporalmente.',
};

export default function LoginPage() {
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
  const { toast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  // 1. Lógica de Efectos (el cambio principal)
  useEffect(() => {
    // Este efecto se ejecuta cuando el estado 'user' cambia
    if (user) {
      toast({
        title: '¡Bienvenido de nuevo!',
        description: 'Has iniciado sesión correctamente.',
      });
      router.push('/'); // Redirección fiable
    }
  }, [user, router, toast]);

  useEffect(() => {
    // Este efecto se ejecuta cuando el estado 'error' cambia
    if (error) {
      const errorMessage = FIREBASE_ERRORS[error.code as keyof typeof FIREBASE_ERRORS] || 'Ocurrió un error inesperado. Por favor, intenta de nuevo.';
      toast({
        variant: 'destructive',
        title: 'Error de autenticación',
        description: errorMessage,
      });
    }
  }, [error, toast]);

  // 2. Simplificación de la función onSubmit
  // Ahora solo se encarga de llamar a la función de login.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await signInWithEmailAndPassword(values.email, values.password);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
                 <LayoutGrid className="h-8 w-8 text-primary" />
                 <h1 className="text-3xl font-bold">M&amp;SOLUTIONS</h1>
            </div>
          <CardTitle>Iniciar Sesión</CardTitle>
          <CardDescription>Accede a tu panel de control del M&S</CardDescription>
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
                      <Input placeholder="tu@email.com" {...field} disabled={loading} />
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
                            placeholder="Tu contraseña" 
                            {...field} 
                            className="pr-10"
                            disabled={loading}
                        />
                        </FormControl>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute inset-y-0 right-0 h-full px-3 flex items-center justify-center text-muted-foreground hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={loading}
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
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Iniciar Sesión
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
             <p>¿No tienes una cuenta?&nbsp;</p>
             <Link href="/signup" className="font-semibold text-primary hover:underline">
                Regístrate
            </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
