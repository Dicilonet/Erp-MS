'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

const brands = [
  { name: 'Brand A', logo: 'https://placehold.co/150x50/white/black?text=BRAND+A' },
  { name: 'Brand B', logo: 'https://placehold.co/150x50/black/white?text=BRAND+B' },
  { name: 'Brand C', logo: 'https://placehold.co/150x50/white/black?text=BRAND+C' },
  { name: 'Brand D', logo: 'https://placehold.co/150x50/black/white?text=BRAND+D' },
  { name: 'Brand E', logo: 'https://placehold.co/150x50/white/black?text=BRAND+E' },
  { name: 'Brand F', logo: 'https://placehold.co/150x50/black/white?text=BRAND+F' },
];

export function BrandsGallery() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Primeras Marcas</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Trabajamos con los fabricantes más reconocidos para ofrecerte calidad y diseño.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {brands.map((brand) => (
            <div key={brand.name} className="flex justify-center">
              <Image src={brand.logo} alt={brand.name} width={150} height={50} className="object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
