'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Palette, Music, Languages, Code, ChefHat, Atom } from 'lucide-react';

const courses = [
  {
    icon: <Palette className="h-10 w-10 text-blue-600" />,
    title: "Escuela de Arte",
    description: "Desarrolla tu creatividad con nuestros cursos de pintura, escultura y diseño digital.",
  },
  {
    icon: <Music className="h-10 w-10 text-blue-600" />,
    title: "Conservatorio de Música",
    description: "Aprende a tocar un instrumento o perfecciona tu técnica vocal con profesores expertos.",
  },
  {
    icon: <Languages className="h-10 w-10 text-blue-600" />,
    title: "Academia de Idiomas",
    description: "Clases dinámicas de inglés, alemán, francés y más, para todas las edades y niveles.",
  },
  {
    icon: <Code className="h-10 w-10 text-blue-600" />,
    title: "Bootcamps de Tecnología",
    description: "Cursos intensivos de programación, ciencia de datos y ciberseguridad.",
  },
   {
    icon: <ChefHat className="h-10 w-10 text-blue-600" />,
    title: "Escuela de Gastronomía",
    description: "Fórmate como chef profesional o disfruta de nuestros talleres de cocina amateur.",
  },
   {
    icon: <Atom className="h-10 w-10 text-blue-600" />,
    title: "Clases de Apoyo Escolar",
    description: "Refuerzo en matemáticas, ciencias y letras para primaria, secundaria y bachillerato.",
  },
];

export function CoursesSection() {
  return (
    <section id="courses" className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Nuestros Programas</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Una formación para cada pasión y cada objetivo profesional.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.title} className="p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="flex justify-center mb-4">{course.icon}</div>
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{course.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
