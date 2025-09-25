
'use client';

import { useState, useRef } from 'react';
import { DesignerEditor } from './designer-editor';
import { DesignerPreview } from './designer-preview';
import { DesignerExport } from './designer-export';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import type { TFunction } from 'i18next';
import i18next from 'i18next';

export interface DesignerData {
  layout: number;
  image: string | null;
  logo: string | null;
  title: string;
  web: string;
  contact: string;
  iconWeb: string;
  iconContact: string;
  colorBg: string;
  zoom: number;
  imagePosition: { x: number; y: number };
}

interface SocialMediaDesignerProps {
  t: TFunction<'marketing'>;
  i18n: typeof i18next;
}

export function SocialMediaDesigner({ t, i18n }: SocialMediaDesignerProps) {
  const { toast } = useToast();
  const [data, setData] = useState<DesignerData>({
    layout: 0,
    image: null,
    logo: null,
    title: 'Tu Título Atractivo Aquí',
    web: 'miweb.com',
    contact: '+34 600 00 00 00',
    iconWeb: '🌐',
    iconContact: '📱',
    colorBg: '#1E40AF', // Un azul oscuro por defecto
    zoom: 100,
    imagePosition: { x: 50, y: 50 },
  });
  
  const previewRef = useRef<HTMLDivElement>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    if (!previewRef.current) return;
    setIsPublishing(true);

    try {
        const canvas = await html2canvas(previewRef.current, { scale: 2 });
        const imageBase64 = canvas.toDataURL('image/png').split(',')[1];
        
        const functions = getFunctions(app, 'europe-west1');
        const publishSocialPost = httpsCallable(functions, 'publishSocialPost');

        const caption = `${data.title}\n${data.web} | ${data.contact}`;
        // En el futuro, esto podría venir de un selector en la UI
        const networks = ['IG', 'FB', 'TW']; 

        await publishSocialPost({
            imageBase64,
            caption,
            networks,
            scheduledAt: null, // Publicar ahora
        });

        toast({
            title: 'Publicación en Proceso',
            description: 'Tu post se está enviando a las redes sociales a través de n8n.',
        });

    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Error de Publicación',
            description: error.message || 'No se pudo contactar con el servicio de publicación.',
        });
    } finally {
        setIsPublishing(false);
    }
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
      <DesignerEditor data={data} setData={setData} t={t} i18n={i18n} />
      <div className="lg:col-span-2 space-y-6">
        <DesignerPreview data={data} previewRef={previewRef} t={t} />
        <DesignerExport previewRef={previewRef} isPublishing={isPublishing} onPublish={handlePublish} t={t} />
      </div>
    </div>
  );
}
