'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Leaf } from 'lucide-react';

export function HeroSection() {
  return (
    <header className="relative flex h-[70vh] min-h-[500px] flex-col items-center justify-center text-center text-white">
      <div className="absolute inset-0 bg-black/50 z-10" />
      <img
        src="https://images.unsplash.com/photo-1544161515-cfd836b08094?q=80&w=1740&auto=format&fit=crop"
        alt="Mujer recibiendo un masaje relajante"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="relative z-20 flex flex-col items-center px-4">
        <div className="mb-4 flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
          <Leaf className="h-5 w-5" />
          <span className="font-semibold">Oasis de Bienestar</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-2xl sm:text-5xl md:text-6xl">
          Reconecta con tu Paz Interior
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-200 drop-shadow-lg">
          Sumérgete en una experiencia de relajación profunda y renueva tu energía con nuestros masajes terapéuticos y tratamientos holísticos.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild className="bg-teal-600 hover:bg-teal-700">
            <a href="#contact">Reservar Masaje</a>
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
            <a href="#services">Ver Tratamientos</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
