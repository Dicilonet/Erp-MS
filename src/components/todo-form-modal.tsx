
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { db } from '@/lib/firebase';
import { doc, addDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Todo } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { useTranslation } from 'react-i18next';

const todoSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres.").optional(),
  text: z.string().min(3, "La tarea debe tener al menos 3 caracteres."),
  priority: z.enum(['importante', 'media', 'idea']),
});
type TodoFormData = z.infer<typeof todoSchema>;

interface TodoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  todoToEdit?: Todo | null;
}

export function TodoFormModal({ isOpen, onClose, userId, todoToEdit }: TodoFormModalProps) {
  const { toast } = useToast();
  const { t } = useTranslation('todo');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!todoToEdit;

  const form = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: todoToEdit?.title || '',
      text: todoToEdit?.text || '',
      priority: todoToEdit?.priority || 'media',
    }
  });

  useEffect(() => {
    if (isOpen) {
        form.reset({
            title: todoToEdit?.title || '',
            text: todoToEdit?.text || '',
            priority: todoToEdit?.priority || 'media',
        });
    }
  }, [todoToEdit, isOpen, form]);

  const onSubmit = async (data: TodoFormData) => {
    setIsSubmitting(true);
    try {
      if (todoToEdit) {
        const todoRef = doc(db, `users/${userId}/todos`, todoToEdit.id);
        await updateDoc(todoRef, { ...data });
        toast({ title: t('toast.updated') });
      } else {
        await addDoc(collection(db, `users/${userId}/todos`), {
          ...data,
          completed: false,
          createdAt: serverTimestamp(),
        });
        toast({ title: t('toast.created') });
      }
      onClose();
    } catch (error) {
      console.error("Error saving todo:", error);
      toast({ variant: "destructive", title: t('toast.errorTitle'), description: t('toast.errorMessage') });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? t('form.editTitle') : t('form.addTitle')}</DialogTitle>
          <DialogDescription>
            {isEditMode ? t('form.editDescription') : t('form.addDescription')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                    <Label>{t('form.titleLabel')}</Label>
                    <FormControl>
                       <Input placeholder={t('form.titlePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                    <FormItem>
                    <Label>{t('form.detailsLabel')}</Label>
                    <FormControl>
                        <Textarea placeholder={t('form.detailsPlaceholder')} {...field} />
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
                    <Label>{t('form.priorityLabel')}</Label>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="importante">{t('priorities.importante')}</SelectItem>
                            <SelectItem value="media">{t('priorities.media')}</SelectItem>
                            <SelectItem value="idea">{t('priorities.idea')}</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="ghost">{t('form.cancel')}</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEditMode ? t('form.save') : t('form.create')}
                </Button>
            </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
