'use client';

import React from 'react';

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Tu Coach Personal. Todos los derechos reservados.
        </p>
        <div className="flex gap-4 text-sm text-gray-300">
          <a href="#" className="hover:text-indigo-400">Aviso Legal</a>
          <a href="#" className="hover:text-indigo-400">Política de Privacidad</a>
        </div>
      </div>
    </footer>
  );
}
