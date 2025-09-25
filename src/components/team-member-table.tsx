
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import type { InternalUser, UserRole } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Separator } from './ui/separator';

interface TeamMemberTableProps {
    role: UserRole;
    users: InternalUser[]; 
    loading: boolean; 
}

export function TeamMemberTable({ role, users, loading }: TeamMemberTableProps) {
  const { t } = useTranslation('dashboard');
  
  const getInitials = (name: string) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
            {t(`teams.table.${role}.title`)}
        </CardTitle>
        <CardDescription>
          {t(`teams.table.${role}.description`)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Mobile View: Card List */}
        <div className="md:hidden">
            {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="mb-4 rounded-lg border bg-card text-card-foreground shadow-sm p-4 space-y-3">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>
                        <Skeleton className="h-8 w-full" />
                    </div>
                ))
            ) : users.length === 0 ? (
                 <p className="text-center text-muted-foreground py-10">
                  {t('teams.table.noUsers')}
                </p>
            ) : (
                <div className="space-y-4">
                {users.map((user) => (
                    <Card key={user.uid} className="p-4">
                        <div className="flex items-center gap-3 mb-4">
                            <Avatar>
                                <AvatarImage src={user.profile.photoUrl} alt={user.profile.fullName} />
                                <AvatarFallback>{getInitials(user.profile.fullName)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{user.profile.fullName}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                        </div>
                        <Separator className="my-3" />
                        <div className="text-sm space-y-2 mb-4">
                            <p><strong>{t('teams.table.country')}:</strong> {user.profile.country}</p>
                            <p><strong>{t('teams.table.whatsapp')}:</strong> {user.profile.whatsapp}</p>
                        </div>
                         <div className="mt-4">
                           <Link href={`/teams/${user.uid}`} passHref>
                                <Button variant="outline" size="sm" className="w-full">
                                {t('teams.table.viewProfile')}
                                </Button>
                            </Link>
                        </div>
                    </Card>
                ))}
                </div>
            )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>{t('teams.table.name')}</TableHead>
                <TableHead>{t('teams.table.country')}</TableHead>
                <TableHead>{t('teams.table.whatsapp')}</TableHead>
                <TableHead>{t('teams.table.email')}</TableHead>
                <TableHead className="text-right">{t('teams.table.actions')}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                    <TableCell><div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-5 w-32" /></div></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                    </TableRow>
                ))
                ) : users.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                    {t('teams.table.noUsers')}
                    </TableCell>
                </TableRow>
                ) : (
                users.map((user) => (
                    <TableRow key={user.uid}>
                    <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={user.profile.photoUrl} alt={user.profile.fullName} />
                                <AvatarFallback>{getInitials(user.profile.fullName)}</AvatarFallback>
                            </Avatar>
                            <span>{user.profile.fullName}</span>
                        </div>
                    </TableCell>
                    <TableCell>{user.profile.country}</TableCell>
                    <TableCell>{user.profile.whatsapp}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="text-right">
                        <Link href={`/teams/${user.uid}`} passHref>
                            <Button variant="outline" size="sm">
                            {t('teams.table.viewProfile')}
                            </Button>
                        </Link>
                    </TableCell>
                    </TableRow>
                ))
                )}
            </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
