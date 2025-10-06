'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const products = [
  {
    title: "Flow CRM",
    description: "Un CRM inteligente que predice las necesidades de tus clientes y automatiza el seguimiento.",
    features: ["Análisis de Sentimiento", "Lead Scoring con IA", "Informes Automatizados"],
  },
  {
    title: "Nexus Automate",
    description: "Conecta tus aplicaciones y crea flujos de trabajo complejos sin escribir una sola línea de código.",
    features: ["+500 Conectores", "Constructor Visual", "Ejecuciones ilimitadas"],
  },
  {
    title: "Quantum BI",
    description: "Una plataforma de Business Intelligence que convierte tus datos brutos en decisiones estratégicas.",
    features: ["Dashboards en tiempo real", "Consultas en lenguaje natural", "Modelos predictivos"],
  },
];

export function ProductsSection() {
  return (
    <section id="products" className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-white">Nuestra Suite de Productos</h2>
          <p className="mt-2 text-lg text-gray-400">Herramientas diseñadas para trabajar juntas y potenciar tu crecimiento.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.title} className="bg-gray-800 border-gray-700 flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl text-white">{product.title}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2 text-sm">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full text-indigo-400 hover:text-indigo-300">
                  Saber más <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
