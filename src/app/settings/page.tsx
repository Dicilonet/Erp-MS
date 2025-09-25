
'use client';

// This page now only serves to redirect to the default profile settings page.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FullScreenLoader } from '@/components/ui/fullscreen-loader';

export default function SettingsRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/settings/profile');
  }, [router]);

  return <FullScreenLoader />;
}
