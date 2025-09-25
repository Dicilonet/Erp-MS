
'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { collection, query, where, onSnapshot, orderBy, getDocs, writeBatch } from 'firebase/firestore';
import { db, app } from '@/lib/firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import type { Coupon } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, Search, Trash2, Loader2, Printer } from 'lucide-react';
import { CouponCard } from './coupon-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/components/auth-provider';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export function AdminList() {
  const { t } = useTranslation('marketing');
  const { toast } = useToast();
  const { isSuperadmin } = useAuth();
  const [rows, setRows] = useState<Coupon[]>([]);
  const [q, setQ] = useState('');
  const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const load = () => {
    setLoading(true);
    const monthKey = month.replace('-', '');
    const couponsQuery = query(
      collection(db, 'coupons'),
      where('month_key', '==', monthKey),
      orderBy('code', 'asc')
    );
    
    const unsubscribe = onSnapshot(couponsQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Coupon[];
      setRows(data);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = load();
    return () => unsubscribe();
  }, [month]);

  const filtered = useMemo(() => {
    const searchTerm = q.trim().toLowerCase();
    if (!searchTerm) return rows;
    return rows.filter(r =>
      r.code.toLowerCase().includes(searchTerm) ||
      (r.title || '').toLowerCase().includes(searchTerm) ||
      (r.value_text || '').toLowerCase().includes(searchTerm) ||
      (r.redeemer_name || '').toLowerCase().includes(searchTerm)
    );
  }, [q, rows]);

  const handleResetCoupons = async () => {
    setIsDeleting(true);
    try {
      const functions = getFunctions(app, 'europe-west1');
      const deleteAllCoupons = httpsCallable(functions, 'deleteAllCoupons');
      const result: any = await deleteAllCoupons();

      if (result.data.success) {
        toast({ title: 'Reseteo Completo', description: result.data.message });
      } else {
        throw new Error(result.data.message || 'Error desconocido');
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error al Resetear', description: error.message });
    } finally {
      setIsDeleting(false);
    }
  };

  const exportCsv = () => {
    const headers = ['code', 'month_key', 'title', 'subtitle', 'value_text', 'status', 'expires_at', 'redeemed_at', 'redeemer_name', 'redeemer_contact', 'redeemer_channel'];
    const csvEscape = (s: string | null | undefined) => {
        if (s == null) return '';
        const str = String(s);
        const mustQuote = /["\n,;]/.test(str);
        if (!mustQuote) return str;
        const inner = str.replace(/"/g, '""');
        return `"${inner}"`;
    };
    const lines = [headers.join(',')];
    filtered.forEach(r => {
      lines.push([
        csvEscape(r.code), r.month_key, csvEscape(r.title), csvEscape(r.subtitle), csvEscape(r.value_text),
        r.status, r.expires_at || '', getFormattedDate(r.redeemed_at) || '', csvEscape(r.redeemer_name),
        csvEscape(r.redeemer_contact), r.redeemer_channel || ''
      ].join(','));
    });
    const blob = new Blob([`\uFEFF${lines.join('\n')}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coupons_${month.replace('-', '')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
    const handlePrint = async () => {
        if (filtered.length === 0) return;
        setIsPrinting(true);
        try {
            const printWindow = window.open('', '_blank', 'width=800,height=600');
            if (!printWindow) {
                throw new Error('No se pudo abrir la ventana de impresión. Verifica que no esté bloqueada por el navegador.');
            }

            const generateCouponHTML = (coupon: Coupon) => {
                const redeemUrl = `${window.location.origin}/redeem?code=${encodeURIComponent(coupon.code)}`;
                const bg = coupon.bg_image_url || `https://picsum.photos/seed/${coupon.id}/520/292`;
                
                // Usamos un placeholder para el QR, que se llenará con un script
                return `
                    <div class="coupon-card">
                        <div class="coupon-inner">
                            <img src="${bg}" class="bg-img" alt="background" />
                            <div class="bg-gradient"></div>
                            <div class="coupon-code">${coupon.code}</div>
                            <div class="coupon-content">
                                <div class="coupon-header">
                                    <h3 class="coupon-title">${coupon.title || ''}</h3>
                                    <p class="coupon-subtitle">${coupon.subtitle || ''}</p>
                                </div>
                                <div class="coupon-footer">
                                    <div class="coupon-terms">
                                        ${coupon.terms ? `<p class="terms-text">${coupon.terms}</p>` : ''}
                                        ${coupon.expires_at ? `<p class="expiry-text">Válido hasta: ${format(new Date(coupon.expires_at), 'yyyy-MM-dd')}</p>` : ''}
                                    </div>
                                    <div class="value-qr-container">
                                        <p class="coupon-value">${coupon.value_text || ''}</p>
                                        <div class="qr-container">
                                            <div class="qr-placeholder" data-url="${redeemUrl}"></div>
                                            <p class="qr-label">Escanéame</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            };

            const couponsPerPage = 9; // 3x3 grid
            const pages = [];
            for (let i = 0; i < filtered.length; i += couponsPerPage) {
                const pageCoupons = filtered.slice(i, i + couponsPerPage);
                pages.push(`
                    <div class="print-page">
                        <div class="coupons-grid">
                            ${pageCoupons.map(generateCouponHTML).join('')}
                        </div>
                    </div>
                `);
            }

            const fullHTML = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Cupones - ${month}</title>
                    <meta charset="utf-8">
                    <script src="https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js"><\/script>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
                        body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; color-adjust: exact; margin: 0; }
                        @page { size: A4; margin: 10mm; }
                        .print-page { width: 190mm; height: 277mm; display: flex; align-items: center; justify-content: center; page-break-after: always; }
                        .print-page:last-child { page-break-after: auto; }
                        .coupons-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); gap: 5mm; width: 100%; height: 100%; }
                        .coupon-card { width: 100%; height: 100%; break-inside: avoid; }
                        .coupon-inner { position: relative; width: 100%; height: 100%; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05); color: white; display: flex; flex-direction: column; background-color: #333; }
                        .bg-img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.4; }
                        .bg-gradient { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 40%, rgba(0,0,0,0.7) 100%); }
                        .coupon-code { position: absolute; top: 5px; right: 8px; z-index: 20; font-family: monospace; font-size: 7px; color: rgba(255,255,255,0.8); }
                        .coupon-content { position: relative; z-index: 20; height: 100%; display: flex; flex-direction: column; padding: 8px; }
                        .coupon-header { flex-grow: 1; }
                        .coupon-title { font-size: 11px; font-weight: 700; margin-bottom: 2px; }
                        .coupon-subtitle { font-size: 9px; opacity: 0.9; }
                        .coupon-footer { display: flex; justify-content: space-between; align-items: flex-end; }
                        .coupon-terms { width: 55%; font-size: 6px; line-height: 1.3; color: rgba(255,255,255,0.9); }
                        .value-qr-container { display: flex; align-items: flex-end; gap: 5px; }
                        .coupon-value { font-size: 20px; font-weight: 900; line-height: 1; }
                        .qr-container { background: white; border-radius: 4px; padding: 3px; display: flex; flex-direction: column; align-items: center; }
                        .qr-placeholder { width: 35px; height: 35px; }
                        .qr-label { font-size: 6px; color: #333; font-weight: 600; margin-top: 2px; }
                    </style>
                </head>
                <body>
                    ${pages.join('')}
                    <script>
                        document.addEventListener('DOMContentLoaded', function() {
                            const placeholders = document.querySelectorAll('.qr-placeholder');
                            if (placeholders.length === 0) {
                                console.log('No QR codes to generate. Closing.');
                                setTimeout(() => window.close(), 100);
                                return;
                            }
                            let generatedCount = 0;
                            placeholders.forEach(ph => {
                                try {
                                    const qr = qrcode(0, 'M');
                                    qr.addData(ph.getAttribute('data-url'));
                                    qr.make();
                                    ph.innerHTML = qr.createImgTag(2, 0);
                                } catch (e) {
                                    console.error('QR generation failed:', e);
                                    ph.innerHTML = 'QR Error';
                                } finally {
                                    generatedCount++;
                                    if (generatedCount === placeholders.length) {
                                        console.log('All QRs processed, triggering print.');
                                        setTimeout(() => {
                                            window.print();
                                            setTimeout(() => window.close(), 500);
                                        }, 500); 
                                    }
                                }
                            });
                        });
                    <\/script>
                </body>
                </html>
            `;

            printWindow.document.write(fullHTML);
            printWindow.document.close();
            
            toast({
                title: "Vista previa de impresión lista",
                description: `Se han preparado ${filtered.length} cupones para imprimir.`
            });

        } catch (error: any) {
            console.error('Error en impresión:', error);
            toast({ variant: 'destructive', title: "Error de Impresión", description: error.message });
        } finally {
            setIsPrinting(false);
        }
    };

  const getFormattedDate = (dateValue: any) => {
    if (!dateValue) return null;
    // Si es un objeto Timestamp de Firebase, conviértelo a Date
    if (typeof dateValue.toDate === 'function') {
      return format(dateValue.toDate(), 'yyyy-MM-dd HH:mm');
    }
    // Si ya es una fecha o un string de fecha válido
    try {
      const parsedDate = new Date(dateValue);
      if (!isNaN(parsedDate.getTime())) {
          return format(parsedDate, 'yyyy-MM-dd HH:mm');
      }
    } catch {
        return null;
    }
    return null;
  };

  return (
    <div className="mt-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={t('coupons.adminList.searchPlaceholder')} 
            value={q} 
            onChange={e => setQ(e.target.value)} 
            className="pl-8" 
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <Input 
            type="month" 
            value={month} 
            onChange={e => setMonth(e.target.value)} 
            className="flex-1 min-w-[150px]" 
          />
          <Button 
            variant="outline" 
            onClick={handlePrint} 
            disabled={filtered.length === 0 || isPrinting} 
            className="flex-1"
          >
            {isPrinting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Printer className="mr-2 h-4 w-4"/>}
            {isPrinting ? 'Preparando...' : 'Imprimir Lote'}
          </Button>
          <Button variant="outline" onClick={exportCsv} disabled={filtered.length === 0} className="flex-1">
            <Download className="mr-2 h-4 w-4"/>
            {t('coupons.adminList.export')}
          </Button>
          <Button variant="outline" onClick={load} disabled={loading} size="icon">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}/>
          </Button>
          {isSuperadmin && (
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isDeleting}>
                        <Trash2 className="mr-2 h-4 w-4" /> Resetear Cupones
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Se borrarán **todos** los cupones de la base de datos y se resetearán los contadores.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetCoupons} disabled={isDeleting}>
                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        Confirmar y Borrar Todo
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          {t('coupons.adminList.noCoupons')}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(r => (
            <div key={r.id} className="break-inside-avoid-page">
              <CouponCard coupon={r} />
              <div className="text-xs mt-2 text-muted-foreground p-2 bg-muted rounded-md no-print">
                <p><b>{t('coupons.adminList.status')}:</b> {r.status}</p>
                {r.redeemed_at && (
                  <p>
                    <b>{t('coupons.adminList.redeemedOn')}:</b> {' '}
                    {getFormattedDate(r.redeemed_at)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
