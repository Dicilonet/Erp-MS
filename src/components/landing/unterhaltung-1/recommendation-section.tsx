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
    <section id="recommend" className="py-16 lg:py-24 bg-gray-800">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Card className="shadow-2xl bg-gray-900 border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-white">Comparte la Emoción</CardTitle>
            <CardDescription className="text-lg text-gray-300">
              Invita a tus amigos a vivir esta experiencia. Si compran su entrada a través de tu recomendación, ambos recibiréis una sorpresa exclusiva.
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
