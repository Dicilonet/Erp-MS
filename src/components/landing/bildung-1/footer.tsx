'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <a href="#" className="flex items-center gap-2 font-semibold">
            <BookOpen className="h-6 w-6" />
            <span>Academia Futuro</span>
        </a>
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Academia Futuro. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
