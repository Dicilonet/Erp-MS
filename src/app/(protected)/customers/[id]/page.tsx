
'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, collection, onSnapshot } from 'firebase/firestore';
import { useParams, notFound } from 'next/navigation';
import { db } from '@/lib/firebase';
import type { Customer, CustomerService, ServiceStatus } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Calendar, Shield, ClipboardList, KeyRound, FileText, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { InteractionLog } from '@/components/interaction-log';

const statusColors: { [key in ServiceStatus]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  'Pendiente': 'secondary',
  'En Progreso': 'default',
  'Completado': 'outline',
  'Agendado': 'default',
  'Activo': 'default',
};


export default function CustomerDetailPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [services, setServices] = useState<CustomerService[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (!id) return;
    
    const fetchCustomer = async () => {
      const docRef = doc(db, 'customers', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCustomer({ ...docSnap.data(), customerId: docSnap.id } as Customer);
      } else {
        notFound();
      }
    };

    fetchCustomer();
  }, [id]);

  useEffect(() => {
    if (!customer) return;

    const servicesCollection = collection(db, 'customers', customer.customerId, 'customerServices');
    const unsubscribe = onSnapshot(servicesCollection, (snapshot) => {
      const servicesData = snapshot.docs.map(doc => doc.data() as CustomerService);
      setServices(servicesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching services: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [customer]);
  
  if (loading || !customer) {
    return (
        <>
            <Skeleton className="h-10 w-1/2 mt-4" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                     <Skeleton className="h-64 w-full" />
                     <Skeleton className="h-32 w-full" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
        </>
    );
  }

  const planNames: { [key: string]: string } = {
    'plan_privatkunde': 'Privatkunde',
    'plan_spender': 'Spender',
    'plan_einzelhandler': 'Einzelhändler',
    'plan_premium': 'Premium'
  };


  return (
    <>
      <div className="mt-4 sm:mt-0">
          <h1 className="text-3xl font-bold">{customer.name}</h1>
          <p className="text-muted-foreground">{customer.contactEmail}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Izquierda y Central */}
          <div className="lg:col-span-2 space-y-6">
              <InteractionLog customerId={customer.customerId} />

              <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2"><ClipboardList /> Entregables y Servicios del Plan</CardTitle>
                      <CardDescription>Seguimiento detallado de todas las obligaciones y servicios prometidos al cliente.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-4">
                          {services.length === 0 && <p className="text-muted-foreground">No hay servicios asociados a este plan.</p>}
                          {services.map(service => (
                              <div key={service.serviceId} className="p-4 rounded-lg border bg-secondary/30">
                                  <div className="flex justify-between items-start">
                                      <h4 className="font-semibold">{service.serviceName}</h4>
                                      <Badge variant={statusColors[service.status] || 'secondary'}>{service.status}</Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">Frecuencia: <span className="font-medium">{service.frequency}</span></p>
                                  {service.nextDueDate && (
                                       <p className="text-sm text-muted-foreground">Próxima entrega: <span className="font-medium">{new Date(service.nextDueDate).toLocaleDateString()}</span></p>
                                  )}
                                  {service.details.notes && (
                                      <p className="text-xs text-muted-foreground/80 mt-2 border-l-2 pl-2">{service.details.notes}</p>
                                  )}
                                  <div className="mt-2 text-right">
                                       <Button size="sm" variant="ghost">Actualizar</Button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </CardContent>
              </Card>
          </div>

          {/* Columna Derecha */}
          <div className="space-y-6">
              <Card>
                  <CardHeader>
                      <CardTitle>Información del Cliente</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                      <div className="flex items-center gap-3">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{customer.name}</span>
                      </div>
                       <div className="flex items-center gap-3">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <span>Plan: <strong>{planNames[customer.planId]}</strong></span>
                      </div>
                      <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Cliente desde: {new Date(customer.registrationDate).toLocaleDateString()}</span>
                      </div>
                      <Separator />
                      <h4 className="font-semibold pt-2">Responsable Interno</h4>
                      <div className="flex items-center gap-3">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{(customer.accountManager && customer.accountManager.userName) || 'No asignado'}</span>
                      </div>
                       <p className="text-xs text-muted-foreground pl-7">{(customer.accountManager && customer.accountManager.userEmail) || ''}</p>
                  </CardContent>
              </Card>
                            
              <Card className="border-destructive">
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-destructive"><KeyRound /> Datos Sensibles</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                          Acceso restringido solo a administradores. Contiene contraseñas o tokens.
                      </p>
                      <Button variant="destructive" disabled>
                          <AlertTriangle className="mr-2 h-4 w-4"/>
                          Mostrar Datos Sensibles
                      </Button>
                  </CardContent>
              </Card>
          </div>
      </div>
    </>
  );
}
