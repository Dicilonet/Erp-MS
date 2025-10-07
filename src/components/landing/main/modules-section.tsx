'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, FolderKanban, BarChart, FileText, Receipt, Mail, Briefcase, Zap, Leaf, BrainCircuit, ShieldCheck, FolderSync } from 'lucide-react';

const modules = [
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Gestión de Clientes (CRM)",
    description: "Tu centro de inteligencia de clientes, desde la prospección hasta la fidelización.",
  },
  {
    icon: <FolderKanban className="h-8 w-8 text-primary" />,
    title: "Gestión de Proyectos",
    description: "Planifica, ejecuta y supervisa todos tus proyectos con tableros Kanban visuales.",
  },
  {
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    title: "Marketing Inteligente",
    description: "Crea campañas, gestiona contenido y encuentra nuevos clientes con Geomarketing.",
  },
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: "Ofertas y Artículos",
    description: "Administra tu catálogo de productos/servicios y genera presupuestos profesionales.",
  },
  {
    icon: <Receipt className="h-8 w-8 text-primary" />,
    title: "Gestión de Gastos con IA",
    description: "Digitaliza tus facturas con un solo clic gracias a la extracción de datos por IA.",
  },
  {
    icon: <Mail className="h-8 w-8 text-primary" />,
    title: "Comunicaciones Unificadas",
    description: "Envía correos electrónicos y comunícate con tu equipo sin salir de la plataforma.",
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Automatización y Conexiones",
    description: "Integra tus herramientas favoritas y automatiza flujos de trabajo complejos.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "Gestión de Equipo y Permisos",
    description: "Controla quién accede a qué módulo con un sistema de roles flexible y seguro.",
  },
];

export function ModulesSection() {
  return (
    <section id="modules" className="py-16 lg:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Un Módulo para Cada Necesidad
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            M&SOLUTIONS se adapta a ti. Explora algunas de nuestras funcionalidades clave.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((module) => (
            <Card key={module.title} className="hover:shadow-lg hover:-translate-y-1 transition-transform">
              <CardHeader>
                <div className="flex items-center gap-4">
                  {module.icon}
                  <CardTitle>{module.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{module.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
