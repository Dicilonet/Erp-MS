
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FullScreenLoader } from '@/components/ui/fullscreen-loader';

// Esta página ahora solo sirve para redirigir a la nueva página de proyectos centralizada.
export default function ProjectsRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/projects');
  }, [router]);

  return <FullScreenLoader />;
}
