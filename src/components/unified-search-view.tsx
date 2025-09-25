
'use client';

import { Search, User, Mail, Building, Loader2, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { useState, useCallback } from 'react';
import { collection, query, where, getDocs, limit, collectionGroup } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Customer, Interaction } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import debounce from 'lodash.debounce';
import Link from 'next/link';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';

type SearchResult = 
    | { type: 'customer', data: Customer }
    | { type: 'interaction', data: Interaction & { customerName?: string } };


export function UnifiedSearchView() {
    const { t } = useTranslation('dashboard');
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const performSearch = async (term: string) => {
        if (term.length < 3) {
            setResults([]);
            return;
        }
        setLoading(true);
        try {
            const nameQuery = query(collection(db, 'customers'), 
                where('name', '>=', term),
                where('name', '<=', term + '\uf8ff'),
                limit(3)
            );
            const emailQuery = query(collection(db, 'customers'), 
                where('contactEmail', '==', term),
                limit(3)
            );

            const interactionsQuery = query(collectionGroup(db, 'interactions'),
                where('summary', '>=', term),
                where('summary', '<=', term + '\uf8ff'),
                limit(5)
            );
            
            const [nameSnap, emailSnap, interactionsSnap] = await Promise.all([
                getDocs(nameQuery),
                getDocs(emailQuery),
                getDocs(interactionsQuery)
            ]);

            const searchResultsMap = new Map<string, SearchResult>();

            nameSnap.forEach(doc => {
                const customer = { ...doc.data(), customerId: doc.id } as Customer;
                searchResultsMap.set(`customer-${doc.id}`, { type: 'customer', data: customer });
            });
            emailSnap.forEach(doc => {
                 const customer = { ...doc.data(), customerId: doc.id } as Customer;
                 searchResultsMap.set(`customer-${doc.id}`, { type: 'customer', data: customer });
            });

            const customerIds = new Set(interactionsSnap.docs.map(doc => (doc.data() as Interaction).customerId));
            const customersData: Record<string, Customer> = {};
            if (customerIds.size > 0) {
                 const customersQuery = query(collection(db, 'customers'), where('__name__', 'in', Array.from(customerIds)));
                 const customersSnap = await getDocs(customersQuery);
                 customersSnap.forEach(doc => {
                     customersData[doc.id] = { ...doc.data(), customerId: doc.id } as Customer;
                 });
            }

            interactionsSnap.forEach(doc => {
                const interaction = { ...doc.data(), interactionId: doc.id } as Interaction;
                searchResultsMap.set(`interaction-${doc.id}`, { 
                    type: 'interaction', 
                    data: {
                        ...interaction,
                        customerName: customersData[interaction.customerId]?.name || t('search.unknownCustomer')
                    }
                });
            });


            setResults(Array.from(searchResultsMap.values()));

        } catch (error) {
            console.error("Error searching: ", error);
            toast({
                variant: 'destructive',
                title: t('search.errorTitle'),
                description: t('search.errorDescription'),
            });
        } finally {
            setLoading(false);
        }
    };

    const debouncedSearch = useCallback(debounce(performSearch, 300), [t]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);
        debouncedSearch(term);
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('search.title')}</CardTitle>
        <CardDescription>{t('search.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={t('search.placeholder')}
            className="pl-8"
            value={searchTerm}
            onChange={handleInputChange}
          />
          {loading && <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground animate-spin" />}
        </div>
        <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-2">
            {results.length > 0 ? (
                results.map(result => (
                    <Link href={`/customers/${result.data.customerId}`} key={`${result.type}-${result.data.customerId}-${(result.data as Interaction).interactionId || ''}`} passHref>
                        <div className="p-3 rounded-lg border bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer">
                            {result.type === 'customer' ? (
                                <>
                                    <p className="font-semibold flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground"/>{(result.data as Customer).name}</p>
                                    <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1 pl-6">
                                        {(result.data as Customer).contactEmail}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="font-semibold flex items-center gap-2"><MessageSquare className="h-4 w-4 text-muted-foreground"/>{t('search.interactionLabel')}: {(result.data as Interaction & { customerName?: string }).customerName}</p>
                                    <p className="text-sm text-muted-foreground italic mt-1 pl-6">
                                       "{(result.data as Interaction).summary}"
                                    </p>
                                </>
                            )}
                        </div>
                    </Link>
                ))
            ) : (
                !loading && searchTerm.length >= 3 && (
                    <p className="text-center text-muted-foreground pt-4">{t('search.noResults', { term: searchTerm })}</p>
                )
            )}
        </div>
      </CardContent>
    </Card>
  );
}
