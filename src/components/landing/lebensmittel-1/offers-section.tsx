
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tag } from 'lucide-react';

const offers = [
  { title: "Cesta de Verduras de Temporada", price: "15€", description: "Una selección semanal de nuestras mejores verduras de la huerta." },
  { title: "Pack Desayuno", price: "12€", description: "Pan artesanal, mermelada casera, y zumo de naranja natural." },
  { title: "Oferta de Frutas", price: "3x2", description: "Lleva 3 kilos de fruta de temporada y paga solo 2." },
];

export function OffersSection() {
    return (
        <section id="offers" className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight">Ofertas de la Semana</h2>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Productos frescos a precios irresistibles.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {offers.map((offer) => (
                        <Card key={offer.title} className="flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>{offer.title}</CardTitle>
                                    <div className="bg-emerald-600 text-white font-bold py-1 px-3 rounded-full text-sm">
                                        {offer.price}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-muted-foreground">{offer.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
