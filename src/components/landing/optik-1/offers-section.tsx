'use client';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tag, Users, Glasses } from 'lucide-react';

const offers = [
  { 
    icon: <Glasses className="h-10 w-10 text-cyan-600"/>,
    title: "Segundas Gafas al 50%", 
    description: "En la compra de tus gafas graduadas, llévate el segundo par a mitad de precio." 
  },
  { 
    icon: <Tag className="h-10 w-10 text-cyan-600"/>,
    title: "Descuento Estudiantes", 
    description: "Presenta tu carnet de estudiante y obtén un 20% de descuento en monturas." 
  },
  { 
    icon: <Users className="h-10 w-10 text-cyan-600"/>,
    title: "Plan Familiar", 
    description: "Revisión visual gratuita para toda la familia por la compra de dos o más gafas." 
  },
];

export function OffersSection() {
    return (
        <section id="offers" className="py-16 lg:py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight">Ofertas Permanentes</h2>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Disfruta de ventajas exclusivas todo el año.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {offers.map((offer) => (
                        <Card key={offer.title} className="flex flex-col text-center p-6 hover:shadow-xl hover:-translate-y-1 transition-all">
                            <div className="flex justify-center mb-4">{offer.icon}</div>
                            <CardHeader className="p-0">
                                <CardTitle>{offer.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow mt-2">
                                <p className="text-muted-foreground">{offer.description}</p>
                            </CardContent>
                             <CardFooter className="p-0 mt-4">
                                <Button asChild className="w-full" variant="outline">
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
