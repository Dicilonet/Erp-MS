'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Music2 } from 'lucide-react';

export function HeroSection() {
  return (
    <header className="relative flex h-[75vh] min-h-[500px] flex-col items-center justify-center text-center text-white">
      <div className="absolute inset-0 bg-black/60 z-10" />
      <video
        src="https://videos.pexels.com/video-files/853829/853829-hd.mp4"
        autoPlay
        loop
        muted
        className="absolute z-0 h-full w-full object-cover"
      />
      <div className="relative z-20 flex flex-col items-center px-4">
        <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-2xl sm:text-6xl md:text-7xl">
          ECLIPSE
        </h1>
        <p className="mt-4 max-w-2xl text-xl text-gray-200 drop-shadow-lg">
          NUEVO ÁLBUM DISPONIBLE AHORA
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild className="bg-purple-600 hover:bg-purple-700 text-lg py-6 px-8">
            <a href="#events">Comprar Tickets Gira 2025</a>
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 text-lg py-6 px-8">
            <a href="#gallery">Escuchar en Spotify</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
