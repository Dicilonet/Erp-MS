'use client';

import React from 'react';
import { Film } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <a href="#" className="flex items-center gap-2 font-semibold text-lg">
            <Film className="h-6 w-6 text-red-400" />
            <span>Showtime Productions</span>
        </a>
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Showtime Productions. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
