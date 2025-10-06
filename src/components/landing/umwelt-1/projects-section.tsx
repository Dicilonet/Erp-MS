'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const projects = [
  {
    title: "Reforestación del Amazonas",
    description: "Nuestro objetivo es plantar un millón de árboles en áreas deforestadas para restaurar el pulmón del planeta.",
    progress: 75,
    imageUrl: "https://images.unsplash.com/photo-1590153716820-1a2a5b045e55?q=80&w=1770&auto=format&fit=crop",
  },
  {
    title: "Océanos Sin Plástico",
    description: "Organizamos jornadas de limpieza en costas y promovemos la reducción de plásticos de un solo uso.",
    progress: 45,
    imageUrl: "https://images.unsplash.com/photo-1574932014167-96c215325c99?q=80&w=1770&auto=format&fit=crop",
  },
  {
    title: "Energía Limpia para Comunidades",
    description: "Instalamos paneles solares en comunidades rurales sin acceso a la red eléctrica.",
    progress: 90,
    imageUrl: "https://images.unsplash.com/photo-1509391366360-2e9597841276?q=80&w=1772&auto=format&fit=crop",
  },
];

export function ProjectsSection() {
  return (
    <section id="projects" className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Nuestros Proyectos en Marcha</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Así es como convertimos las donaciones en acciones concretas.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.title} className="flex flex-col overflow-hidden">
              <div className="relative h-56 w-full">
                <Image src={project.imageUrl} alt={project.title} layout="fill" objectFit="cover" />
              </div>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                 <div className="space-y-2">
                    <p className="text-sm font-medium">{project.progress}% completado</p>
                    <Progress value={project.progress} />
                 </div>
              </CardContent>
              <CardFooter>
                 <Button variant="outline" className="w-full">Ver Detalles del Proyecto</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
