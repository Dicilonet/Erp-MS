
'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Expense } from '@/lib/types';
import { db } from '@/lib/firebase';
import { Separator } from './ui/separator';
import { useTranslation } from 'react-i18next';

export function ExpenseList() {
  const { t } = useTranslation('expenses');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "expenses"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const expensesData = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        expenseId: doc.id,
      })) as Expense[];
      setExpenses(expensesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching expenses: ", error);
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
          </div>
        </Card>
      ) : (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
          <TableCell><Skeleton className="h-5 w-40" /></TableCell>
          <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-5 w-20" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-5 w-16" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-5 w-20" /></TableCell>
        </TableRow>
      )
    ));
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">{t('list.title')}</CardTitle>
        <CardDescription>{t('list.description')}</CardDescription>
      </CardHeader>
      <CardContent>
         {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {loading ? renderSkeletons(3, true) : expenses.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">{t('list.noExpenses')}</p>
          ) : (
            expenses.map((expense) => (
              <Card key={expense.expenseId} className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-base sm:text-lg line-clamp-2 pr-2">{expense.description}</p>
                    <Badge variant="secondary" className="text-xs sm:text-sm">{expense.category}</Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                        <strong>{t('list.table.customer')}: </strong> 
                        {expense.customerName ? expense.customerName : <span>{t('list.table.general')}</span>}
                    </p>
                    <p><strong>{t('list.table.date')}:</strong> {new Date(expense.date).toLocaleDateString()}</p>
                </div>
                <Separator className="my-3" />
                <div className="text-sm text-right space-y-1 font-mono">
                    <p>{t('list.table.subtotal')}: {formatCurrency(expense.subtotal)}</p>
                    <p>{t('list.table.tax')}: {formatCurrency(expense.tax)}</p>
                    <p className="font-bold text-base">{t('form.totalLabel')}: {formatCurrency(expense.total)}</p>
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
                <TableHead>{t('list.table.description')}</TableHead>
                <TableHead>{t('list.table.category')}</TableHead>
                <TableHead>{t('list.table.date')}</TableHead>
                <TableHead className="text-right">{t('list.table.subtotal')}</TableHead>
                <TableHead className="text-right">{t('list.table.tax')}</TableHead>
                <TableHead className="text-right">{t('list.table.total')}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? renderSkeletons(5, false) : expenses.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                    {t('list.noExpenses')}
                    </TableCell>
                </TableRow>
                ) : (
                expenses.map((expense) => (
                    <TableRow key={expense.expenseId}>
                    <TableCell className="font-medium">
                        {expense.customerName ? expense.customerName : <span className="text-muted-foreground">{t('list.table.general')}</span>}
                    </TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>
                        <Badge variant="secondary">{expense.category}</Badge>
                    </TableCell>
                    <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(expense.subtotal)}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(expense.tax)}</TableCell>
                    <TableCell className="text-right font-mono font-bold">{formatCurrency(expense.total)}</TableCell>
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
