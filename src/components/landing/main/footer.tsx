'use client';

import { useTranslation } from 'react-i18next';
import { LayoutGrid } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  const { t } = useTranslation('landing');
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-6 w-6 text-primary" />
          <span className="font-semibold">M&SOLUTIONS</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {t('footer.copyright')}
        </p>
        <div className="flex gap-4 text-sm">
          <Link href="#" className="text-muted-foreground hover:text-primary">
            {t('footer.legal')}
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-primary">
            {t('footer.privacy')}
          </Link>
           <Link href="/login" className="font-semibold text-primary hover:underline">
            {t('footer.login')}
          </Link>
        </div>
      </div>
    </footer>
  );
}