
'use client';

import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, query, getDocs, where } from 'firebase/firestore';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import type { Ticket, TicketStatus, TicketPriority, Customer } from '@/lib/types';
import { db } from '@/lib/firebase';
import { PriorityBadge } from './priority-badge';
import { useTranslation } from 'react-i18next';

const statusColors: { [key in TicketStatus]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  'Abierto': 'default',
  'En Progreso': 'secondary',
  'Resuelto': 'outline',
  'Cerrado': 'destructive',
};

interface EnrichedTicket extends Ticket {
    customerName?: string;
}

export function SupportTicketList() {
  const { t } = useTranslation('support');
  const [tickets, setTickets] = useState<EnrichedTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "tickets"));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const ticketsData = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        ticketId: doc.id,
      })) as Ticket[];
      
      const customerIds = [...new Set(ticketsData.map(t => t.customerId))].filter(id => !!id);
      const customers: Record<string, Customer> = {};

      if (customerIds.length > 0) {
        // Firestore 'in' queries are limited to 30 values, chunk if necessary for large scale
        const customersQuery = query(collection(db, 'customers'), where('__name__', 'in', customerIds));
        const customersSnap = await getDocs(customersQuery);
        customersSnap.forEach(doc => {
          customers[doc.id] = doc.data() as Customer;
        });
      }

      const enrichedTickets = ticketsData.map(ticket => ({
          ...ticket,
          customerName: ticket.customerId ? customers[ticket.customerId]?.name : 'N/A'
      }));

      setTickets(enrichedTickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching tickets: ", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
          <TableCell><Skeleton className="h-5 w-40" /></TableCell>
          <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
        </TableRow>
      )
    ));
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('list.title')}</CardTitle>
        <CardDescription>
          {t('list.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
         {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {loading ? renderSkeletons(3, true) : tickets.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">{t('list.noTickets')}</p>
          ) : (
            tickets.map((ticket) => (
              <Card key={ticket.ticketId} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-lg line-clamp-2">{ticket.subject}</p>
                  <PriorityBadge priority={ticket.priority} />
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                    <p><strong>{t('list.table.customer')}:</strong> {ticket.customerName}</p>
                    <p><strong>{t('list.table.agent')}:</strong> {ticket.assignedTo}</p>
                    <p><strong>{t('list.table.createdAt')}:</strong> {new Date(ticket.createdAt).toLocaleDateString()}</p>
                </div>
                {ticket.audioUrl && (
                    <div className="mt-3">
                        <audio src={ticket.audioUrl} controls className="w-full h-10" />
                    </div>
                )}
                <div className="mt-4 flex justify-between items-center">
                  <Badge variant={statusColors[ticket.status] || 'secondary'}>{ticket.status}</Badge>
                  <Button variant="outline" size="sm" disabled>{t('list.viewDetails')}</Button>
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
                <TableHead>{t('list.table.customer')}</TableHead>
                <TableHead>{t('list.table.subject')}</TableHead>
                <TableHead>{t('list.table.priority')}</TableHead>
                <TableHead>{t('list.table.status')}</TableHead>
                <TableHead>{t('list.table.agent')}</TableHead>
                <TableHead>{t('list.table.createdAt')}</TableHead>
                <TableHead>{t('list.table.audio')}</TableHead>
                <TableHead className="text-right">{t('list.table.actions')}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? renderSkeletons(5, false) : tickets.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                    {t('list.noTickets')}
                    </TableCell>
                </TableRow>
                ) : (
                tickets.map((ticket) => (
                    <TableRow key={ticket.ticketId}>
                    <TableCell className="font-medium">
                        {ticket.customerName}
                    </TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>
                        <PriorityBadge priority={ticket.priority} />
                    </TableCell>
                    <TableCell>
                        <Badge variant={statusColors[ticket.status] || 'secondary'}>
                        {ticket.status}
                        </Badge>
                    </TableCell>
                    <TableCell>{ticket.assignedTo}</TableCell>
                    <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {ticket.audioUrl ? (
                        <audio src={ticket.audioUrl} controls className="w-full h-10" />
                      ) : (
                        <span className="text-muted-foreground text-xs">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                        <Button variant="outline" size="sm" disabled>
                        {t('list.viewDetails')}
                        </Button>
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
