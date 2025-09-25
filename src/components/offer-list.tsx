'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, collectionGroup } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import type { Offer, OfferStatus } from '@/lib/types';
import { db } from '@/lib/firebase';
import { useTranslation } from 'react-i18next';
import { CreateOfferForm } from './create-offer-form';
import { Copy, Pencil } from 'lucide-react';

const statusColors: { [key in OfferStatus]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  'Borrador': 'secondary',
  'Enviada': 'default',
  'Aceptada': 'outline',
  'Rechazada': 'destructive',
  'Vencida': 'destructive',
};

export function OfferList() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation('offer');

  useEffect(() => {
    const q = query(collectionGroup(db, 'offers'), orderBy('issueDate', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const offersData = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        offerId: doc.id,
      })) as Offer[];
      setOffers(offersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching offers: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const renderSkeletons = (count: number, isMobile: boolean) => {
    return Array.from({ length: count }).map((_, i) => (
      isMobile ? (
        <Card key={i} className="p-4 space-y-3">
          <div className="flex justify-between items-start">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-1/2" />
          <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-8 w-24" />
          </div>
        </Card>
      ) : (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
          <TableCell><Skeleton className="h-5 w-32" /></TableCell>
          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
          <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-5 w-20" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
        </TableRow>
      )
    ));
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('list.title')}</CardTitle>
        <CardDescription>{t('list.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {loading ? renderSkeletons(3, true) : offers.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">{t('list.noOffers')}</p>
          ) : (
            offers.map((offer) => (
              <Card key={offer.offerId} className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="font-bold text-lg">{offer.offerNumber}</p>
                        <p className="text-sm text-muted-foreground">{offer.customerName}</p>
                    </div>
                    <Badge variant={statusColors[offer.status] || 'secondary'}>{t(`list.status.${offer.status}`)}</Badge>
                </div>
                 <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>{t('list.table.issueDate')}:</strong> {new Date(offer.issueDate).toLocaleDateString()}</p>
                    <p><strong>{t('list.table.total')}:</strong> <span className="font-mono font-bold">{formatCurrency(offer.total)}</span></p>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                    <CreateOfferForm offerToEdit={offer} isDuplicate={true}>
                      <Button variant="ghost" size="sm"><Copy className="h-4 w-4 mr-2" />{t('list.actions.duplicate')}</Button>
                    </CreateOfferForm>
                    {offer.status === 'Borrador' && (
                      <CreateOfferForm offerToEdit={offer}>
                        <Button variant="outline" size="sm"><Pencil className="h-4 w-4 mr-2" />{t('list.actions.edit')}</Button>
                      </CreateOfferForm>
                    )}
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
            <Table>
            <TableHeader>
                <TableRow>
                  <TableHead>{t('list.table.number')}</TableHead>
                  <TableHead>{t('list.table.customer')}</TableHead>
                  <TableHead>{t('list.table.issueDate')}</TableHead>
                  <TableHead>{t('list.table.status')}</TableHead>
                  <TableHead className="text-right">{t('list.table.total')}</TableHead>
                  <TableHead className="text-right">{t('list.actions.title')}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? renderSkeletons(5, false) : offers.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">{t('list.noOffers')}</TableCell>
                </TableRow>
                ) : (
                offers.map((offer) => (
                    <TableRow key={offer.offerId}>
                      <TableCell className="font-medium">{offer.offerNumber}</TableCell>
                      <TableCell>{offer.customerName}</TableCell>
                      <TableCell>{new Date(offer.issueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                          <Badge variant={statusColors[offer.status] || 'secondary'}>{t(`list.status.${offer.status}`)}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold">{formatCurrency(offer.total)}</TableCell>
                      <TableCell className="text-right">
                          <CreateOfferForm offerToEdit={offer} isDuplicate={true}>
                            <Button variant="ghost" size="icon" title={t('list.actions.duplicate')}><Copy className="h-4 w-4" /></Button>
                          </CreateOfferForm>
                          {offer.status === 'Borrador' && (
                            <CreateOfferForm offerToEdit={offer}>
                               <Button variant="ghost" size="icon" title={t('list.actions.edit')}><Pencil className="h-4 w-4" /></Button>
                            </CreateOfferForm>
                          )}
                      </TableCell>
                    </TableRow>
                ))
                )}
            </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
