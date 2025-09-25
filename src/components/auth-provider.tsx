
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { DashboardSidebar } from './dashboard-sidebar';
import { useTranslation } from 'react-i18next';
import { BarChart, Users, FolderKanban, FileText, Receipt, LifeBuoy, Mail, FolderSync, ShieldCheck, Library, CheckSquare, Package, MessageSquare } from 'lucide-react';
import type { NavItem } from '@/lib/types';
import { DashboardHeader } from './dashboard-header';
import { FullScreenLoader } from './ui/fullscreen-loader';

interface AuthContextType {
    user: User | null;
    isSuperadmin: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const publicRoutes = ['/login', '/signup', '/redeem'];

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
                // Obtenemos el token y sus claims para verificar el rol
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


    if (!user && !isPublicRoute) {
        router.push('/login');
    }

    if (user && isPublicRoute && pathname !== '/redeem') {
        router.push('/');
    }
  }, [isLoading, user, pathname, router]);


  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  if (isLoading || (!user && !isPublicRoute) || (user && isPublicRoute && pathname !== '/redeem')) {
    return <FullScreenLoader />;
  }

 const navItems: NavItem[] = [
    { href: "/", label: t('nav.dashboard', {ns: 'common'}), icon: <BarChart /> },
    { href: "/admin/todo-list", label: t('nav.todoList', {ns: 'common'}), icon: <CheckSquare /> },
    { href: "/chat", label: t('nav.chat', {ns: 'common'}), icon: <MessageSquare /> },
    { href: "/customers", label: t('nav.customers', {ns: 'common'}), icon: <Users /> },
    { href: "/admin/projects", label: t('nav.projects', {ns: 'common'}), icon: <FolderKanban /> },
    { href: "/marketing/coupons", label: t('nav.marketing', {ns: 'common'}), icon: <Library /> },
    { href: "/articulos", label: t('nav.articles', {ns: 'common'}), icon: <Package /> },
    { href: "/offers", label: t('nav.offers', {ns: 'common'}), icon: <FileText /> },
    { href: "/expenses", label: t('nav.expenses', {ns: 'common'}), icon: <Receipt /> },
    { href: "/support", label: t('nav.support', {ns: 'common'}), icon: <LifeBuoy /> },
    { href: "/communications/email", label: t('nav.email', {ns: 'common'}), icon: <Mail /> },
  ];

  if (isSuperadmin) {
    navItems.push({ href: "/connections", label: t('nav.connections', {ns: 'common'}), icon: <FolderSync /> });
    navItems.push({ href: "/teams", label: t('nav.teams', {ns: 'common'}), icon: <ShieldCheck /> });
  }

  const value = { user, isSuperadmin, isLoading };

  return (
    <AuthContext.Provider value={value}>
      {isPublicRoute ? (
        children
      ) : (
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
