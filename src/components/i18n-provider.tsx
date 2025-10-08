'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { Suspense, useEffect, useState } from 'react';
import { FullScreenLoader } from './ui/fullscreen-loader';

// Este componente ahora simplemente envuelve la aplicación con el proveedor de i18next
// y usa un estado para asegurar que solo se renderice en el cliente.
export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Solo se ejecuta en el lado del cliente
    if (typeof window !== 'undefined' && !i18n.isInitialized) {
      i18n.init().then(() => {
        setIsClient(true);
      });
    } else if (i18n.isInitialized) {
      setIsClient(true);
    }
  }, []);

  if (!isClient) {
    return <FullScreenLoader />;
  }

  return (
    <Suspense fallback={<FullScreenLoader />}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </Suspense>
  );
}
