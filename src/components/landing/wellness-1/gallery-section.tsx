'use client';

import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export function GallerySection() {
  const images = [
    { src: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=1287&auto=format&fit=crop', alt: 'Cabina de masaje con luz tenue' },
    { src: 'https://images.unsplash.com/photo-1616394584738-65a4141506a3?q=80&w=1287&auto=format&fit=crop', alt: 'Detalle de toallas y flores' },
    { src: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1287&auto=format&fit=crop', alt: 'Piedras calientes apiladas' },
    { src: 'https://images.unsplash.com/photo-1512290923902-8a9f31c83659?q=80&w=1287&auto=format&fit=crop', alt: 'Aceites esenciales y velas' },
    { src: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1160&auto=format&fit=crop', alt: 'Persona disfrutando de un masaje facial' },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Nuestras Instalaciones</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Un espacio creado para tu total relajación y confort.</p>
        </div>
        <Carousel className="w-full mt-12" opts={{ align: 'start', loop: true }}>
          <CarouselContent className="-ml-4">
            {images.map((image, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden group">
                  <div className="relative h-80">
                    <img
                      src={image.src}
                      alt={image.alt}
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
