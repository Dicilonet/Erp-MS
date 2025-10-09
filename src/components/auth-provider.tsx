
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { DashboardSidebar } from './dashboard-sidebar';
import { useTranslation } from 'react-i18next';
import { BarChart, Users, FolderKanban, FileText, Receipt, LifeBuoy, Mail, FolderSync, ShieldCheck, Package, MessageSquare, Briefcase, CheckSquare } from 'lucide-react';
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
const landingPagesPrefix = '/articulos/landing-pages';
const mainLanding = '/';

function AuthRedirect({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        const isPublic = publicRoutes.some(route => pathname.startsWith(route)) || pathname === mainLanding || pathname.startsWith(landingPagesPrefix);

        if (!user && !isPublic) {
            router.push('/login');
        }
        
        // CORRECCIÓN: Evitar el bucle de redirección en la página de inicio
        if (user && (pathname === '/login' || pathname === '/signup')) {
            router.push('/dashboard');
        }

    }, [isLoading, user, pathname, router]);

    return <>{children}</>;
}


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation(['common', 'marketing']);
  const [user, setUser] = useState<User | null>(null);
  const [isSuperadmin, setIsSuperadmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true); 
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


 const navItems: NavItem[] = [
    { href: "/dashboard", label: t('nav.dashboard'), icon: <BarChart /> },
    { href: "/admin/todo-list", label: t('nav.todoList'), icon: <CheckSquare /> },
    { href: "/chat", label: t('nav.chat'), icon: <MessageSquare /> },
    { href: "/customers", label: t('nav.customers'), icon: <Users /> },
    { href: "/admin/projects", label: t('nav.projects'), icon: <FolderKanban /> },
    { href: "/marketing/coupons", label: t('nav.marketing', {ns: 'common'}), icon: <Briefcase /> },
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
  
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route)) || pathname === mainLanding || pathname.startsWith(landingPagesPrefix);

  if (isLoading) {
    return <FullScreenLoader />;
  }
  
  const showDashboardLayout = user && !isPublicRoute;

  return (
    <AuthContext.Provider value={value}>
        <AuthRedirect>
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
        </AuthRedirect>
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
