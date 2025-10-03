
'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Carrot, Apple, Wheat, Milk } from 'lucide-react';

const products = [
  {
    icon: <Carrot className="h-10 w-10 text-emerald-600" />,
    title: "Verduras de Temporada",
    description: "Directas de la huerta, llenas de nutrientes y sabor auténtico.",
  },
  {
    icon: <Apple className="h-10 w-10 text-emerald-600" />,
    title: "Frutas Frescas",
    description: "Una explosión de dulzura y vitaminas para empezar bien el día.",
  },
  {
    icon: <Wheat className="h-10 w-10 text-emerald-600" />,
    title: "Pan Artesanal",
    description: "Elaborado con masa madre y horneado a diario para ti.",
  },
  {
    icon: <Milk className="h-10 w-10 text-emerald-600" />,
    title: "Productos Locales",
    description: "Quesos, embutidos y conservas de productores de confianza.",
  },
];

export function ProductsSection() {
  return (
    <section id="products" className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Lo Mejor de Nuestra Tierra</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Calidad y frescura que se notan en cada bocado.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Card key={product.title} className="p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="flex justify-center mb-4">{product.icon}</div>
              <h3 className="text-lg font-semibold">{product.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
