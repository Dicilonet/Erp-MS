'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Eye, Ear } from 'lucide-react';

export function ProductsSection() {
    const products = [
        {
            icon: <Eye className="h-8 w-8 text-cyan-600" />,
            name: "Gafas de Diseño",
            description: "Últimas colecciones de las mejores marcas para una visión con estilo.",
            img: "https://images.unsplash.com/photo-1574258495973-f112a6a35a76?q=80&w=800"
        },
        {
            icon: <Ear className="h-8 w-8 text-cyan-600" />,
            name: "Audífonos Digitales",
            description: "Tecnología invisible y de alta fidelidad para que no te pierdas ningún sonido.",
            img: "https://images.unsplash.com/photo-1614324420839-a9a3f3604518?q=80&w=800"
        },
    ];

    return (
        <section id="products" className="py-16 lg:py-24">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight">Nuestros Productos</h2>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Tecnología y estilo para tu bienestar.</p>
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
