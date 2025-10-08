
'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app, db } from '@/lib/firebase';
import { useAuth } from '@/components/auth-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RefreshCw, PlusCircle, Trash2, ArrowDown, ArrowUp, Search } from 'lucide-react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import type { Customer } from '@/lib/types';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CreateCustomerForm } from '@/components/create-customer-form';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';


// Usamos el tipo Customer de types.ts para consistencia
interface ErpCustomer extends Customer {
    id: string; // compatibility with old logic
}

export function CustomerList() {
    const { t } = useTranslation('customers');
    const { user, isSuperadmin } = useAuth();
    const [customers, setCustomers] = useState<ErpCustomer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isCleaning, setIsCleaning] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const { toast } = useToast();

    // Estados para filtros y ordenación
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterLocation, setFilterLocation] = useState('');
    const [filterAssignedTo, setFilterAssignedTo] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');


    // Función para cargar los clientes que YA ESTÁN en el ERP
    const fetchErpCustomers = useCallback(() => {
        if (!user) return;
        setIsLoading(true);
        const q = query(collection(db, "customers"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const customersData = querySnapshot.docs.map(doc => ({
                ...(doc.data() as Customer),
                id: doc.id,
                customerId: doc.id,
            })) as ErpCustomer[];
            setCustomers(customersData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching ERP customers: ", error);
            toast({ variant: 'destructive', title: 'Error', description: "No se pudieron cargar los clientes del ERP." });
            setIsLoading(false);
        });
        return unsubscribe;
    }, [toast, user]);


    // Carga inicial de clientes al montar la página
    useEffect(() => {
        const unsubscribe = fetchErpCustomers();
        return () => unsubscribe?.();
    }, [fetchErpCustomers]);

    // Lógica de filtrado y ordenación
    const filteredAndSortedCustomers = useMemo(() => {
        let filtered = customers.filter(c => 
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            c.category.toLowerCase().includes(filterCategory.toLowerCase()) &&
            c.location.toLowerCase().includes(filterLocation.toLowerCase()) &&
            (c.accountManager?.userName || t('list.table.unassigned')).toLowerCase().includes(filterAssignedTo.toLowerCase())
        );

        filtered.sort((a, b) => {
            let valA, valB;
            switch(sortBy) {
                case 'name':
                    valA = a.name;
                    valB = b.name;
                    break;
                case 'category':
                    valA = a.category;
                    valB = b.category;
                    break;
                case 'location':
                    valA = a.location;
                    valB = b.location;
                    break;
                case 'assignedTo':
                    valA = a.accountManager?.userName || '';
                    valB = b.accountManager?.userName || '';
                    break;
                default:
                    valA = a.name;
                    valB = b.name;
            }

            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [customers, searchTerm, filterCategory, filterLocation, filterAssignedTo, sortBy, sortDirection, t]);


    // Función para el botón de SINCRONIZAR
    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const functions = getFunctions(app, 'europe-west1');
            const syncCustomers = httpsCallable(functions, 'syncNewCustomersFromWebsite');
            const result = await syncCustomers();
            const data = result.data as { success: boolean, newCount: number };

            toast({
                title: t('list.toast.syncSuccessTitle'),
                description: t('list.toast.syncSuccessDescription', { count: data.newCount }),
            });
            
        } catch (error: any) {
            toast({ variant: 'destructive', title: t('list.toast.syncErrorTitle'), description: error.message });
        } finally {
            setIsSyncing(false);
        }
    };
    
    // Función para el botón de LIMPIAR DUPLICADOS
    const handleCleanup = async () => {
        setIsCleaning(true);
        try {
            const functions = getFunctions(app, 'europe-west1');
            const cleanupDuplicateCustomers = httpsCallable(functions, 'cleanupDuplicateCustomers');
            const result: any = await cleanupDuplicateCustomers();
            
            if (result.data.success) {
                 toast({
                    title: t('list.toast.cleanupSuccessTitle'),
                    description: t('list.toast.cleanupSuccessDescription', { count: result.data.deletedCount }),
                });
            } else {
                 throw new Error(result.data.message || "Ocurrió un error desconocido durante la limpieza.");
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: t('list.toast.cleanupErrorTitle'), description: error.message });
        } finally {
            setIsCleaning(false);
        }
    };
    
    const handleDelete = async (customerId: string, customerName: string) => {
        setIsDeleting(customerId);
        try {
            const functions = getFunctions(app, 'europe-west1');
            const deleteCustomerFunc = httpsCallable(functions, 'deleteCustomer');
            await deleteCustomerFunc({ customerId });
            toast({
                title: t('list.toast.deleteSuccessTitle'),
                description: t('list.toast.deleteSuccessDescription', { customerName }),
            });
        } catch (error: any) {
            toast({ variant: 'destructive', title: t('list.toast.deleteErrorTitle'), description: error.message });
        } finally {
            setIsDeleting(null);
        }
    };
    
    const getInitials = (name: string) => {
        if (!name) return '?';
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }
    
    const renderSkeletons = (count: number, isMobile: boolean) => {
        return Array.from({ length: count }).map((_, i) => (
            isMobile ? (
                <Card key={i} className="p-4 space-y-3">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    </div>
                    <Skeleton className="h-8 w-full" />
                </Card>
            ) : (
                 <TableRow key={i}>
                    <TableCell><div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-5 w-32" /></div></TableCell>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                </TableRow>
            )
        ));
    };

    if (isLoading) {
       return (
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <Skeleton className="h-10 w-64" />
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Skeleton className="h-10 w-full sm:w-36" />
                            <Skeleton className="h-10 w-full sm:w-36" />
                            <Skeleton className="h-10 w-full sm:w-36" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="hidden md:block border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead><Skeleton className="h-5 w-40" /></TableHead>
                                    <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                                    <TableHead><Skeleton className="h-5 w-28" /></TableHead>
                                    <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                                    <TableHead className="text-right"><Skeleton className="h-5 w-20" /></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                               {renderSkeletons(5, false)}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="md:hidden space-y-4">
                        {renderSkeletons(3, true)}
                    </div>
                </CardContent>
            </Card>
       );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="self-start">
                        <CardTitle>{t('list.title')}</CardTitle>
                        <CardDescription>{t('list.description')}</CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                        {isSuperadmin && (
                            <Button onClick={handleCleanup} variant="outline" disabled={isCleaning} className="w-full sm:w-auto">
                                {isCleaning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                {t('list.buttons.cleanup')}
                            </Button>
                        )}
                        <Button onClick={handleSync} variant="outline" disabled={isSyncing} className="w-full sm:w-auto">
                            {isSyncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                            {t('list.buttons.sync')}
                        </Button>
                         <CreateCustomerForm>
                            <Button className="w-full sm:w-auto">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                {t('list.buttons.add')}
                            </Button>
                        </CreateCustomerForm>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                 <div className="p-4 border-b">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Input placeholder={t('list.filter.name')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <Input placeholder={t('list.filter.category')} value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} />
                        <Input placeholder={t('list.filter.location')} value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} />
                        <Input placeholder={t('list.filter.assignedTo')} value={filterAssignedTo} onChange={(e) => setFilterAssignedTo(e.target.value)} />
                    </div>
                     <div className="flex items-center gap-4 mt-4">
                        <Label htmlFor="sort-by" className="text-sm">Ordenar por:</Label>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger id="sort-by" className="w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name">{t('list.table.name')}</SelectItem>
                                <SelectItem value="category">{t('list.table.category')}</SelectItem>
                                <SelectItem value="location">{t('list.table.location')}</SelectItem>
                                <SelectItem value="assignedTo">{t('list.table.assignedTo')}</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon" onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}>
                            {sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4 pt-4">
                    {filteredAndSortedCustomers.length === 0 ? (
                            <p className="text-center text-muted-foreground py-10">{t('list.noCustomers')}</p>
                    ) : filteredAndSortedCustomers.map(customer => (
                        <Card key={customer.id} className="p-4">
                            <div className="flex items-center gap-4 mb-4">
                                <Avatar>
                                    <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{customer.name}</p>
                                    <p className="text-sm text-muted-foreground">{customer.category}</p>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm mb-4">
                                <p><strong>{t('list.table.location')}:</strong> {customer.location}</p>
                                <p><strong>{t('list.table.assignedTo')}:</strong> {customer.accountManager?.userName || t('list.table.unassigned')}</p>
                            </div>
                            <div className="flex gap-2">
                                <Link href={`/customers/${customer.customerId}`} passHref className="flex-1">
                                    <Button variant="outline" className="w-full">
                                        {t('list.table.viewButton')}
                                    </Button>
                                </Link>
                                {isSuperadmin && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="icon" disabled={isDeleting === customer.customerId}>
                                                {isDeleting === customer.customerId ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>{t('list.deleteDialog.title')}</AlertDialogTitle>
                                                <AlertDialogDescription>{t('list.deleteDialog.description', { customerName: customer.name })}</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>{t('list.deleteDialog.cancel')}</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(customer.customerId, customer.name)}>{t('list.deleteDialog.confirm')}</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block pt-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('list.table.name')}</TableHead>
                                <TableHead>{t('list.table.category')}</TableHead>
                                <TableHead>{t('list.table.location')}</TableHead>
                                <TableHead>{t('list.table.assignedTo')}</TableHead>
                                <TableHead className="text-right">{t('list.table.actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {filteredAndSortedCustomers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        {t('list.noCustomers')}
                                    </TableCell>
                                </TableRow>
                            ) : filteredAndSortedCustomers.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                                            </Avatar>
                                            <span>{customer.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{customer.category}</TableCell>
                                    <TableCell>{customer.location}</TableCell>
                                    <TableCell>{customer.accountManager?.userName || t('list.table.unassigned')}</TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/customers/${customer.customerId}`} passHref>
                                            <Button variant="outline" size="sm">
                                                {t('list.table.viewButton')}
                                            </Button>
                                        </Link>
                                        {isSuperadmin && (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" disabled={isDeleting === customer.customerId} className="ml-2 text-destructive hover:text-destructive">
                                                            {isDeleting === customer.customerId ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>{t('list.deleteDialog.title')}</AlertDialogTitle>
                                                        <AlertDialogDescription>{t('list.deleteDialog.description', { customerName: customer.name })}</AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>{t('list.deleteDialog.cancel')}</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(customer.customerId, customer.name)} className="bg-destructive hover:bg-destructive/90">{t('list.deleteDialog.confirm')}</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
