
'use client';

import React from 'react';

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Del Campo a tu Mesa. Todos los derechos reservados.
        </p>
        <div className="flex gap-4 text-sm text-gray-300">
          <a href="#" className="hover:text-emerald-400">Política de Cookies</a>
          <a href="#" className="hover:text-emerald-400">Términos de Servicio</a>
        </div>
      </div>
    </footer>
  );
}
