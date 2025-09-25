
'use client';

import { QRCodeCanvas } from 'qrcode.react';
import { format } from 'date-fns';
import type { Coupon } from '@/lib/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';


const PUBLIC_BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://example.com';

interface CouponCardProps {
  coupon: Coupon;
  compactValue?: boolean;
}

export function CouponCard({ coupon, compactValue = false }: CouponCardProps) {
  const { t } = useTranslation('marketing');
  const redeemUrl = `${PUBLIC_BASE_URL}/redeem?code=${encodeURIComponent(coupon.code)}`;
  const bg = coupon.bg_image_url || `https://picsum.photos/seed/${coupon.id}/520/292`;

  const valueElement = (
    <p className={cn(
      'font-black leading-tight text-white',
      compactValue 
        ? 'hidden'
        : 'text-4xl'
    )}>
      {coupon.value_text || ''}
    </p>
  );

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border shadow-lg bg-gray-800 text-white">
      <Image 
        src={bg} 
        alt="background" 
        layout="fill" 
        objectFit="cover" 
        className="saturate-105 opacity-50 z-0" 
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-10" />
      
      <div className={cn(
        "absolute z-20 text-right",
        compactValue ? 'hidden' : 'bottom-28 right-4'
      )}>
        {valueElement}
      </div>

      <div className="relative z-20 h-full flex flex-col p-4">
        <div className="flex justify-between items-start">
            <div className="flex-1">
                <h3 className="text-xl font-bold truncate mb-1">{coupon.title || ''}</h3>
                {coupon.isIndividual ? (
                    <>
                        <p className="text-sm opacity-90 line-clamp-1">{t('coupons.individual.for', { recipientName: coupon.recipientName || '...' })}</p>
                        <p className="text-sm opacity-90">{t('coupons.individual.from', { senderName: coupon.senderName || '...' })}</p>
                    </>
                ) : (
                   coupon.subtitle && <p className="text-sm opacity-90 line-clamp-1">{coupon.subtitle}</p>
                )}
            </div>
            <div className="text-right">
              <p className="text-xs font-mono tracking-wider text-white/80">{coupon.code}</p>
              {compactValue && (
                 <p className='text-xs mt-1 font-bold text-white'>{coupon.value_text || ''}</p>
              )}
            </div>
        </div>

        <div className="flex-grow flex flex-col justify-end">
            <div className="flex justify-between items-end">
                 <div className="w-1/2 pr-4">
                    {coupon.terms && (
                        <p className="text-[10px] leading-tight text-white/90 line-clamp-4 mb-1">
                            {coupon.terms}
                        </p>
                    )}
                    {coupon.expires_at && (
                        <p className="text-[10px] text-white/80">
                            Válido hasta: {format(new Date(coupon.expires_at), 'yyyy-MM-dd')}
                        </p>
                    )}
                </div>
                <div className="flex-shrink-0">
                    <div className="bg-white rounded-lg p-1.5 text-center flex flex-col items-center">
                        <div className="w-16 h-16">
                            <QRCodeCanvas 
                                value={redeemUrl} 
                                size={64} 
                                includeMargin={false} 
                                className="w-full h-full"
                            />
                        </div>
                        <p className="text-[9px] mt-1 text-gray-800 font-semibold">Escanéame</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
