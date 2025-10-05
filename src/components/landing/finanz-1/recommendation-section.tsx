'use client';

import React from 'react';
import RecommendationFormForClient from '@/app/forms/embed/[clientId]/form-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface RecommendationSectionProps {
  clientId: string;
  products: { name: string; id?: string }[];
}

export function RecommendationSection({ clientId, products }: RecommendationSectionProps) {
  return (
    <section id="recommend" className="py-16 lg:py-24 bg-gray-100 dark:bg-gray-900/50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Recomienda y Gana</CardTitle>
            <CardDescription className="text-lg">
              Si estás satisfecho con nuestro asesoramiento, compártelo con tus contactos. Ayúdales a tomar el control de sus finanzas y recibe una bonificación por cada nuevo cliente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecommendationFormForClient clientId={clientId} products={products} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
