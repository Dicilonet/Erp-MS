'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Truck, Ship, Warehouse, PackageCheck } from 'lucide-react';

const services = [
  {
    icon: <Truck className="h-10 w-10 text-blue-600" />,
    title: "Transporte Terrestre",
    description: "Flota moderna para entregas nacionales y europeas, con seguimiento en tiempo real.",
  },
  {
    icon: <Ship className="h-10 w-10 text-blue-600" />,
    title: "Carga Marítima y Aérea",
    description: "Soluciones globales para importación y exportación, gestionando todo el proceso aduanero.",
  },
  {
    icon: <Warehouse className="h-10 w-10 text-blue-600" />,
    title: "Logística de Almacenamiento",
    description: "Almacenes estratégicamente ubicados para la gestión de inventario, picking y packing.",
  },
  {
    icon: <PackageCheck className="h-10 w-10 text-blue-600" />,
    title: "Distribución de Última Milla",
    description: "Optimizamos la entrega final a su cliente con rutas eficientes y un servicio confiable.",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Nuestras Soluciones Logísticas</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Un servicio integral para cada eslabón de su cadena de suministro.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card key={service.title} className="p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="flex justify-center mb-4">{service.icon}</div>
              <h3 className="text-lg font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
