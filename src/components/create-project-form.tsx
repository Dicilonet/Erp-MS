'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { addDoc, collection, onSnapshot, query, doc, updateDoc, where, getDocs } from 'firebase/firestore';
import { CalendarIcon, Loader2, Pencil, PlusCircle, Trash2, StickyNote } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { v4 as uuidv4 } from 'uuid';

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
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import type { Customer, Project, ProjectType, InternalUser, ProjectPhase } from '@/lib/types';
import { useAuth } from './auth-provider';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';

const phaseSchema = z.object({
  id: z.string(),
  name: z.string().min(3, 'El nombre de la fase debe tener al menos 3 caracteres.'),
  notes: z.string().optional(),
});

const formSchema = z.object({
  projectName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  projectType: z.enum(['Pagina Web', 'Desarrollo de Software', 'Automatización', 'Gestión de Clientes Dicilo', 'Marketing Digital', 'Otro'], { required_error: 'Debes seleccionar un tipo de proyecto.' }),
  projectOwner: z.string().min(1, { message: 'Debes asignar un responsable.' }),
  clientType: z.enum(['existing', 'external'], { required_error: 'Debes seleccionar un tipo de cliente.' }),
  customerId: z.string().optional(),
  clientName: z.string().optional(),
  status: z.enum(['Planificación', 'En Progreso', 'Completado', 'Pausado']),
  dates: z.object({
    from: z.date({ required_error: 'Se requiere una fecha de inicio.' }),
    to: z.date({ required_error: 'Se requiere una fecha de fin.' }),
  }),
  budget: z.coerce.number().min(0).optional(),
  phases: z.array(phaseSchema).min(1, 'El proyecto debe tener al menos una fase.'),
}).superRefine((data, ctx) => {
    if (data.clientType === 'existing' && !data.customerId) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Debes seleccionar un cliente existente.',
            path: ['customerId'],
        });
    }
    if (data.clientType === 'external' && (!data.clientName || data.clientName.length < 3)) {
         ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'El nombre del cliente externo debe tener al menos 3 caracteres.',
            path: ['clientName'],
        });
    }
});

type FormData = z.infer<typeof formSchema>;

interface CreateProjectFormProps {
  children: React.ReactNode;
  projectToEdit?: Project; 
}

