'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Customer } from '@/lib/types';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CampaignDetailView } from './campaign-detail-view';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';

export function CampaignDashboard() {
  const { t } = useTranslation('marketing');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const q = query(collection(db, "customers"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const customersData = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        customerId: doc.id,
      })) as Customer[];
      setCustomers(customersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching customers: ", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>{t('campaigns.customerList.title')}</CardTitle>
          <CardDescription>{t('campaigns.customerList.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Command className="rounded-lg border shadow-md">
            <CommandInput
              placeholder={t('campaigns.customerList.searchPlaceholder')}
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              {loading ? (
                <div className="p-2 space-y-2">
                    <Skeleton className="h-8 w-full"/>
                    <Skeleton className="h-8 w-full"/>
                    <Skeleton className="h-8 w-full"/>
                </div>
              ) : (
                <>
                    <CommandEmpty>{t('campaigns.customerList.noResults')}</CommandEmpty>
                    <CommandGroup>
                        {filteredCustomers.map((customer) => (
                        <CommandItem
                            key={customer.customerId}
                            onSelect={() => setSelectedCustomer(customer)}
                            className="cursor-pointer"
                        >
                            {customer.name}
                        </CommandItem>
                        ))}
                    </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        {selectedCustomer ? (
          <CampaignDetailView customer={selectedCustomer} />
        ) : (
          <Card className="flex items-center justify-center min-h-[400px]">
            <p className="text-muted-foreground">{t('campaigns.selectCustomerPrompt')}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
