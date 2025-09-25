
'use client';

// Este componente es una maqueta funcional de la interfaz.
// La lógica para llamar a `scheduleNewPost` y manejar la subida de archivos debe implementarse.

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Facebook, Instagram, Send, Loader2, Paperclip, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/ui/form';

const postSchema = z.object({
  content: z.string().min(1, 'El contenido no puede estar vacío.'),
  platforms: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'Debes seleccionar al menos una plataforma.',
  }),
  scheduledAt: z.string(), // Mantener como string para el input
});

type PostFormData = z.infer<typeof postSchema>;

interface UnifiedPostComposerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
}

export function UnifiedPostComposer({ isOpen, onClose, selectedDate }: UnifiedPostComposerProps) {
  const { t } = useTranslation('marketing');
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  
  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: '',
      platforms: [],
      scheduledAt: selectedDate ? new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '',
    },
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        setFiles(Array.from(e.target.files));
    }
  };
  
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };


  const onSubmit = async (data: PostFormData) => {
    setIsSubmitting(true);
    toast({ title: "Programando publicación...", description: "Por favor, espera." });
    
    // Simulación de la llamada al backend. Reemplazar con la lógica real.
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log({
        ...data,
        scheduledAt: new Date(data.scheduledAt),
        mediaFiles: files.map(f => f.name),
    });

    setIsSubmitting(false);
    toast({ title: "¡Publicación programada!", description: "Tu contenido se publicará en la fecha y hora seleccionadas." });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('marketingSuite.composer.title')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">{t('marketingSuite.composer.placeholder')}</Label>
            <Textarea id="content" {...form.register('content')} rows={6} />
            {form.formState.errors.content && <p className="text-sm text-destructive">{form.formState.errors.content.message}</p>}
          </div>

           <div className="space-y-2">
            <Label>{t('marketingSuite.composer.platforms')}</Label>
             <div className="flex gap-4">
                <FormField
                    control={form.control}
                    name="platforms"
                    render={({ field }) => (
                        <div className="flex items-center gap-4">
                            <Checkbox id="facebook" onCheckedChange={(checked) => checked ? field.onChange([...field.value, 'facebook']) : field.onChange(field.value.filter(v => v !== 'facebook'))} />
                            <Label htmlFor="facebook" className="flex items-center gap-2 cursor-pointer"><Facebook className="text-blue-600"/> Facebook</Label>
                            <Checkbox id="instagram" onCheckedChange={(checked) => checked ? field.onChange([...field.value, 'instagram']) : field.onChange(field.value.filter(v => v !== 'instagram'))} />
                            <Label htmlFor="instagram" className="flex items-center gap-2 cursor-pointer"><Instagram className="text-pink-600"/> Instagram</Label>
                        </div>
                    )}
                />
            </div>
             {form.formState.errors.platforms && <p className="text-sm text-destructive">{form.formState.errors.platforms.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label>{t('marketingSuite.composer.media')}</Label>
             <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm">
                    <label className="cursor-pointer">
                        <Paperclip className="mr-2 h-4 w-4"/>
                        Adjuntar
                        <input type="file" multiple onChange={handleFileChange} className="hidden"/>
                    </label>
                </Button>
            </div>
             {files.length > 0 && (
                <div className="text-xs text-muted-foreground space-y-1 pt-2">
                    {files.map((file, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <span>{file.name}</span>
                            <Button type="button" variant="ghost" size="icon" className="h-5 w-5" onClick={() => removeFile(i)}><X className="h-3 w-3"/></Button>
                        </div>
                    ))}
                </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="scheduledAt">{t('marketingSuite.composer.scheduleAt')}</Label>
            <Input id="scheduledAt" type="datetime-local" {...form.register('scheduledAt')} />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              {t('marketingSuite.composer.scheduleButton')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
