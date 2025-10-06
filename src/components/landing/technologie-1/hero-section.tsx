'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

export function HeroSection() {
  return (
    <header className="relative flex h-[75vh] min-h-[550px] flex-col items-center justify-center text-center text-white overflow-hidden">
      <div className="absolute inset-0 bg-gray-900/70 z-10" />
      <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/30 to-black"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-20 flex flex-col items-center px-4">
         <div className="mb-4 flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
          <Zap className="h-5 w-5 text-indigo-400" />
          <span className="font-semibold">TechFlow</span>
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-2xl sm:text-6xl md:text-7xl">
          El Sistema Operativo para tu Start-up
        </h1>
        <p className="mt-4 max-w-2xl text-xl text-gray-300 drop-shadow-lg">
          Automatiza, analiza y escala tu negocio con nuestra plataforma todo-en-uno impulsada por IA.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild className="bg-indigo-500 hover:bg-indigo-600 text-white text-lg py-6 px-8">
            <a href="#contact">Solicitar una Demo</a>
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 text-lg py-6 px-8">
            <a href="#products">Ver Productos</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
