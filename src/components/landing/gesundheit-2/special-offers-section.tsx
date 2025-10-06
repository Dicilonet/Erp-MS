'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tag } from 'lucide-react';

const offers = [
  { 
    title: "Revisión Auditiva + Limpieza", 
    price: "GRATIS", 
    description: "Tu primera consulta incluye un test completo y una limpieza profesional de tus audífonos actuales." 
  },
  { 
    title: "Descuento para Parejas", 
    price: "-20%", 
    description: "Si vienes con tu pareja y ambos necesitáis audífonos, os aplicamos un 20% de descuento en el segundo par." 
  },
  { 
    title: "Plan Renove", 
    price: "Hasta 300€", 
    description: "Trae tus audífonos antiguos y te descontamos hasta 300€ en la compra de un nuevo par de última generación." 
  },
];

export function SpecialOffersSection() {
    return (
        <section id="offers" className="py-16 lg:py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight">Ofertas Especiales</h2>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Promociones exclusivas para cuidar de tu salud auditiva.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {offers.map((offer) => (
                        <Card key={offer.title} className="flex flex-col text-center">
                            <CardHeader>
                                <div className="mx-auto bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                                  <span className="text-xl font-bold">{offer.price}</span>
                                </div>
                                <CardTitle>{offer.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-muted-foreground">{offer.description}</p>
                            </CardContent>
                             <CardFooter>
                                <Button asChild className="w-full bg-sky-600 hover:bg-sky-700">
                                    <a href="#booking">Pedir Cita</a>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
