'use client';

import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export function FleetGallerySection() {
  const images = [
    { src: 'https://images.unsplash.com/photo-1605710331818-65485458fb2b?q=80&w=1770&auto=format&fit=crop', alt: 'Flota de camiones en aparcamiento' },
    { src: 'https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?q=80&w=1770&auto=format&fit=crop', alt: 'Interior de un almacén logístico' },
    { src: 'https://images.unsplash.com/photo-1568442258434-617a23b10b4f?q=80&w=1770&auto=format&fit=crop', alt: 'Contenedores de carga en un puerto' },
    { src: 'https://images.unsplash.com/photo-1613606233499-270582236e7a?q=80&w=1854&auto=format&fit=crop', alt: 'Carretilla elevadora moviendo mercancía' },
    { src: 'https://images.unsplash.com/photo-1587151722514-4e2079165609?q=80&w=1770&auto=format&fit=crop', alt: 'Camión de reparto en la ciudad' },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Nuestra Infraestructura</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Equipos modernos para un servicio eficiente y seguro.</p>
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
