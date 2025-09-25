
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { addDoc, collection, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { Loader2, Trash2, Pencil } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { db } from '@/lib/firebase';
import type { Connection } from '@/lib/types';
import { useTranslation } from 'react-i18next';
import { AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';


const formSchema = z.object({
  name: z.enum(['Google Drive', 'Airtable', 'IMAP', 'Otro'], { required_error: 'Debes seleccionar un tipo de conexión.'}),
  description: z.string().min(5, { message: 'La descripción debe tener al menos 5 caracteres.' }),
  user: z.string().min(1, 'Este campo es requerido.'),
  status: z.enum(['Conectado', 'Desconectado', 'Error']),
});

type FormData = z.infer<typeof formSchema>;

interface ConnectionFormProps {
  children?: React.ReactNode;
  connection?: Connection;
  icon?: React.ReactNode;
}


export function ConnectionForm({ children, connection, icon }: ConnectionFormProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation('connections');
  const isEditMode = !!connection;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: connection?.name || undefined,
      description: connection?.description || '',
      user: connection?.user || '',
      status: connection?.status || 'Conectado',
    },
  });
  
  const stopPropagation = (e: React.MouseEvent | React.TouchEvent) => e.stopPropagation();

  const handleDelete = async (connectionId: string) => {
        try {
            await deleteDoc(doc(db, "connections", connectionId));
            toast({
                title: t('toast.deleted'),
            });
        } catch (error) {
            console.error("Error deleting connection: ", error);
            toast({
                variant: 'destructive',
                title: t('toast.deleteError'),
            });
        }
    };

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    try {
        const connectionData = { ...values };
        if (isEditMode && connection.connectionId) {
            const connectionRef = doc(db, 'connections', connection.connectionId);
            await setDoc(connectionRef, connectionData, { merge: true });
             toast({
                title: t('toast.updated'),
            });
        } else {
             await addDoc(collection(db, 'connections'), connectionData);
             toast({
                title: t('toast.created'),
            });
        }
      
      setOpen(false);
      if (!isEditMode) form.reset();

    } catch (error) {
      console.error('Error saving connection:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Hubo un problema al guardar la conexión.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const renderForm = () => (
     <DialogContent className="sm:max-w-[525px]" onClick={stopPropagation}>
        <DialogHeader>
          <DialogTitle>{isEditMode ? t('edit') : t('add')}</DialogTitle>
          <DialogDescription>{t('form.description')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('form.type')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder={t('form.typePlaceholder')} />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Google Drive">Google Drive</SelectItem>
                            <SelectItem value="Airtable">Airtable</SelectItem>
                            <SelectItem value="IMAP">IMAP (Email)</SelectItem>
                            <SelectItem value="Otro">Otro</SelectItem>
                        </SelectContent>
                    </Select>
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
                    <Input placeholder={t('form.descriptionPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="user"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.userLabel')} / API Key</FormLabel>
                  <FormControl>
                    <Input placeholder={t('form.userPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('form.statusLabel')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder={t('form.statusPlaceholder')} />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Conectado">{t('form.status.Conectado', { ns: 'connections' })}</SelectItem>
                            <SelectItem value="Desconectado">{t('form.status.Desconectado', { ns: 'connections' })}</SelectItem>
                            <SelectItem value="Error">{t('form.status.Error', { ns: 'connections' })}</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                {t('form.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Guardando...' : (isEditMode ? t('form.save') : t('form.create'))}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
  );

  if (!isEditMode) {
      return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            {renderForm()}
        </Dialog>
      );
  }

  return (
    <AccordionItem value={connection.connectionId}>
        <AccordionTrigger>
             <div className="flex items-center gap-3">
                {icon}
                <div>
                    <p className="font-semibold text-left">{connection.name}</p>
                    <p className="text-sm text-muted-foreground text-left">{connection.description}</p>
                </div>
            </div>
             <Badge variant={connection.status === 'Conectado' ? 'default' : 'destructive'}>{t(`form.status.${connection.status}` as any, { ns: 'connections' })}</Badge>
        </AccordionTrigger>
        <AccordionContent>
            <div className="px-4 pb-4 space-y-4" onClick={stopPropagation} onTouchStart={stopPropagation}>
                 <p className="text-sm">
                    <span className="font-semibold">{t('form.userLabel')}: </span>
                    <span className="font-mono text-muted-foreground bg-muted p-1 rounded-sm">{connection.user}</span>
                </p>
                <Separator />
                <div className="flex justify-end gap-2">
                     <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                           <Button variant="outline" size="sm"><Pencil className="h-4 w-4 mr-2" />{t('edit')}</Button>
                        </DialogTrigger>
                        {renderForm()}
                    </Dialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4 mr-2" />{t('card.deleteButton', { ns: 'common' })}</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('deleteDialog.title')}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t('deleteDialog.description', { description: connection.description })}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t('form.cancel')}</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete?.(connection.connectionId)} className="bg-destructive hover:bg-destructive/90">{t('deleteDialog.confirm')}</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </AccordionContent>
    </AccordionItem>
  );
}
