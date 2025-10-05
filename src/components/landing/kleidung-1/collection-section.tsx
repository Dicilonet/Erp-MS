'use client';

import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export function CollectionSection() {
  const images = [
    { src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1770&auto=format&fit=crop', alt: 'Modelo con look de verano' },
    { src: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1887&auto=format&fit=crop', alt: 'Look urbano y moderno' },
    { src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop', alt: 'Estilo casual chic' },
    { src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1770&auto=format&fit=crop', alt: 'Accesorios de moda' },
    { src: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1887&auto=format&fit=crop', alt: 'Moda masculina elegante' },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Última Colección</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Descubre las tendencias que definen la temporada.</p>
        </div>
        <Carousel className="w-full mt-12" opts={{ align: 'start', loop: true }}>
          <CarouselContent className="-ml-4">
            {images.map((image, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden group">
                  <div className="relative h-96">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      layout="fill"
                      objectFit="cover"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                     <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-lg font-semibold drop-shadow-md">{image.alt}</h3>
                    </div>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 ml-4 bg-white/80 hover:bg-white text-gray-800 border-gray-300" />
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 mr-4 bg-white/80 hover:bg-white text-gray-800 border-gray-300" />
        </Carousel>
      </div>
    </section>
  );
}
