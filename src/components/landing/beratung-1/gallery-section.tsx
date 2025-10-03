'use client';

import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export function GallerySection() {
  const images = [
    { src: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=1771&auto=format&fit=crop', alt: 'Retrato profesional del consultor' },
    { src: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1770&auto=format&fit=crop', alt: 'Sesión de coaching grupal' },
    { src: 'https://images.unsplash.com/photo-1521737852583-dc7f0a6efa12?q=80&w=1770&auto=format&fit=crop', alt: 'Oficina de consultoría moderna' },
    { src: 'https://images.unsplash.com/photo-1573496774439-c9a93a142c38?q=80&w=1770&auto=format&fit=crop', alt: 'Dando una conferencia' },
    { src: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1769&auto=format&fit=crop', alt: 'Reunión uno a uno' },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Nuestro Entorno</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Un espacio de confianza y profesionalismo.</p>
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
