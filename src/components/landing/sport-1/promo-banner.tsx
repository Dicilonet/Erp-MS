'use client';

import React from 'react';
import { Zap } from 'lucide-react';

export function PromoBanner() {
  return (
    <div className="bg-amber-400 text-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 text-center font-semibold">
        <a href="#trial" className="flex items-center justify-center gap-2 group">
          <Zap className="h-5 w-5 animate-pulse" />
          <span>¡Oferta Especial del Mes! Tu primer día de prueba es GRATIS. <span className="underline group-hover:text-gray-700">¡Reserva ahora!</span></span>
        </a>
      </div>
    </div>
  );
}