'use client';

import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { useEffect, useState } from 'react';
import { FullScreenLoader } from './ui/fullscreen-loader';

export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Asegurarse de que i18n esté inicializado en el cliente
    if (i18n.isInitialized) {
      setIsReady(true);
    } else {
      // Si no está listo, esperar al evento 'initialized'
      i18n.on('initialized', () => {
        setIsReady(true);
      });
    }

    return () => {
      // Limpiar el listener al desmontar el componente
      i18n.off('initialized');
    };
  }, []);

  // Muestra un esqueleto de carga mientras i18n se inicializa.
  // Esto previene el renderizado de componentes que dependen de la traducción
  // antes de que la librería esté lista.
  if (!isReady) {
    return <FullScreenLoader />;
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}
