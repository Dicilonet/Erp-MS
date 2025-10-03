'use client';

import { Button } from '@/components/ui/button';
import { Bus, Ship } from 'lucide-react';

export function HeroSection() {
  return (
    <header className="relative flex h-[70vh] min-h-[500px] flex-col items-center justify-center text-center text-white">
      <div className="absolute inset-0 bg-black/50 z-10" />
      <img
        src="https://images.unsplash.com/photo-1533106418989-88406e751cae?q=80&w=1887&auto=format&fit=crop"
        alt="Autobús turístico en una ciudad europea"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="relative z-20 flex flex-col items-center px-4">
        <div className="mb-4 flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
          <Bus className="h-5 w-5" />
          <span className="font-semibold">City Explorer Tours</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-2xl sm:text-5xl md:text-6xl">
          Descubre la Ciudad desde una Nueva Perspectiva
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-200 drop-shadow-lg">
          Súbete a nuestros tours y vive una experiencia única recorriendo los lugares más emblemáticos con guías expertos y la máxima comodidad.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild className="bg-sky-600 hover:bg-sky-700">
            <a href="#booking">Reservar Tour</a>
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
            <a href="#tours">Ver Rutas</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
