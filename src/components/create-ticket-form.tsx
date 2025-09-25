
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { addDoc, collection, onSnapshot, query } from 'firebase/firestore';
import { Loader2, Mic, StopCircle, Trash2 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useTranslation } from 'react-i18next';

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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { db, storage } from '@/lib/firebase';
import type { Customer, Ticket, TicketPriority } from '@/lib/types';


const formSchema = z.object({
  customerId: z.string().min(1, { message: 'Debes seleccionar un cliente.' }),
  subject: z.string().min(5, { message: 'El asunto debe tener al menos 5 caracteres.' }),
  description: z.string().min(10, { message: 'La descripción debe tener al menos 10 caracteres.' }),
  assignedTo: z.string().min(2, { message: 'Se debe asignar un agente.' }),
  priority: z.enum(['Baja', 'Media', 'Alta', 'Crítica']),
});

type FormData = z.infer<typeof formSchema>;

export function CreateTicketForm({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const { toast } = useToast();
  const { t } = useTranslation('support');

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (open) {
        const q = query(collection(db, "customers"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const customersData = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                customerId: doc.id,
            })) as Customer[];
            setCustomers(customersData);
        });
        return () => unsubscribe();
    }
  }, [open]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerId: '',
      subject: '',
      description: '',
      assignedTo: 'Soporte Nivel 1',
      priority: 'Media',
    },
  });

  const handleStartRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            setAudioBlob(audioBlob);
             // Stop all tracks to turn off the microphone indicator
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
        toast({ title: t('form.toast.recordingStarted.title'), description: t('form.toast.recordingStarted.description') });
    } catch (err) {
        console.error("Error al acceder al micrófono:", err);
        toast({ variant: 'destructive', title: t('form.toast.micError.title'), description: t('form.toast.micError.description') });
    }
  };

  const handleStopRecording = () => {
      if (mediaRecorderRef.current && isRecording) {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
          toast({ title: t('form.toast.recordingStopped.title'), description: t('form.toast.recordingStopped.description') });
      }
  };
  
  const handleDeleteAudio = () => {
      setAudioBlob(null);
      audioChunksRef.current = [];
      toast({ title: t('form.toast.audioDeleted.title'), description: t('form.toast.audioDeleted.description') });
  };


  async function onSubmit(values: FormData) {
    setIsLoading(true);
    let uploadedAudioUrl = '';

    try {
      if (audioBlob) {
        const audioRef = ref(storage, `support-audio/${uuidv4()}.webm`);
        await uploadBytes(audioRef, audioBlob);
        uploadedAudioUrl = await getDownloadURL(audioRef);
      }

      const newTicket: Omit<Ticket, 'ticketId'> = {
        customerId: values.customerId,
        subject: values.subject,
        description: values.description,
        assignedTo: values.assignedTo,
        priority: values.priority as TicketPriority,
        status: 'Abierto',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        audioUrl: uploadedAudioUrl || undefined,
        history: [{
            timestamp: new Date().toISOString(),
            user: 'Sistema', // Reemplazar con el usuario autenticado
            action: `Ticket creado con prioridad ${values.priority}.`,
        }]
      };

      await addDoc(collection(db, 'tickets'), newTicket);

      toast({
        title: t('form.toast.success.title'),
        description: t('form.toast.success.description', { subject: values.subject }),
      });
      
      setOpen(false);
      form.reset();
      setAudioBlob(null);

    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        variant: 'destructive',
        title: t('form.toast.error.title'),
        description: t('form.toast.error.description'),
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
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{t('form.createTitle')}</DialogTitle>
          <DialogDescription>
            {t('form.createDescription')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.customerLabel')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('form.customerPlaceholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customers.map(customer => (
                        <SelectItem key={customer.customerId} value={customer.customerId}>{customer.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.subjectLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('form.subjectPlaceholder')} {...field} />
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
                  <FormLabel>{t('form.descriptionLabel')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('form.descriptionPlaceholder')} rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>{t('form.audioLabel')}</FormLabel>
               <div className="mt-2 flex items-center gap-2 rounded-lg border p-3">
                  {!audioBlob ? (
                      <Button type="button" onClick={isRecording ? handleStopRecording : handleStartRecording} variant={isRecording ? 'destructive' : 'outline'} size="icon">
                         {isRecording ? <StopCircle className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                      </Button>
                  ) : (
                      <Button type="button" onClick={handleDeleteAudio} variant="ghost" size="icon">
                        <Trash2 className="h-5 w-5 text-destructive"/>
                      </Button>
                  )}
                 <div className="flex-1">
                    {isRecording ? (
                        <div className="flex items-center gap-2">
                           <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                           <span className="text-sm font-medium text-destructive">{t('form.recording')}</span>
                        </div>
                    ) : audioBlob ? (
                        <audio src={URL.createObjectURL(audioBlob)} controls className="w-full h-10" />
                    ) : (
                        <p className="text-sm text-muted-foreground">{t('form.recordPrompt')}</p>
                    )}
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.priorityLabel')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('form.priorityPlaceholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Baja">{t('priorities.low')}</SelectItem>
                        <SelectItem value="Media">{t('priorities.medium')}</SelectItem>
                        <SelectItem value="Alta">{t('priorities.high')}</SelectItem>
                        <SelectItem value="Crítica">{t('priorities.critical')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.agentLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('form.agentPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                {t('form.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading || isRecording}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? t('form.submitting') : (isRecording ? t('form.stopRecordingPrompt') : t('form.submit'))}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
