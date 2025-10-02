
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import type { NavItem } from "@/lib/types";
import { Button } from "./ui/button";
import { FC } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { SheetClose } from "@/components/ui/sheet";

interface DashboardSidebarProps {
    navItems: NavItem[];
    isSheet?: boolean;
}

const NavLink: FC<{
    isSheet?: boolean;
    children: React.ReactNode;
}> = ({ isSheet, children }) => {
    if (isSheet) {
        return <SheetClose asChild>{children}</SheetClose>;
    }
    return <>{children}</>;
};

export function DashboardSidebar({ navItems, isSheet = false }: DashboardSidebarProps) {
    const pathname = usePathname();
    const { t } = useTranslation('common');

    return (
        <div className={cn("flex flex-col h-full", isSheet ? "w-full" : "w-[250px]")}>
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <LayoutGrid className="h-6 w-6" />
                    <span className="text-lg">M&SOLUTIONS</span>
                </Link>
            </div>
            <nav className="flex-1 space-y-2 p-2">
                {navItems.map((item) => (
                    <NavLink key={item.href} isSheet={isSheet}>
                        <Link href={item.href}>
                            <Button
                                variant={pathname.startsWith(item.href) && item.href !== '/' || pathname === '/' && item.href === '/' ? 'secondary' : 'ghost'}
                                className="w-full justify-start text-base"
                            >
                                {item.icon}
                                <span className="ml-4">{item.label}</span>
                            </Button>
                        </Link>
                    </NavLink>
                ))}
            </nav>
            <nav className="mt-auto border-t p-2">
                <NavLink isSheet={isSheet}>
                    <Link href="/settings">
                        <Button
                            variant={pathname.startsWith('/settings') ? 'secondary' : 'ghost'}
                            className="w-full justify-start text-base"
                        >
                            <Settings className="h-5 w-5" />
                            <span className="ml-4">{t('settings')}</span>
                        </Button>
                    </Link>
                </NavLink>
            </nav>
        </div>
    );
}

    