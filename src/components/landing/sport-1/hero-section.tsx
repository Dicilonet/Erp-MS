
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Dumbbell } from 'lucide-react';

export function HeroSection() {
  return (
    <header className="relative flex h-[75vh] min-h-[500px] flex-col items-center justify-center text-center text-white">
      <div className="absolute inset-0 bg-black/60 z-10" />
      <video
        src="https://videos.pexels.com/video-files/3864428/3864428-hd.mp4"
        autoPlay
        loop
        muted
        className="absolute z-0 h-full w-full object-cover"
      />
      <div className="relative z-20 flex flex-col items-center px-4">
         <div className="mb-4 flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
          <Dumbbell className="h-5 w-5 text-amber-400" />
          <span className="font-semibold">Fit-Center</span>
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-2xl sm:text-6xl md:text-7xl">
          FORJA TU MEJOR VERSIÓN
        </h1>
        <p className="mt-4 max-w-2xl text-xl text-gray-200 drop-shadow-lg">
          Instalaciones de primer nivel, entrenadores expertos y una comunidad que te impulsa a superar tus límites.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild className="bg-amber-500 hover:bg-amber-600 text-black text-lg py-6 px-8">
            <a href="#trial">Solicita tu Día de Prueba</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
