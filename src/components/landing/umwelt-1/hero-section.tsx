'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Leaf } from 'lucide-react';

export function HeroSection() {
  return (
    <header className="relative flex h-[70vh] min-h-[500px] flex-col items-center justify-center text-center text-white">
      <div className="absolute inset-0 bg-black/60 z-10" />
      <video
        src="https://videos.pexels.com/video-files/853874/853874-hd.mp4"
        autoPlay
        loop
        muted
        className="absolute z-0 h-full w-full object-cover"
      />
      <div className="relative z-20 flex flex-col items-center px-4">
        <div className="mb-4 flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
          <Leaf className="h-5 w-5" />
          <span className="font-semibold">Planeta Vivo</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-2xl sm:text-5xl md:text-6xl">
          Protegiendo Nuestro Único Hogar
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-200 drop-shadow-lg">
          Únete a nuestra misión de conservar la biodiversidad, restaurar ecosistemas y promover un futuro sostenible para todos.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild className="bg-emerald-600 hover:bg-emerald-700">
            <a href="#help">Únete a la Causa</a>
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
            <a href="#projects">Nuestros Proyectos</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
