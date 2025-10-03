
'use client';

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <a href="#" className="font-bold text-xl">Grand Hotel Elysium</a>
          <p className="text-sm text-gray-400 mt-1">Excelencia en cada detalle.</p>
        </div>
        <div className="flex gap-4">
          {/* Social Icons Placeholder */}
        </div>
        <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Grand Hotel Elysium. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
