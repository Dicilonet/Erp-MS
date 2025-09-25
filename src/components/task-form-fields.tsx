
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from 'lucide-react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
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
import { cn } from '@/lib/utils';
import type { TaskPriority, TaskStatus } from '@/lib/types';


export const taskFormSchema = z.object({
  taskName: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
  description: z.string().optional(),
  projectId: z.string().min(1, { message: 'Se requiere un ID de proyecto.' }),
  assignedTo: z.string().min(2, { message: 'Se requiere un responsable.'}),
  priority: z.enum(['Baja', 'Media', 'Alta', 'Crítica']),
  status: z.enum(['Pendiente', 'En Progreso', 'Completado', 'Bloqueado']),
  dueDate: z.date({ required_error: 'Se requiere una fecha de vencimiento.' }),
});


interface TaskFormFieldsProps {
    form: UseFormReturn<z.infer<typeof taskFormSchema>>;
    isEditMode?: boolean;
}

export function TaskFormFields({ form, isEditMode = false }: TaskFormFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="taskName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre de la Tarea</FormLabel>
            <FormControl>
              <Input placeholder="Ej: Diseñar la nueva pantalla de login" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descripción</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe los requisitos y el alcance de la tarea."
                className="resize-none"
                rows={3}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <div className="grid grid-cols-2 gap-4">
          <FormField
          control={form.control}
          name="assignedTo"
          render={({ field }) => (
              <FormItem>
              <FormLabel>Asignado a</FormLabel>
              <FormControl>
                  <Input placeholder="ID de usuario" {...field} />
              </FormControl>
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
                  <FormControl>
                  <SelectTrigger>
                      <SelectValue placeholder="Selecciona una prioridad" />
                  </SelectTrigger>
                  </FormControl>
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
      {isEditMode && (
         <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="En Progreso">En Progreso</SelectItem>
                        <SelectItem value="Completado">Completado</SelectItem>
                        <SelectItem value="Bloqueado">Bloqueado</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
      )}
      <FormField
        control={form.control}
        name="dueDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Fecha de Vencimiento</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Selecciona una fecha</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={ isEditMode ? undefined : (date) => date < new Date(new Date().setDate(new Date().getDate()-1))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
