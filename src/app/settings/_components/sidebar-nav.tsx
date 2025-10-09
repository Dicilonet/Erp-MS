
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useToast } from '@/hooks/use-toast'
import { useTranslation } from 'react-i18next'
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon: React.ReactNode
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()
  const { t } = useTranslation('common')
  const { toast } = useToast()

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: t('logout.toastTitle'),
        description: t('logout.toastDescription'),
      });
      // El AuthProvider se encargará de redirigir a /login
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: t('logout.toastError'),
      });
    }
  };


  return (
    <nav
      className={cn(
        "flex flex-col gap-1",
        className
      )}
      {...props}
    >
      {items.map((item) => {
        if (item.href === '#logout') {
            return (
                <button
                    key={item.href}
                    onClick={handleSignOut}
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "justify-start gap-2 text-destructive hover:text-destructive focus:bg-destructive/10 focus:text-destructive"
                    )}
                >
                    {item.icon}
                    {item.title}
                </button>
            )
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname === item.href
                ? "bg-muted hover:bg-muted"
                : "hover:bg-accent hover:text-accent-foreground",
              "justify-start gap-2"
            )}
          >
            {item.icon}
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
