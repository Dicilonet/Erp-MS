'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Film } from 'lucide-react';

export function HeroSection() {
  return (
    <header className="relative flex h-[75vh] min-h-[550px] flex-col items-center justify-center text-center text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/60 z-10" />
      <video
        src="https://videos.pexels.com/video-files/853877/853877-hd.mp4"
        autoPlay
        loop
        muted
        className="absolute z-0 h-full w-full object-cover"
      />
      <div className="relative z-20 flex flex-col items-center px-4">
         <div className="mb-4 flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
          <Film className="h-5 w-5 text-red-400" />
          <span className="font-semibold">Showtime Productions</span>
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-2xl sm:text-6xl md:text-7xl">
          Donde la Magia Sucede
        </h1>
        <p className="mt-4 max-w-2xl text-xl text-gray-200 drop-shadow-lg">
          Creamos espectáculos, eventos y contenido que inspiran, emocionan y conectan con la audiencia.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild className="bg-red-600 hover:bg-red-700 text-lg py-6 px-8">
            <a href="#events">Ver Próximos Eventos</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
