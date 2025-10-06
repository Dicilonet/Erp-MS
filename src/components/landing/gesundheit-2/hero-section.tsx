'use client';

import { Button } from '@/components/ui/button';
import { Ear } from 'lucide-react';

export function HeroSection() {
  return (
    <header className="relative flex h-[70vh] min-h-[500px] flex-col items-center justify-center text-center text-white">
      <div className="absolute inset-0 bg-black/40 z-10" />
      <img
        src="https://images.unsplash.com/photo-1612166163640-138fe97585e3?q=80&w=1770&auto=format&fit=crop"
        alt="Persona mayor sonriendo con un audífono"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="relative z-20 flex flex-col items-center px-4">
        <div className="mb-4 flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
          <Ear className="h-5 w-5" />
          <span className="font-semibold">Akustik Zentrum</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-2xl sm:text-5xl md:text-6xl">
          Vuelve a Escuchar la Vida
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-200 drop-shadow-lg">
          Con la tecnología más avanzada y un trato cercano, te ayudamos a redescubrir el mundo del sonido.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild className="bg-sky-600 hover:bg-sky-700">
            <a href="#booking">Reservar Cita Auditiva</a>
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
            <a href="#services">Nuestros Servicios</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
