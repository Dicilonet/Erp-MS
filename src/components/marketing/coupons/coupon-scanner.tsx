
'use client';

import { useState, useEffect, useRef } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db, app } from '@/lib/firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';
import type { Coupon } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { CouponCard } from './coupon-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, CheckCircle, Loader2, ScanLine, VideoOff, XCircle, TicketSlash, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TFunction } from 'i18next';

// CORRECCIÓN: El componente ahora recibe `t` como prop.
interface CouponScannerProps {
  t: TFunction<'marketing'>;
}

export function CouponScanner({ t }: CouponScannerProps) {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [scannedCoupon, setScannedCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApiSupported, setIsApiSupported] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkSupport = () => {
      if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
        try {
          new (window as any).BarcodeDetector({ formats: ['qr_code'] });
          setIsApiSupported(true);
        } catch (e) {
          console.error("BarcodeDetector failed to initialize:", e);
          setIsApiSupported(false);
        }
      } else {
        setIsApiSupported(false);
      }
      setIsInitializing(false);
    };
    checkSupport();
  }, []);

  const stopScan = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const startScan = async () => {
    setScannedCode(null);
    setScannedCoupon(null);
    setError(null);
    setLoading(true);
    setIsScanning(true);

    if (!isApiSupported) {
      setError(t('scanner.notSupported'));
      setLoading(false);
      setIsScanning(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const barcodeDetector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
      
      scanIntervalRef.current = setInterval(async () => {
        if (!videoRef.current || videoRef.current.readyState < 2 || !barcodeDetector) return;
        
        try {
          const barcodes = await barcodeDetector.detect(videoRef.current);
          if (barcodes.length > 0) {
            const rawValue = barcodes[0].rawValue;
            let code = '';
            if (rawValue.includes('?code=')) {
                code = new URL(rawValue).searchParams.get('code') || '';
            } else {
                code = rawValue;
            }
            
            if(code && code !== scannedCode) {
              setScannedCode(code);
              stopScan();
            }
          }
        } catch (err) {
          console.error("Error detecting barcode:", err);
        }
      }, 500);

    } catch (err) {
      console.error('Error accessing camera:', err);
      setError(t('scanner.cameraError'));
      setHasCameraPermission(false);
      setLoading(false);
      setIsScanning(false);
    }
  };

  const handleRedeem = async () => {
      if (!scannedCoupon) return;
      setIsRedeeming(true);
      try {
          const functions = getFunctions(app, 'europe-west1');
          const adminRedeemCoupon = httpsCallable(functions, 'adminRedeemCoupon');
          const result: any = await adminRedeemCoupon({ code: scannedCoupon.code });

          if (result.data.success) {
              setScannedCoupon(result.data.coupon);
              toast({ title: t('scanner.redeemSuccessTitle'), description: t('scanner.redeemSuccessDescription', { code: scannedCoupon.code }) });
          } else {
              throw new Error(result.data.message || 'Error desconocido');
          }
      } catch (error: any) {
          setError(error.message);
          toast({ variant: 'destructive', title: t('scanner.redeemErrorTitle'), description: error.message });
      } finally {
          setIsRedeeming(false);
      }
  };

  const resetScanner = () => {
    setScannedCode(null);
    setScannedCoupon(null);
    setError(null);
    setLoading(false);
    setIsRedeeming(false);
    startScan();
  };

  useEffect(() => {
    return () => {
        stopScan();
    }
  }, []);

  useEffect(() => {
    if (scannedCode) {
      setLoading(true);
      const fetchCoupon = async () => {
        try {
          const q = query(collection(db, 'coupons'), where('code', '==', scannedCode), limit(1));
          const snapshot = await getDocs(q);
          if (snapshot.empty) {
            setError(t('scanner.notFound', { code: scannedCode }));
            setScannedCoupon(null);
          } else {
            setScannedCoupon({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Coupon);
            setError(null);
          }
        } catch (e: any) {
           setError(e.message);
           console.error(e);
        } finally {
           setLoading(false);
        }
      };
      fetchCoupon();
    }
  }, [scannedCode, t]);

  const renderInitializing = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
        <p className="mt-2 text-white/80">Inicializando escáner...</p>
    </div>
  );

  const renderReadyToScan = () => (
     <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-4 text-center">
        <p className="text-white text-lg font-semibold">{t('scanner.ready')}</p>
        <p className="text-white/80">{t('scanner.prompt')}</p>
    </div>
  );
  
  const renderScanning = () => (
     <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white pointer-events-none">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-2">{t('scanner.scanning')}</p>
    </div>
  );
  
  if (isInitializing) {
     return (
        <div className="space-y-4">
            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                {renderInitializing()}
            </div>
        </div>
     );
  }


  return (
    <div className="space-y-4">
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
        <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
        {isScanning ? renderScanning() : renderReadyToScan()}

         <div className="absolute bottom-4 left-4 right-4 flex justify-center">
            <Button onClick={isScanning ? stopScan : startScan} disabled={(loading && !isScanning) || !isApiSupported}>
                {isScanning ? <VideoOff className="mr-2 h-4 w-4" /> : <Camera className="mr-2 h-4 w-4" />}
                {isScanning ? t('scanner.stop') : t('scanner.start')}
            </Button>
        </div>
      </div>
      
       {!isApiSupported && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>{t('scanner.notSupportedTitle')}</AlertTitle>
          <AlertDescription>{t('scanner.notSupported')}</AlertDescription>
        </Alert>
      )}

      {hasCameraPermission === false && (
        <Alert variant="destructive">
          <VideoOff className="h-4 w-4" />
          <AlertTitle>{t('scanner.cameraErrorTitle')}</AlertTitle>
          <AlertDescription>{t('scanner.cameraError')}</AlertDescription>
        </Alert>
      )}
      
      {error && !scannedCoupon && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>{t('scanner.errorTitle')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {loading && scannedCode && (
         <Card>
            <CardHeader><CardTitle>Buscando cupón...</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-center p-10">
                <Loader2 className="h-10 w-10 animate-spin text-primary"/>
            </CardContent>
         </Card>
      )}

      {scannedCoupon && (
        <Card>
            <CardHeader>
                <Alert variant={scannedCoupon.status === 'active' ? 'default' : 'destructive'} className={`${scannedCoupon.status === 'active' ? 'bg-green-100 dark:bg-green-900/50 border-green-500' : ''}`}>
                    {scannedCoupon.status === 'active' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    <AlertTitle>
                        {t('scanner.foundTitle')} - {t('coupons.adminList.status')}: <span className="font-bold">{t(`coupons.redeem.statuses.${scannedCoupon.status}`)}</span>
                    </AlertTitle>
                </Alert>
            </CardHeader>
            <CardContent className="space-y-4">
                <CouponCard coupon={scannedCoupon} />
                {scannedCoupon.status === 'active' && (
                    <Button onClick={handleRedeem} disabled={isRedeeming} className="w-full">
                        {isRedeeming ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <TicketSlash className="mr-2 h-4 w-4" />}
                        {isRedeeming ? t('scanner.redeeming') : t('scanner.redeemButton')}
                    </Button>
                )}
                 {scannedCoupon.status !== 'active' ? (
                    <Button onClick={resetScanner} className="w-full">
                        <ScanLine className="mr-2 h-4 w-4" />
                        {t('scanner.scanNext')}
                    </Button>
                ) : null}
            </CardContent>
        </Card>
      )}
    </div>
  );
}
