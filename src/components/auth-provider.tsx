
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { DashboardSidebar } from './dashboard-sidebar';
import { useTranslation } from 'react-i18next';
import { BarChart, Users, FolderKanban, FileText, Receipt, LifeBuoy, Mail, FolderSync, ShieldCheck, Library, Calendar, CheckSquare, Package, MessageSquare, Briefcase } from 'lucide-react';
import type { NavItem } from '@/lib/types';
import { DashboardHeader } from './dashboard-header';
import { FullScreenLoader } from './ui/fullscreen-loader';

interface AuthContextType {
    user: User | null;
    isSuperadmin: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Lista de rutas públicas exactas o prefijos de ruta
const publicRoutes = ['/login', '/signup', '/redeem', '/', '/articulos/landing-pages', '/forms/embed'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation(['common', 'marketing']);
  const [user, setUser] = useState<User | null>(null);
  const [isSuperadmin, setIsSuperadmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true); 
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            try {
                const idTokenResult = await firebaseUser.getIdTokenResult();
                setUser(firebaseUser);
                setIsSuperadmin(idTokenResult.claims.role === 'superadmin');
            } catch (error) {
                console.error("Error fetching user claims:", error);
                setUser(null);
                setIsSuperadmin(false);
            }
        } else {
            setUser(null);
            setIsSuperadmin(false);
        }
        setIsLoading(false); 
    });

    return () => unsubscribe();
  }, []); 

  useEffect(() => {
    if (isLoading) {
        return;
    }

    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    // Si el usuario no está logueado y la ruta no es pública, lo mandamos a login.
    if (!user && !isPublicRoute) {
        router.push('/login');
    }

    // Si el usuario está logueado e intenta acceder a login/signup, lo mandamos al dashboard.
    // O si está en la landing ('/'), también lo mandamos al dashboard.
    if (user && (pathname === '/login' || pathname === '/signup' || pathname === '/')) {
        router.push('/dashboard');
    }
  }, [isLoading, user, pathname, router]);

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  if (isLoading || (!user && !isPublicRoute)) {
    return <FullScreenLoader />;
  }

 const navItems: NavItem[] = [
    { href: "/dashboard", label: t('nav.dashboard'), icon: <BarChart /> },
    { href: "/admin/todo-list", label: t('nav.todoList'), icon: <CheckSquare /> },
    { href: "/chat", label: t('nav.chat'), icon: <MessageSquare /> },
    { href: "/customers", label: t('nav.customers'), icon: <Users /> },
    { href: "/admin/projects", label: t('nav.projects'), icon: <FolderKanban /> },
    { href: "/marketing", label: t('nav.marketing', {ns: 'common'}), icon: <Briefcase /> },
    { href: "/articulos", label: t('nav.articles'), icon: <Package /> },
    { href: "/offers", label: t('nav.offers'), icon: <FileText /> },
    { href: "/expenses", label: t('nav.expenses'), icon: <Receipt /> },
    { href: "/support", label: t('nav.support'), icon: <LifeBuoy /> },
    { href: "/communications/email", label: t('nav.email'), icon: <Mail /> },
  ];

  if (isSuperadmin) {
    navItems.push({ href: "/connections", label: t('nav.connections'), icon: <FolderSync /> });
    navItems.push({ href: "/teams", label: t('nav.teams'), icon: <ShieldCheck /> });
  }

  const value = { user, isSuperadmin, isLoading };
  
  const showDashboardLayout = user && !isPublicRoute;

  return (
    <AuthContext.Provider value={value}>
      {showDashboardLayout ? (
        <div className="md:grid md:grid-cols-[250px_1fr] w-full">
            <div className="hidden md:block border-r bg-background h-screen">
                <DashboardSidebar navItems={navItems} />
            </div>
            <div className="flex flex-col h-screen">
              <DashboardHeader navItems={navItems} />
              <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
                {children}
              </main>
            </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
