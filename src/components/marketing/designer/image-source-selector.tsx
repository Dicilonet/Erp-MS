
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Upload, Sparkles, Camera, Loader2, Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateSocialMediaImage } from '@/ai/flows/generate-social-media-image';
import type { TFunction } from 'i18next';
import i18next from 'i18next';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';

interface ImageSourceSelectorProps {
  label: string;
  onImageSelect: (dataUrl: string) => void;
  t: TFunction<'marketing'>;
  i18n: typeof i18next;
}

export function ImageSourceSelector({ label, onImageSelect, t, i18n }: ImageSourceSelectorProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (open) {
      setPrompt(''); // Limpiar el prompt al abrir el diálogo
    }
  }, [open]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
        setOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateClick = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    toast({ title: t('designer.imageSource.generatingToast.title'), description: t('designer.imageSource.generatingToast.description') });
    try {
      const imageUrl = await generateSocialMediaImage(prompt);
      onImageSelect(imageUrl);
      setOpen(false);
    } catch (error: any) {
      console.error(error);
      toast({ variant: 'destructive', title: t('designer.imageSource.errorToast.title'), description: error.message });
    } finally {
      setIsGenerating(false);
    }
  };

  const cleanupCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  const requestCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(console.error);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
    }
  }, []);

  const handleDictateClick = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({ variant: 'destructive', title: t('designer.imageSource.dictationError.title'), description: t('designer.imageSource.dictationError.notSupported') });
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = i18n.language;

    recognitionRef.current.onstart = () => setIsListening(true);
    recognitionRef.current.onend = () => setIsListening(false);
    recognitionRef.current.onerror = (event: any) => {
      toast({ variant: 'destructive', title: t('designer.imageSource.dictationError.title'), description: event.error });
      setIsListening(false);
    };

    recognitionRef.current.onresult = (event: any) => {
      let interim_transcript = '';
      let final_transcript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }
      setPrompt(final_transcript + interim_transcript);
    };
    
    recognitionRef.current.start();
  };

  useEffect(() => {
    if (activeTab === 'camera' && open) {
      requestCamera();
    } else {
      cleanupCamera();
    }
  }, [activeTab, open, requestCamera, cleanupCamera]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        onImageSelect(dataUrl);
        setOpen(false);
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            <Sparkles className="mr-2 h-4 w-4" />
            {t('designer.imageSource.button')}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('designer.imageSource.title')}</DialogTitle>
            <DialogDescription>{t('designer.imageSource.description')}</DialogDescription>
          </DialogHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload"><Upload className="mr-2 h-4 w-4" />{t('designer.imageSource.tabs.upload')}</TabsTrigger>
              <TabsTrigger value="ai"><Sparkles className="mr-2 h-4 w-4" />{t('designer.imageSource.tabs.ai')}</TabsTrigger>
              <TabsTrigger value="camera"><Camera className="mr-2 h-4 w-4" />{t('designer.imageSource.tabs.camera')}</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="pt-6">
              <div className="space-y-2">
                <Label htmlFor="picture">{t('designer.imageSource.uploadLabel')}</Label>
                <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} />
              </div>
            </TabsContent>
            <TabsContent value="ai" className="pt-6 space-y-4">
              <div className="relative">
                <Textarea 
                    placeholder={t('designer.imageSource.promptPlaceholder')} 
                    value={prompt} 
                    onChange={(e) => setPrompt(e.target.value)} 
                    className="pr-10 min-h-[80px]"
                />
                 <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={handleDictateClick}
                    title={isListening ? t('designer.imageSource.dictation.stop') : t('designer.imageSource.dictation.start')}
                >
                    {isListening ? <MicOff className="text-destructive h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>
              <Button onClick={handleGenerateClick} disabled={isGenerating || !prompt} className="w-full">
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                {isGenerating ? t('designer.imageSource.generatingButton') : t('designer.imageSource.generateButton')}
              </Button>
            </TabsContent>
            <TabsContent value="camera" className="pt-6 space-y-4">
              {hasCameraPermission === null && <Loader2 className="animate-spin mx-auto"/>}
              {hasCameraPermission === false && (
                <Alert variant="destructive">
                  <AlertTitle>{t('designer.imageSource.cameraError.title')}</AlertTitle>
                  <AlertDescription>{t('designer.imageSource.cameraError.description')}</AlertDescription>
                </Alert>
              )}
              {hasCameraPermission === true && (
                <>
                  <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay playsInline muted />
                  <Button onClick={handleCapture} className="w-full">
                    <Camera className="mr-2 h-4 w-4" />
                    {t('designer.imageSource.captureButton')}
                  </Button>
                </>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
