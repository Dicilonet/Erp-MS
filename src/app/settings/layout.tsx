
'use client';

import { useTranslation } from 'react-i18next';
import { Settings as SettingsIcon, User, Palette, Shield } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { SidebarNav } from './_components/sidebar-nav';

const sidebarNavItems = [
  {
    titleKey: "profile.title",
    href: "/settings/profile",
    icon: <User />
  },
  {
    titleKey: "security.title",
    href: "/settings/security",
    icon: <Shield />
  },
  {
    titleKey: "tabs.appearance",
    href: "/settings/appearance",
    icon: <Palette />
  },
];


interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const { t } = useTranslation('settings');

  return (
    <>
       <div className="flex items-center gap-4 mt-4 sm:mt-0 mb-6">
            <SettingsIcon className="h-8 w-8" />
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{t('title')}</h1>
            </div>
        </div>
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={sidebarNavItems.map(item => ({...item, title: t(item.titleKey as any)}))} />
        </aside>
        <div className="flex-1 lg:max-w-4xl">{children}</div>
      </div>
    </>
  );
}
