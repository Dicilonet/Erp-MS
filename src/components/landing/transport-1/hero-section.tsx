'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Truck } from 'lucide-react';

export function HeroSection() {
  return (
    <header className="relative flex h-[70vh] min-h-[500px] flex-col items-center justify-center text-center text-white">
      <div className="absolute inset-0 bg-black/60 z-10" />
      <img
        src="https://images.unsplash.com/photo-1577985051167-3d7393479796?q=80&w=1849&auto=format&fit=crop"
        alt="Camión en una carretera al atardecer"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="relative z-20 flex flex-col items-center px-4">
        <div className="mb-4 flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
          <Truck className="h-5 w-5" />
          <span className="font-semibold">Global Transports</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-2xl sm:text-5xl md:text-6xl">
          Logística Inteligente, Entregas Puntuales
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-200 drop-shadow-lg">
          Su socio de confianza para soluciones de transporte y logística a nivel nacional e internacional. Eficiencia, seguridad y tecnología a su servicio.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
            <a href="#quote">Solicitar Cotización</a>
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
            <a href="#services">Nuestros Servicios</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
