'use client';

import { Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <header className="relative flex h-[70vh] min-h-[500px] flex-col items-center justify-center text-center text-white">
      <div className="absolute inset-0 bg-black/40 z-10" />
      <img
        src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1770&auto=format&fit=crop"
        alt="Profesional de la salud con tablet"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="relative z-20 flex flex-col items-center px-4">
        <div className="mb-4 flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
          <Stethoscope className="h-5 w-5" />
          <span className="font-semibold">Praxis Modern</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-2xl sm:text-5xl md:text-6xl">
          Tu Salud, Nuestra Prioridad
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-200 drop-shadow-lg">
          Combinamos tecnología de vanguardia y un trato humano excepcional para ofrecerte el mejor cuidado.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild className="bg-cyan-600 hover:bg-cyan-700">
            <a href="#contact">Pedir Cita</a>
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
            <a href="#services">Nuestros Servicios</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
