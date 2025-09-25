'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { db, app } from '@/lib/firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { ContentAsset, Project } from '@/lib/types';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

const scheduleSchema = z.object({
  assetId: z.string().min(1, "Debes seleccionar un activo."),
  projectId: z.string().min(1, "Debes seleccionar un proyecto."),
  finalText: z.string().min(10, "El texto debe tener al menos 10 caracteres."),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

interface ScheduleAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
  projectId?: string;
  selectedDate: Date;
}

export function ScheduleAssetModal({ isOpen, onClose, customerId, projectId: initialProjectId, selectedDate }: ScheduleAssetModalProps) {
  const { t } = useTranslation('marketing');
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assets, setAssets] = useState<ContentAsset[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
        projectId: initialProjectId && initialProjectId !== 'general' ? initialProjectId : '',
    }
  });

  const isProjectFixed = initialProjectId !== 'general';

  // Carga los activos del Content Pool y los proyectos del cliente
  useEffect(() => {
    const fetchData = async () => {
      // Fetch assets
      const assetsQuery = await getDocs(collection(db, "contentAssets"));
      const assetsData = assetsQuery.docs.map(doc => ({ ...doc.data(), assetId: doc.id })) as ContentAsset[];
      setAssets(assetsData);

      // Fetch projects for the selected customer
      const projectsQuery = query(collection(db, "projects"), where("customerId", "==", customerId));
      const projectsSnapshot = await getDocs(projectsQuery);
      const projectsData = projectsSnapshot.docs.map(doc => ({ ...doc.data(), projectId: doc.id })) as Project[];
      setProjects(projectsData);
    };

    if (isOpen && customerId) {
      fetchData();
    }
  }, [isOpen, customerId]);


  // Actualiza el campo de texto cuando se selecciona un activo
  const selectedAssetId = watch('assetId');
  useEffect(() => {
    const selectedAsset = assets.find(asset => asset.assetId === selectedAssetId);
    if (selectedAsset) {
      setValue('finalText', selectedAsset.content.text);
    }
  }, [selectedAssetId, assets, setValue]);


  const onSubmit = async (data: ScheduleFormData) => {
    setIsSubmitting(true);
    try {
        const functions = getFunctions(app, 'europe-west1');
        const createMarketingEvent = httpsCallable(functions, 'createMarketingEvent');
        
        const selectedAsset = assets.find(asset => asset.assetId === data.assetId);

        await createMarketingEvent({
            projectId: data.projectId,
            customerId: customerId,
            assetId: data.assetId,
            scheduledDate: selectedDate.toISOString(),
            finalContent: {
                text: data.finalText,
                imageUrl: selectedAsset?.content.imageUrl || ''
            }
        });

        toast({ title: t('modal.toast.success.title'), description: t('modal.toast.success.description') });
        onClose();

    } catch (error: any) {
        toast({ variant: "destructive", title: t('modal.toast.error.title'), description: error.message });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('modal.title')}</DialogTitle>
          <DialogDescription>
            {t('modal.description', { date: moment(selectedDate).format('LL') })}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
           {!isProjectFixed && (
             <div>
                <Label>{t('modal.project.label')}</Label>
                <Select onValueChange={(value) => setValue('projectId', value, { shouldValidate: true })}>
                    <SelectTrigger>
                        <SelectValue placeholder={t('modal.project.placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                        {projects.map(proj => (
                            <SelectItem key={proj.projectId} value={proj.projectId}>{proj.projectName}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.projectId && <p className="text-sm text-destructive mt-1">{errors.projectId.message}</p>}
            </div>
           )}
          <div>
            <Label>{t('modal.asset.label')}</Label>
            <Select onValueChange={(value) => setValue('assetId', value, { shouldValidate: true })}>
                <SelectTrigger>
                    <SelectValue placeholder={t('modal.asset.placeholder')} />
                </SelectTrigger>
                <SelectContent>
                    {assets.map(asset => (
                        <SelectItem key={asset.assetId} value={asset.assetId}>{asset.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {errors.assetId && <p className="text-sm text-destructive mt-1">{errors.assetId.message}</p>}
          </div>
          <div>
            <Label htmlFor="finalText">{t('modal.text.label')}</Label>
            <Textarea id="finalText" {...register('finalText')} rows={5} />
            {errors.finalText && <p className="text-sm text-destructive mt-1">{errors.finalText.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>{t('modal.cancel')}</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('modal.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
