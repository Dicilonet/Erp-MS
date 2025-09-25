'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { db } from '@/lib/firebase';
import type { AssetType, ContentAsset } from '@/lib/types';
import { useAuth } from '../auth-provider';
import { Checkbox } from '../ui/checkbox';


const formSchema = z.object({
  name: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
  assetType: z.enum(['social_post', 'campaign_template'], { required_error: 'Debes seleccionar un tipo.' }),
  tags: z.string().min(3, 'Debes añadir al menos una etiqueta.'),
  brands: z.string().optional(),
  text: z.string().min(10, { message: 'El contenido debe tener al menos 10 caracteres.' }),
  imageUrl: z.string().url().or(z.literal('')).optional(),
  channels: z.array(z.string()).refine(value => value.some(item => item), {
    message: "Tienes que seleccionar al menos un canal.",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface CreateContentAssetFormProps {
  children: React.ReactNode;
  asset?: ContentAsset;
}

const channelItems = [
  { id: 'facebook', label: 'Facebook' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'email', label: 'Email' },
] as const;


export function CreateContentAssetForm({ children, asset }: CreateContentAssetFormProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation('marketing');
  const isEditMode = !!asset;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: asset?.name || '',
      assetType: asset?.assetType || undefined,
      tags: asset?.tags.join(', ') || '',
      brands: asset?.brands.join(', ') || '',
      text: asset?.content.text || '',
      imageUrl: asset?.content.imageUrl || '',
      channels: asset?.channels || [],
    },
  });

  const stringToArray = (str: string | undefined) => {
    if (!str) return [];
    return str.split(',').map(item => item.trim()).filter(Boolean);
  }

  async function onSubmit(values: FormData) {
    if (!user) {
        toast({ variant: 'destructive', title: 'Error', description: 'Debes estar autenticado.'});
        return;
    }
    setIsLoading(true);
    try {
        const assetData = {
            name: values.name,
            assetType: values.assetType,
            tags: stringToArray(values.tags),
            brands: stringToArray(values.brands),
            content: {
                text: values.text,
                imageUrl: values.imageUrl || '',
            },
            channels: values.channels,
            createdAt: asset?.createdAt || new Date().toISOString(),
            createdBy: asset?.createdBy || user.uid,
        };

        if (isEditMode && asset?.assetId) {
            const assetRef = doc(db, 'contentAssets', asset.assetId);
            await setDoc(assetRef, assetData, { merge: true });
            toast({ title: t('createAssetForm.update'), description: `"${values.name}" se ha actualizado.` });
        } else {
            await addDoc(collection(db, 'contentAssets'), assetData);
            toast({ title: t('createAssetForm.save'), description: `"${values.name}" se ha añadido al pool.` });
        }
      
      setOpen(false);
      if (!isEditMode) form.reset();

    } catch (error) {
      console.error('Error saving asset:', error);
      toast({ variant: 'destructive', title: 'Error al Guardar', description: 'Hubo un problema al guardar el activo.' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? t('createAssetForm.editTitle') : t('createAssetForm.title')}</DialogTitle>
          <DialogDescription>{isEditMode ? t('createAssetForm.editDescription') : t('createAssetForm.description')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField name="name" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>{t('createAssetForm.assetName')}</FormLabel><FormControl><Input placeholder={t('createAssetForm.assetNamePlaceholder')} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField name="assetType" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>{t('createAssetForm.assetType')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t('createAssetForm.selectAssetType')} /></SelectTrigger></FormControl>
                    <SelectContent><SelectItem value="social_post">{t('createAssetForm.socialPost')}</SelectItem><SelectItem value="campaign_template">{t('createAssetForm.campaignTemplate')}</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField name="tags" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>{t('createAssetForm.tags')}</FormLabel><FormControl><Input placeholder={t('createAssetForm.tagsPlaceholder')} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
            <FormField name="brands" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>{t('createAssetForm.brands')}</FormLabel><FormControl><Input placeholder={t('createAssetForm.brandsPlaceholder')} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="text" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>{t('createAssetForm.text')}</FormLabel><FormControl><Textarea placeholder={t('createAssetForm.textPlaceholder')} rows={5} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="imageUrl" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>{t('createAssetForm.imageUrl')}</FormLabel><FormControl><Input placeholder={t('createAssetForm.imageUrlPlaceholder')} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField
              control={form.control}
              name="channels"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">{t('createAssetForm.channels')}</FormLabel>
                  </div>
                  <div className="flex flex-wrap gap-4">
                  {channelItems.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="channels"
                      render={({ field }) => {
                        return (
                          <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{item.label}</FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? t('createAssetForm.updating') : t('createAssetForm.saving')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
