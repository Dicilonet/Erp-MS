
'use client';

import { Building } from 'lucide-react';

export function HeroSection() {
  return (
    <header className="relative flex h-[75vh] min-h-[500px] flex-col items-center justify-center text-center text-white">
      <div className="absolute inset-0 bg-black/50 z-10" />
      <img
        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1770&auto=format&fit=crop"
        alt="Lujoso lobby de hotel"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="relative z-20 flex flex-col items-center px-4">
        <div className="mb-4 flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
          <Building className="h-5 w-5" />
          <span className="font-semibold">Grand Hotel Elysium</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-2xl sm:text-5xl md:text-6xl">
          Una Estancia Inolvidable
        </h1>
        <p className="mt-4 max-w-xl text-lg text-gray-200 drop-shadow-lg">
          Lujo, confort y un servicio impecable le esperan en el corazón de la ciudad.
        </p>
        <a
          href="#booking"
          className="mt-8 inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold shadow-lg transition hover:bg-blue-700"
        >
          Reservar Ahora
        </a>
      </div>
    </header>
  );
}
