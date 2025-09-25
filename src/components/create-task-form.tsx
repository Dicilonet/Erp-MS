'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, CalendarIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { InternalUser, ProjectPhase } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useAuth } from './auth-provider';


const taskFormSchema = z.object({
  taskName: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
  description: z.string().optional(),
  phaseId: z.string().min(1, { message: 'Debes seleccionar una fase.' }),
  assignedTo: z.string().min(1, { message: 'Debes asignar la tarea a alguien.' }),
  dueDate: z.date({ required_error: 'Se requiere una fecha de vencimiento.' }),
  priority: z.enum(['Baja', 'Media', 'Alta', 'Crítica']),
});

type FormData = z.infer<typeof taskFormSchema>;

interface CreateTaskFormProps {
  children: React.ReactNode;
  projectId: string;
  phases: ProjectPhase[];
  teamMembers: InternalUser[];
  defaultPhaseId?: string; // Prop opcional para la fase por defecto
}

export function CreateTaskForm({ children, projectId, phases, teamMembers, defaultPhaseId }: CreateTaskFormProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      taskName: '',
      description: '',
      phaseId: defaultPhaseId || '',
      assignedTo: '',
      dueDate: new Date(),
      priority: 'Media',
    },
  });

  // Efecto para resetear y establecer el phaseId por defecto cuando se abre el modal
  useEffect(() => {
    if (open) {
      form.reset({
        taskName: '',
        description: '',
        phaseId: defaultPhaseId || (phases.length > 0 ? phases[0].id : ''),
        assignedTo: '',
        dueDate: new Date(),
        priority: 'Media',
      });
    }
  }, [open, defaultPhaseId, phases, form]);


  async function onSubmit(values: FormData) {
    if (!user) {
        toast({ variant: 'destructive', title: 'Error', description: 'Debes estar autenticado.' });
        return;
    }
    if (!projectId) {
         toast({ variant: 'destructive', title: 'Error', description: 'No se ha seleccionado un proyecto.' });
         return;
    }
    setIsLoading(true);
    
    try {
        const functions = getFunctions(app, 'europe-west1');
        const createTask = httpsCallable(functions, 'createTask');
        
        const payload = {
            ...values,
            projectId: projectId,
            dueDate: values.dueDate.toISOString(),
        };

        await createTask(payload);
        
        toast({
            title: '¡Tarea Creada!',
            description: `La tarea "${values.taskName}" ha sido añadida al proyecto.`,
        });
        setOpen(false);

    } catch (error: any) {
        console.error('Error creating task:', error);
        toast({
            variant: 'destructive',
            title: 'Error al Crear Tarea',
            description: error.message || 'Hubo un problema al crear la tarea.',
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Crear Nueva Tarea</DialogTitle>
          <DialogDescription>
            Completa los detalles para añadir una nueva tarea a este proyecto.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
                control={form.control}
                name="taskName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Nombre de la Tarea</FormLabel>
                    <FormControl><Input placeholder="Ej: Configurar la base de datos" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Descripción (Opcional)</FormLabel>
                    <FormControl><Textarea placeholder="Describe los requisitos de la tarea..." {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <div className="grid grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="phaseId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Fase del Proyecto</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar fase..." /></SelectTrigger></FormControl>
                            <SelectContent>
                                {phases.map(phase => (
                                    <SelectItem key={phase.id} value={phase.id}>{phase.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Prioridad</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Establecer prioridad" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Baja">Baja</SelectItem>
                                <SelectItem value="Media">Media</SelectItem>
                                <SelectItem value="Alta">Alta</SelectItem>
                                <SelectItem value="Crítica">Crítica</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="assignedTo"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Asignar a</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar miembro..." /></SelectTrigger></FormControl>
                            <SelectContent>
                                {teamMembers.map(member => (
                                    <SelectItem key={member.uid} value={member.uid}>{member.profile.fullName}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Fecha de Vencimiento</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "PPP") : <span>Selecciona fecha</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Guardando...' : 'Crear Tarea'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