export function CreateProjectForm({ children, projectToEdit }: CreateProjectFormProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [teamMembers, setTeamMembers] = useState<InternalUser[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const isEditMode = !!projectToEdit;
  const isMobile = useIsMobile();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: '',
      projectType: undefined,
      projectOwner: '',
      clientType: 'external',
      customerId: '',
      clientName: '',
      status: 'Planificación',
      dates: { from: new Date(), to: new Date() },
      budget: 0,
      phases: [{ id: uuidv4(), name: 'Fase 1', notes: '' }],
    },
  });

  const { fields: phaseFields, append: appendPhase, remove: removePhase } = useFieldArray({
    control: form.control,
    name: "phases"
  });

  const clientType = form.watch('clientType');

  useEffect(() => {
    if (open) {
      // Fetch customers
      const qCustomers = query(collection(db, "customers"));
      const unsubscribeCustomers = onSnapshot(qCustomers, (snapshot) => {
        setCustomers(snapshot.docs.map(doc => ({ ...doc.data(), customerId: doc.id })) as Customer[]);
      });

      // Fetch team members
      const fetchTeamMembers = async () => {
        const usersRef = collection(db, 'users');
        const qUsers = query(usersRef, where('role', 'in', ['colaborador', 'teamoffice']));
        const querySnapshot = await getDocs(qUsers);
        setTeamMembers(querySnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id })) as InternalUser[]);
      };
      
      fetchTeamMembers();
      
      return () => {
        unsubscribeCustomers();
      };
    }
  }, [open]);

  useEffect(() => {
    if (projectToEdit && open) {
      form.reset({
        projectName: projectToEdit.projectName || '',
        projectType: projectToEdit.projectType || undefined,
        projectOwner: projectToEdit.projectOwner || '',
        clientType: projectToEdit.customerId ? 'existing' : 'external',
        customerId: projectToEdit.customerId || '',
        clientName: projectToEdit.clientName || '',
        status: projectToEdit.status || 'Planificación',
        dates: {
            from: new Date(projectToEdit.startDate),
            to: new Date(projectToEdit.endDate)
        },
        budget: projectToEdit.budget || 0,
        phases: projectToEdit.phases && projectToEdit.phases.length > 0 ? projectToEdit.phases : [{ id: uuidv4(), name: 'Fase 1', notes: '' }],
      });
    } else if (!isEditMode && open) {
      form.reset({
        projectName: '',
        projectType: undefined,
        projectOwner: '',
        clientType: 'external',
        customerId: '',
        clientName: '',
        status: 'Planificación',
        dates: { from: new Date(), to: new Date() },
        budget: 0,
        phases: [{ id: uuidv4(), name: 'Fase 1', notes: '' }],
      });
    }
  }, [projectToEdit, isEditMode, form, open]);

  async function onSubmit(values: FormData) {
    if (!user) {
        toast({ variant: 'destructive', title: 'Error', description: 'Debes estar autenticado.' });
        return;
    }
    setIsLoading(true);

    let finalClientName = '';
    if (values.clientType === 'existing') {
        const selectedCustomer = customers.find(c => c.customerId === values.customerId);
        finalClientName = selectedCustomer?.name || 'Cliente Desconocido';
    } else {
        finalClientName = values.clientName!;
    }

    try {
        const functions = getFunctions(app, 'europe-west1');
        const projectPayload = {
          projectName: values.projectName,
          projectType: values.projectType,
          projectOwner: values.projectOwner,
          clientName: finalClientName,
          customerId: values.clientType === 'existing' ? values.customerId : null,
          status: values.status,
          startDate: values.dates.from,
          endDate: values.dates.to,
          budget: values.budget || 0,
          phases: values.phases,
        };

      if (isEditMode && projectToEdit) {
        const updateProject = httpsCallable(functions, 'updateProject');
        await updateProject({ projectId: projectToEdit.projectId, data: projectPayload });
        toast({ title: '¡Proyecto Actualizado!', description: `El proyecto "${values.projectName}" se ha guardado.`});
      } else {
        const createProject = httpsCallable(functions, 'createProject');
        await createProject(projectPayload);
        toast({ title: '¡Proyecto Creado!', description: `El proyecto "${values.projectName}" se ha creado.` });
      }
      
      setOpen(false);

    } catch (error: any) {
      console.error('Error guardando proyecto:', error);
      toast({ variant: 'destructive', title: 'Error al Guardar', description: error.message || 'Hubo un problema al guardar el proyecto.' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Modifica los detalles y fases del proyecto.' : 'Completa los detalles para planificar un nuevo proyecto.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto pr-4">
             <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Nombre del Proyecto</FormLabel>
                    <FormControl><Input placeholder="Ej: Campaña de Marketing Q4" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="projectType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Tipo de Proyecto</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona el tipo de trabajo..." />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Pagina Web">Página Web</SelectItem>
                                <SelectItem value="Desarrollo de Software">Desarrollo de Software</SelectItem>
                                <SelectItem value="Automatización">Automatización</SelectItem>
                                <SelectItem value="Gestión de Clientes Dicilo">Gestión de Clientes Dicilo</SelectItem>
                                <SelectItem value="Marketing Digital">Marketing Digital</SelectItem>
                                <SelectItem value="Otro">Otro</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="projectOwner"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Responsable del Proyecto</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Asignar a..." />
                                </SelectTrigger>
                            </FormControl>
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
            </div>

            <FormField
                control={form.control}
                name="clientType"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Tipo de Cliente</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Selecciona si el cliente ya existe o es nuevo" /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="existing">Cliente Existente (del ERP)</SelectItem>
                            <SelectItem value="external">Cliente Externo (Nuevo)</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />

            {clientType === 'existing' && (
                 <FormField
                    control={form.control}
                    name="customerId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Seleccionar Cliente Existente</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Busca en la lista de clientes..." /></SelectTrigger></FormControl>
                            <SelectContent><SelectItem value="none" disabled>Selecciona un cliente</SelectItem>
                                {customers.map(c => <SelectItem key={c.customerId} value={c.customerId}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            {clientType === 'external' && (
                <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Nombre del Cliente Externo</FormLabel>
                        <FormControl><Input placeholder="Ej: Nuevo Contacto S.L." {...field} value={field.value || ''} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="dates"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Fechas del Proyecto (Inicio - Fin)</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn("w-full pl-3 text-left font-normal", !field.value?.from && "text-muted-foreground")}
                                >
                                {field.value?.from ? (
                                    field.value.to ? (
                                    <>
                                        {format(field.value.from, "d 'de' LLL, y", { locale: es })} -{" "}
                                        {format(field.value.to, "d 'de' LLL, y", { locale: es })}
                                    </>
                                    ) : (
                                    format(field.value.from, "d 'de' LLL, y", { locale: es })
                                    )
                                ) : (
                                    <span>Selecciona un rango de fechas</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="range"
                                selected={{ from: field.value.from, to: field.value.to }}
                                onSelect={field.onChange}
                                numberOfMonths={isMobile ? 1 : 2}
                                locale={es}
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Presupuesto (€)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field} 
                            value={field.value || ''}
                            onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado del Proyecto</FormLabel>
                   <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Selecciona un estado" /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Planificación">Planificación</SelectItem>
                            <SelectItem value="En Progreso">En Progreso</SelectItem>
                            <SelectItem value="Completado">Completado</SelectItem>
                            <SelectItem value="Pausado">Pausado</SelectItem>
                        </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Separator />

            <div>
                <FormLabel>Fases del Proyecto</FormLabel>
                <div className="space-y-3 mt-2">
                    {phaseFields.map((field, index) => (
                         <div key={field.id} className="p-3 border rounded-md space-y-2 bg-secondary/50">
                            <div className="flex items-center gap-2">
                                <FormField
                                    control={form.control}
                                    name={`phases.${index}.name`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input placeholder={`Nombre de la Fase ${index + 1}`} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="button" variant="destructive" size="icon" onClick={() => removePhase(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                             <FormField
                                control={form.control}
                                name={`phases.${index}.notes`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea placeholder="Añadir una nota o 'Post-it' a esta fase (opcional)..." {...field} className="text-sm bg-background" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    ))}
                    <Button type="button" size="sm" variant="outline" onClick={() => appendPhase({ id: uuidv4(), name: '', notes: '' })}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Añadir Fase
                    </Button>
                </div>
                 <FormMessage>
                    {form.formState.errors.phases?.message}
                </FormMessage>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Guardando...' : (isEditMode ? 'Guardar Cambios' : 'Crear Proyecto')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
