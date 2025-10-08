'use client';

import React from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';
import { useEffect, useState, Suspense } from 'react';
import { FullScreenLoader } from './ui/fullscreen-loader';

// Este componente hijo asegura que useTranslation se ejecute solo después de la inicialización
const WaitForTranslation = ({ children }: { children: React.ReactNode }) => {
  const { i18n: i18nInstance } = useTranslation();
  const [isReady, setIsReady] = useState(i18nInstance.isInitialized);

  useEffect(() => {
    if (!isReady) {
      const initialized = () => setIsReady(true);
      i18nInstance.on('initialized', initialized);
      return () => {
        i18nInstance.off('initialized', initialized);
      };
    }
  }, [isReady, i18nInstance]);

  if (!isReady) {
    return <FullScreenLoader />;
  }

  return <>{children}</>;
};


export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <I18nextProvider i18n={i18n}>
      <WaitForTranslation>{children}</WaitForTranslation>
    </I18nextProvider>
  );
}
