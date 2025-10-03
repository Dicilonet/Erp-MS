'use client';

import { useTranslation } from 'react-i18next';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import RecommendationFormForClient from './form-client';
import type { Customer, Article } from '@/lib/types';


function EmbedPageContent() {
  const params = useParams();
  const clientId = params.clientId as string;
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [products, setProducts] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) return;

    const fetchCustomerData = async () => {
      setLoading(true);
      const customerRef = doc(db, 'customers', clientId);
      const customerSnap = await getDoc(customerRef);

      if (customerSnap.exists()) {
        const customerData = { ...customerSnap.data(), customerId: customerSnap.id } as Customer;
        setCustomer(customerData);
        // Aquí podrías cargar los productos específicos del cliente si fuera necesario
        setProducts([
            { articleId: 'demo1', name: 'Producto A (Demo)', articleNumber: 'P-A', type: 'product', unit: 'Stk', priceNet: 10, taxRate: 19, priceGross: 11.9, createdAt: '' },
            { articleId: 'demo2', name: 'Servicio B (Demo)', articleNumber: 'S-B', type: 'service', unit: 'h', priceNet: 50, taxRate: 19, priceGross: 59.5, createdAt: '' },
        ]);
      } else {
        notFound();
      }
      setLoading(false);
    };

    fetchCustomerData();
  }, [clientId]);


  if (loading) {
    return (
        <div className="p-4">
            <Card>
                <CardContent className="pt-6">
                    <Skeleton className="h-8 w-1/2 mx-auto mb-6" />
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                         <Skeleton className="h-20 w-full" />
                         <Skeleton className="h-12 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  }

  if (!customer) {
    return notFound();
  }

  return (
      <div className="bg-background p-4 sm:p-6">
        <RecommendationFormForClient products={products} clientId={clientId} />
      </div>
  );
}


export default function EmbedPage() {
    const { i18n } = useTranslation();

    if (!i18n.isInitialized) {
        return (
             <div className="flex h-screen w-full items-center justify-center bg-background">
                <Skeleton className="h-96 w-full max-w-lg" />
            </div>
        )
    }

    return <EmbedPageContent/>
}
