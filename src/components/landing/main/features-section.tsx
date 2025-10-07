'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, ShieldCheck, BrainCircuit, Users } from 'lucide-react';

const features = [
  {
    icon: <Zap className="h-10 w-10 text-primary" />,
    title: 'Automatización Inteligente',
    description: 'Ahorra tiempo y recursos automatizando tareas repetitivas con flujos de trabajo basados en IA.',
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: 'CRM Unificado',
    description: 'Gestiona la relación con tus clientes, desde la prospección hasta el soporte postventa, todo en un solo lugar.',
  },
  {
    icon: <BrainCircuit className="h-10 w-10 text-primary" />,
    title: 'Inteligencia Integrada',
    description: 'Nuestros modelos de IA analizan tus datos para ofrecerte insights y predicciones que impulsan tu negocio.',
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: 'Seguridad de Nivel Empresarial',
    description: 'Protegemos tus datos con encriptación de extremo a extremo y los más altos estándares de seguridad.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Todo lo que tu Negocio Necesita, y Más
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Desde la gestión de clientes hasta la automatización de marketing, M&SOLUTIONS centraliza tus herramientas esenciales.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="flex justify-center items-center h-20">
                {feature.icon}
              </div>
              <h3 className="mt-6 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-base text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
