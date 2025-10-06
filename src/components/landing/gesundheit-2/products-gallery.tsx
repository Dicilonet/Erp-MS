'use client';

import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export function ProductsGallery() {
  const images = [
    { src: 'https://images.unsplash.com/photo-1618504333200-8e4334591783?q=80&w=1770&auto=format&fit=crop', alt: 'Audífono discreto en la oreja' },
    { src: 'https://images.unsplash.com/photo-1590602847833-e5159ef9164c?q=80&w=1770&auto=format&fit=crop', alt: 'Audífono moderno sobre una mesa' },
    { src: 'https://images.unsplash.com/photo-1618504333200-8e4334591783?q=80&w=1770&auto=format&fit=crop', alt: 'Persona usando un audífono invisible' },
    { src: 'https://images.unsplash.com/photo-157982ca822369-123999468994?q=80&w=1848&auto=format&fit=crop', alt: 'Estuche de carga para audífonos' },
    { src: 'https://images.unsplash.com/photo-1517436034-368715b002f2?q=80&w=1772&auto=format&fit=crop', alt: 'Audífonos con conexión Bluetooth' },
  ];

  return (
    <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Tecnología que no se ve, pero se siente</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Descubre nuestra gama de audífonos discretos, potentes y cómodos.</p>
        </div>
        <Carousel className="w-full mt-12" opts={{ align: 'start', loop: true }}>
          <CarouselContent className="-ml-4">
            {images.map((image, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden group">
                  <div className="relative h-80">
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
