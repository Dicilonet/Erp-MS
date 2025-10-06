'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Zap, ShieldCheck, BrainCircuit, BarChart } from 'lucide-react';

const features = [
  {
    icon: <Zap className="h-8 w-8 text-indigo-400" />,
    title: "Automatización Inteligente",
    description: "Ahorra tiempo y recursos automatizando tareas repetitivas con nuestros flujos de trabajo basados en IA.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-indigo-400" />,
    title: "Seguridad de Nivel Empresarial",
    description: "Protegemos tus datos con encriptación de extremo a extremo y los más altos estándares de seguridad.",
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-indigo-400" />,
    title: "IA Integrada",
    description: "Nuestros modelos de IA analizan tus datos para ofrecerte insights y predicciones que impulsan tu negocio.",
  },
    {
    icon: <BarChart className="h-8 w-8 text-indigo-400" />,
    title: "Analíticas Avanzadas",
    description: "Visualiza tus KPIs en tiempo real con dashboards personalizables y reportes automáticos.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">Construido para el Futuro</h2>
          <p className="mt-2 text-lg text-gray-400">
            La plataforma que escala con tu negocio.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="p-6 text-center bg-gray-800 border-gray-700 hover:bg-gray-700/50 hover:border-indigo-500/50 transition-all">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
