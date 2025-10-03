
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export function RoomShowcase() {
  const rooms = [
    { name: 'Suite Presidencial', img: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800' },
    { name: 'Habitación Doble Deluxe', img: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=800' },
    { name: 'Habitación Individual Confort', img: 'https://images.unsplash.com/photo-1590490359854-dfba59ee83f8?q=80&w=800' },
    { name: 'Suite Familiar', img: 'https://images.unsplash.com/photo-1598035411623-0421223861c2?q=80&w=800' },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Nuestras Habitaciones</h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Espacios diseñados para su máximo confort.</p>
        </div>
        <Carousel className="w-full mt-12" opts={{ align: 'start', loop: true }}>
          <CarouselContent className="-ml-4">
            {rooms.map((room, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden group">
                  <div className="relative h-80">
                    <img
                      src={room.img}
                      alt={room.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{room.name}</h3>
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
