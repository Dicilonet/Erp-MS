
'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Project, InternalUser } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, Pencil, Search, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { CreateProjectForm } from '@/components/create-project-form';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase';
import { useAuth } from '@/components/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';


export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<Record<string, InternalUser>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, isSuperadmin } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation('projects');

  const getInitials = (name: string) => {
    if (!name) return '?';
    const names = name.split(' ');
    return names.length > 1 ? `${names[0][0]}${names[1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    if (!user) return;

    // Fetch all users once and create a map
    const fetchUsers = async () => {
        const usersRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersRef);
        const usersMap: Record<string, InternalUser> = {};
        querySnapshot.forEach(doc => {
            usersMap[doc.id] = { ...doc.data(), uid: doc.id } as InternalUser;
        });
        setTeamMembers(usersMap);
    };
    fetchUsers();

    // Setup real-time listener for projects based on user role
    let q;
    if (isSuperadmin) {
        q = query(collection(db, 'projects'));
    } else {
        q = query(collection(db, 'projects'), where("assignedTeam", "array-contains", user.uid));
    }
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        ...doc.data(),
        projectId: doc.id,
      })) as Project[];
      setProjects(projectsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching projects: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, isSuperadmin]);

  const filteredAndSortedProjects = useMemo(() => {
    const statusOrder: { [key: string]: number } = { 'En Progreso': 1, 'Planificación': 2, 'Pausado': 3, 'Completado': 4 };
    
    return projects
      .filter(p => {
        const term = searchTerm.toLowerCase();
        return (p.projectName?.toLowerCase() || '').includes(term) || (p.clientName?.toLowerCase() || '').includes(term);
      })
      .sort((a, b) => {
        const statusDiff = (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
        if (statusDiff !== 0) return statusDiff;
        return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
      });
  }, [projects, searchTerm]);

  const renderSkeletons = () => (
    Array.from({ length: 5 }).map((_, i) => (
      <TableRow key={i}>
        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
        <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
      </TableRow>
    ))
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 sm:mt-0 gap-4">
        <div className="flex-1 self-start">
            <h1 className="text-2xl sm:text-3xl font-bold">{t('title')}</h1>
            <p className="text-muted-foreground">{t('description')}</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center gap-2">
           <div className="relative w-full sm:w-auto flex-1 sm:flex-none">
             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input 
                placeholder={t('searchPlaceholder')}
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           <CreateProjectForm>
            <Button className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                {t('createButton')}
            </Button>
            </CreateProjectForm>
        </div>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t('list.title')}</CardTitle>
          <CardDescription>{t('list.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('list.table.name')}</TableHead>
                <TableHead>{t('list.table.client')}</TableHead>
                <TableHead>{t('list.table.owner')}</TableHead>
                <TableHead>{t('list.table.status')}</TableHead>
                <TableHead>{t('list.table.endDate')}</TableHead>
                <TableHead className="text-right">{t('list.table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? renderSkeletons() : filteredAndSortedProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {searchTerm ? t('list.noResults', { term: searchTerm }) : t('list.noProjects')}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedProjects.map((project) => (
                  <TableRow key={project.projectId}>
                    <TableCell className="font-medium">{project.projectName}</TableCell>
                    <TableCell>{project.clientName}</TableCell>
                    <TableCell>
                        {teamMembers[project.projectOwner] ? (
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={teamMembers[project.projectOwner].profile.photoUrl} />
                                    <AvatarFallback>{getInitials(teamMembers[project.projectOwner].profile.fullName)}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs">{teamMembers[project.projectOwner].profile.fullName}</span>
                            </div>
                        ) : (
                             <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{t('list.unassigned')}</span>
                            </div>
                        )}
                    </TableCell>
                    <TableCell><Badge variant="outline">{project.status}</Badge></TableCell>
                    <TableCell>{new Date(project.endDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                       <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/projects/${project.projectId}`}>
                                {t('list.viewDetails')}
                            </Link>
                       </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
