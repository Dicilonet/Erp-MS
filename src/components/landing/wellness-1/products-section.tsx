'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Droplets, Gift } from 'lucide-react';

export function ProductsSection() {
    const products = [
        {
            icon: <Droplets className="h-8 w-8 text-teal-600" />,
            name: "Aceites Esenciales Puros",
            description: "Una selección de aceites orgánicos para prolongar la relajación en casa.",
            img: "https://images.unsplash.com/photo-1583317133014-a34f7de55a6d?q=80&w=800"
        },
        {
            icon: <Gift className="h-8 w-8 text-teal-600" />,
            name: "Tarjetas de Regalo",
            description: "Regala una experiencia de bienestar inolvidable a tus seres queridos.",
            img: "https://images.unsplash.com/photo-1591122720241-94e859b58394?q=80&w=800"
        },
    ];

    return (
        <section id="products" className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight">Lleva el Bienestar a Casa</h2>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Nuestros productos recomendados para tu cuidado personal.</p>
                </div>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {products.map(product => (
                        <Card key={product.name} className="overflow-hidden group">
                            <div className="h-64 overflow-hidden">
                                <img src={product.img} alt={product.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                            </div>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4 mb-3">
                                    {product.icon}
                                    <h3 className="text-xl font-bold">{product.name}</h3>
                                </div>
                                <p className="text-muted-foreground">{product.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
