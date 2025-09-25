'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Share2, Download, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { TFunction } from 'i18next';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DesignerExportProps {
  previewRef: React.RefObject<HTMLDivElement>;
  isPublishing: boolean;
  onPublish: () => void;
  t: TFunction<'marketing'>;
}

export function DesignerExport({ previewRef, isPublishing, onPublish, t }: DesignerExportProps) {
  const { toast } = useToast();
  
  // Check if Web Share API is supported
  const isShareSupported = typeof navigator !== 'undefined' && !!navigator.share;

  const downloadImage = async (format: 'png' | 'jpeg') => {
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current, { scale: 2 });
    const link = document.createElement('a');
    link.download = `social-design.${format}`;
    link.href = canvas.toDataURL(`image/${format}`);
    link.click();
  };

  const downloadPDF = async () => {
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'l' : 'p',
        unit: 'px',
        format: [canvas.width, canvas.height]
    });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('social-design.pdf');
  };
  
  const handleShare = () => {
    if (navigator.share) {
        navigator.share({
            title: t('designer.share.title'),
            text: t('designer.share.text'),
            url: window.location.href
        }).catch((error) => {
            console.error('Share error:', error);
            // Show a toast only if the error is not an AbortError (user cancellation)
            if (error.name !== 'AbortError') {
              toast({
                  variant: 'destructive',
                  title: 'Error al Compartir',
                  description: 'No se pudo completar la acción. Es posible que no se haya otorgado el permiso.'
              });
            }
        });
    } else {
        toast({
            variant: 'destructive',
            title: 'No Soportado',
            description: t('designer.share.notSupported')
        });
    }
  };


  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button onClick={() => downloadImage('png')} variant="outline">
                <Download className="mr-2" /> PNG
            </Button>
            <Button onClick={downloadPDF} variant="outline">
                <FileText className="mr-2" /> PDF
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span tabIndex={0} className={!isShareSupported ? 'cursor-not-allowed' : ''}>
                    <Button onClick={handleShare} variant="outline" disabled={!isShareSupported} className="w-full">
                        <Share2 className="mr-2"/> {t('designer.export.share')}
                    </Button>
                  </span>
                </TooltipTrigger>
                {!isShareSupported && (
                  <TooltipContent>
                    <p>{t('designer.share.notSupported')}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>

            <Button onClick={onPublish} disabled={isPublishing}>
                {isPublishing ? <Loader2 className="mr-2 animate-spin"/> : <Share2 className="mr-2" />}
                {isPublishing ? t('designer.export.publishing') : t('designer.export.publish')}
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
