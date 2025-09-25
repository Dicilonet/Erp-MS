
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Pencil, CalendarIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { getFunctions, httpsCallable, HttpsCallable } from 'firebase/functions';
import { app, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
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
import type { Task, InternalUser, ProjectPhase, Project } from '@/lib/types';
import { cn } from '@/lib/utils';

const editTaskFormSchema = z.object({
  taskName: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
  description: z.string().optional(),
  phaseId: z.string().min(1, { message: 'Debes seleccionar una fase.' }),
  assignedTo: z.string().min(1, { message: 'Debes asignar la tarea a alguien.' }),
  dueDate: z.date({ required_error: 'Se requiere una fecha de vencimiento.' }),
  priority: z.enum(['Baja', 'Media', 'Alta', 'Crítica']),
  status: z.enum(['Pendiente', 'En Progreso', 'Completado', 'Bloqueado']),
});

type FormData = z.infer<typeof editTaskFormSchema>;

interface EditTaskFormProps {
  task: Task;
  teamMembers: InternalUser[];
}

export function EditTaskForm({ task, teamMembers }: EditTaskFormProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [projectPhases, setProjectPhases] = useState<ProjectPhase[]>([]);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(editTaskFormSchema),
    defaultValues: {
      taskName: task.taskName,
      description: task.description || '',
      phaseId: task.phaseId,
      assignedTo: task.assignedTo,
      dueDate: new Date(task.dueDate),
      priority: task.priority,
      status: task.status,
    },
  });

  useEffect(() => {
    const fetchProjectPhases = async () => {
        if(open && task.projectId) {
            const projectRef = doc(db, 'projects', task.projectId);
            const projectSnap = await getDoc(projectRef);
            if (projectSnap.exists()) {
                const projectData = projectSnap.data() as Project;
                setProjectPhases(projectData.phases || []);
            }
        }
    };
    fetchProjectPhases();
  }, [open, task.projectId]);


  async function onSubmit(values: FormData) {
    setIsLoading(true);
    try {
      const functions = getFunctions(app, 'europe-west1');
      const updateTask = httpsCallable(functions, 'updateTask');

      const payload = {
        projectId: task.projectId,
        taskId: task.taskId,
        data: {
          ...values,
          dueDate: values.dueDate.toISOString(),
        },
      };

      await updateTask(payload);
      
      toast({
        title: '¡Tarea Actualizada!',
        description: `La tarea "${values.taskName}" ha sido guardada.`,
      });
      setOpen(false);

    } catch (error: any) {
      console.error('Error updating task:', error);
      toast({
        variant: 'destructive',
        title: 'Error al Actualizar',
        description: error.message || 'No se pudieron guardar los cambios.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Editar Tarea</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Editar Tarea</DialogTitle>
          <DialogDescription>
            Modifica los detalles de la tarea. Los cambios se guardarán inmediatamente.
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
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar estado" /></SelectTrigger></FormControl>
                            <SelectContent>
                            <SelectItem value="Pendiente">Pendiente</SelectItem>
                            <SelectItem value="En Progreso">En Progreso</SelectItem>
                            <SelectItem value="Completado">Hecho</SelectItem>
                            <SelectItem value="Bloqueado">Bloqueado</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="phaseId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Fase del Proyecto</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar fase..." /></SelectTrigger></FormControl>
                            <SelectContent>
                                {projectPhases.map(phase => (
                                    <SelectItem key={phase.id} value={phase.id}>{phase.name}</SelectItem>
                                ))}
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
