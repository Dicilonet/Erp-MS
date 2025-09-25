
'use client';

import { useSearchParams } from 'next/navigation';
import { RedeemForm } from '@/components/marketing/coupons/redeem-form';
import { Card, CardContent } from '@/components/ui/card';
import { FullScreenLoader } from '@/components/ui/fullscreen-loader';
import { Suspense } from 'react';

function RedeemPageContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  return (
      <div className="min-h-screen bg-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
            <CardContent className="pt-6">
                 {code ? <RedeemForm code={code} /> : <p>Código de cupón no proporcionado.</p>}
            </CardContent>
        </Card>
      </div>
  );
}


export default function RedeemPage() {
    return (
        <Suspense fallback={<FullScreenLoader/>}>
            <RedeemPageContent/>
        </Suspense>
    )
}
