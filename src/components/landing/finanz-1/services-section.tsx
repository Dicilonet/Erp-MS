'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { PiggyBank, Landmark, LineChart, Home, ShieldCheck } from 'lucide-react';

const services = [
  {
    icon: <PiggyBank className="h-10 w-10 text-blue-600" />,
    title: "Planificación de Jubilación",
    description: "Diseñamos un plan a medida para que disfrutes de tu retiro con total tranquilidad.",
  },
  {
    icon: <LineChart className="h-10 w-10 text-blue-600" />,
    title: "Asesoría de Inversiones",
    description: "Maximizamos tus rendimientos con carteras diversificadas y adaptadas a tu perfil de riesgo.",
  },
  {
    icon: <Landmark className="h-10 w-10 text-blue-600" />,
    title: "Gestión de Patrimonio",
    description: "Protegemos y hacemos crecer tu patrimonio para las futuras generaciones.",
  },
  {
    icon: <Home className="h-10 w-10 text-blue-600" />,
    title: "Hipotecas y Financiación",
    description: "Te ayudamos a encontrar las mejores condiciones para la compra de tu vivienda.",
  },
   {
    icon: <ShieldCheck className="h-10 w-10 text-blue-600" />,
    title: "Planificación de Seguros",
    description: "Aseguramos tu futuro y el de tu familia ante cualquier imprevisto.",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Nuestros Servicios Financieros</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Soluciones integrales para cada etapa de tu vida económica.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
