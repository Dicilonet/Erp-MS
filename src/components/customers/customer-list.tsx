
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app, db } from '@/lib/firebase';
import { useAuth } from '@/components/auth-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RefreshCw, PlusCircle, Trash2 } from 'lucide-react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import type { Customer } from '@/lib/types';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CreateCustomerForm } from '@/components/create-customer-form';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


// Usamos el tipo Customer de types.ts para consistencia
interface ErpCustomer extends Customer {
    id: string; // compatibility with old logic
}

export function CustomerList() {
    const { user, isSuperadmin } = useAuth();
    const [customers, setCustomers] = useState<ErpCustomer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isCleaning, setIsCleaning] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const { toast } = useToast();

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
            setCustomers(customersData.sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime()));
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

    // Función para el botón de SINCRONIZAR
    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const functions = getFunctions(app, 'europe-west1');
            const syncCustomers = httpsCallable(functions, 'syncNewCustomersFromWebsite');
            const result = await syncCustomers();
            const data = result.data as { success: boolean, newCount: number };

            toast({
                title: 'Sincronización Completa',
                description: `Se han añadido ${data.newCount} nuevos clientes. La lista se actualizará en breve.`,
            });
            
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error de Sincronización', description: error.message });
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
                    title: 'Limpieza Completada',
                    description: result.data.message,
                });
            } else {
                 throw new Error(result.data.message || "Ocurrió un error desconocido durante la limpieza.");
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error en la Limpieza', description: error.message });
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
                title: 'Cliente Eliminado',
                description: `El cliente "${customerName}" ha sido eliminado permanentemente.`,
            });
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error al Eliminar', description: error.message });
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
    
    const renderSkeletons = (isMobile: boolean) => {
        const count = isMobile ? 3 : 5;
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


    return (
        <>
            <Card>
                <CardHeader className="flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle>Clientes en el ERP</CardTitle>
                        <CardDescription>Esta es la lista de clientes actualmente en tu sistema.</CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                        {isSuperadmin && (
                            <Button onClick={handleCleanup} variant="outline" disabled={isCleaning} className="w-full">
                                {isCleaning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                Limpiar Duplicados
                            </Button>
                        )}
                        <Button onClick={handleSync} variant="outline" disabled={isSyncing} className="w-full">
                            {isSyncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                            Sincronizar Nuevos
                        </Button>
                        <CreateCustomerForm>
                            <div className="flex items-center w-full">
                               <PlusCircle className="mr-2 h-4 w-4" />
                               Añadir Cliente
                            </div>
                        </CreateCustomerForm>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {isLoading ? renderSkeletons(3, true) : customers.length === 0 ? (
                             <p className="text-center text-muted-foreground py-10">No hay clientes. Sincroniza o añade uno.</p>
                        ) : customers.map(customer => (
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
                                    <p><strong>Ubicación:</strong> {customer.location}</p>
                                    <p><strong>Asignado a:</strong> {customer.assignedTo || 'Sin asignar'}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/customers/${customer.customerId}`} passHref className="flex-1">
                                        <Button variant="outline" className="w-full">
                                            Ver Panel
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
                                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                    <AlertDialogDescription>Esta acción no se puede deshacer. Esto eliminará permanentemente al cliente "{customer.name}" y todos sus datos asociados.</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(customer.customerId, customer.name)}>Eliminar</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre del Negocio</TableHead>
                                    <TableHead>Categoría</TableHead>
                                    <TableHead>Ubicación</TableHead>
                                    <TableHead>Asignado a</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {isLoading ? renderSkeletons(5, false) : customers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            No hay clientes en el ERP. Sincroniza para empezar.
                                        </TableCell>
                                    </TableRow>
                                ) : customers.map((customer) => (
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
                                        <TableCell>{customer.assignedTo || 'Sin asignar'}</TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/customers/${customer.customerId}`} passHref>
                                                <Button variant="outline" size="sm">
                                                    Ver Panel
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
                                                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                            <AlertDialogDescription>Esta acción no se puede deshacer. Esto eliminará permanentemente al cliente "{customer.name}" y todos sus datos asociados (ofertas, interacciones, etc.).</AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(customer.customerId, customer.name)} className="bg-destructive hover:bg-destructive/90">Confirmar Eliminación</AlertDialogAction>
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
        </>
    );
}
