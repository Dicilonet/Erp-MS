'use client';

export function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Praxis Modern. Todos los derechos reservados.
        </p>
        <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
          <a href="#" className="hover:text-cyan-600">Aviso Legal</a>
          <a href="#" className="hover:text-cyan-600">Política de Privacidad</a>
        </div>
      </div>
    </footer>
  );
}
